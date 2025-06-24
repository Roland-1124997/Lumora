export default defineSupabaseEventHandler(async (event, user, client, server) => {
    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, image_id, comment_id } = getRouterParams(event);

    const { data, error: memberError } = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).eq("accepted", true).single<Tables<"members">>();
    if (!data || memberError) return useReturnResponse(event, forbiddenError);

    const { data: settings, error: settingsError } = await server.from("group_settings").select("*").eq("group_id", group_id).single<Tables<"group_settings">>();
    if ((settings && !settings.social_interactions) || settingsError) return useReturnResponse(event, forbiddenError);

    const { data: comment, error } = await client.from("posts_comments").select("*").eq("id", comment_id).eq("post_id", image_id).eq("group_id", group_id).single<Tables<"posts_comments">>();
    if (comment?.content == "This comment has been deleted" || error) return useReturnResponse(event, notFoundError);
    if (!data.can_delete_messages_all && comment.author_id !== user.id) return useReturnResponse(event, notFoundError);

    const { count: childeren } = await client.from("posts_comments").select("parent_id", { count: "exact" }).eq("parent_id", comment_id).eq("post_id", image_id).eq("group_id", group_id);

    if ((childeren ?? 0) > 0) await server.from("posts_comments").update({ content: "This comment has been deleted" }).eq("id", comment_id).eq("post_id", image_id).eq("group_id", group_id);
    else await server.from("posts_comments").delete().eq("id", comment_id).eq("post_id", image_id).eq("group_id", group_id);

    const { count } = await client.from("posts_comments").select("*", { count: "exact" }).eq("post_id", image_id).eq("group_id", group_id);
    await server.from("posts").update({ comments: count }).eq("id", image_id).eq("group_id", group_id);

    const { error: logError } = await server.from("logbook").insert({
        message: comment.author_id == user.id ? `Deleted their own comment` : "Deleted :member: comment",
        performed_by_id: user.id,
        target_user_id: comment.author_id,
        action_type: "deleted",
        group_id: group_id,
        context: {
            id: `${comment.id.split("-")[0]}-${user.id.split("-")[4]}`,
            "parent id": `${image_id.split("-")[0]}-${user.id.split("-")[4]}`,
            content: comment.content,
        },
    });

    if (logError) return useReturnResponse(event, internalServerError);

    if (comment.author_id != user.id) await server.from("notifications").insert({
        group_id: group_id,
        post_id: image_id,
        target_id: comment.author_id,
        title: `Your comment was removed`,
        message: `Your comment was deleted by a moderator.`,
        type: "comment",
    })

    if (comment.author_id != user.id) await useSendNotification({
        title: `Your comment was removed`,
        message: `Your comment was deleted by a moderator.`,
        target_id: comment.author_id as string,
    }).catch(() => {
        console.error("Failed to send notification");
    });

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "success",
            code: 200,
        },
        data: {
            comments: count,
        },
    });
});
