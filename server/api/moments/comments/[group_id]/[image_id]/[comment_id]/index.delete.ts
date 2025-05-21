export default defineSupabaseEventHandler(async (event, user, client, server) => {
    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, image_id, comment_id } = getRouterParams(event);

    const { data, error: memberError } = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).eq("accepted", true).single<Tables<"members">>()
    if (!data || !data.can_delete_messages_all || memberError) return useReturnResponse(event, forbiddenError);

    const { data: settings, error: settingsError } = await server.from("group_settings").select("*").eq("group_id", group_id).single<Tables<"group_settings">>()
    if ((settings && !settings.social_interactions) || settingsError) return useReturnResponse(event, forbiddenError)

    const { data: comment, error } = await client.from("posts_comments").select("*").eq("id", comment_id).eq("post_id", image_id).eq("group_id", group_id).single<Tables<"posts_comments">>()
    if (error) return useReturnResponse(event, notFoundError);
    
    await server.from("posts_comments").delete().eq("id", comment_id).eq("post_id", image_id).eq("group_id", group_id)
    
    const { count } = await client.from("posts_comments").select("*", { count: "exact" }).eq("post_id", image_id).eq("group_id", group_id)
    await server.from("posts").update({ comments: count }).eq("id", image_id).eq("group_id", group_id)

    const { error: logError } = await server.from("logbook").insert({
        message: comment.author_id == user.id ? `Deleted their own comment` : 'Deleted :member: comment',
        performed_by_id: user.id,
        target_user_id: comment.author_id,
        action_type: "deleted",
        group_id: group_id,
        context: {
            id: `${comment.id.split("-")[0]}-${user.id.split("-")[4]}`,
            "parent id": `${image_id.split("-")[0]}-${user.id.split("-")[4]}`,
            content: comment.content
        }
    });

    if (logError) return useReturnResponse(event, internalServerError);

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "success",
            code: 200
        },
        data: {
            comments: count,
        }
    })
});
