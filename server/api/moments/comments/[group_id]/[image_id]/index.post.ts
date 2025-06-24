export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, image_id } = getRouterParams(event);

    const { error: memberError } = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).eq("accepted", true).single<Tables<"members">>()
    if (memberError) return useReturnResponse(event, forbiddenError);

    const { data: settings, error: settingsError } = await server.from("group_settings").select("*").eq("group_id", group_id).single<Tables<"group_settings">>()
    if ((settings && !settings.social_interactions) || settingsError) return useReturnResponse(event, forbiddenError)

    const request = await readBody(event);

    if (request.parent_id) {
        const { data: comment, error: commentError } = await client.from("posts_comments").select("*").eq("id", request.parent_id).eq("group_id", group_id).single<Tables<"posts_comments">>();

        if (commentError) return useReturnResponse(event, forbiddenError);
        if (comment.author_id == user.id) return useReturnResponse(event, forbiddenError)
    }

    const { data, error } = await client.from("posts_comments").insert({
        group_id: group_id,
        post_id: image_id,
        parent_id: request.parent_id || null,
        content: request.comment
    }).select().single<Tables<"posts_comments">>();

    if (error) return useReturnResponse(event, internalServerError);

    const { count } = await client.from("posts_comments").select("*", { count: "exact" }).eq("post_id", image_id).eq("group_id", group_id)
    await server.from("posts").update({ comments: count }).eq("id", image_id).eq("group_id", group_id)
    
    const { error: logError } = await server.from("logbook").insert({
        message: `Left a comment on image`,
        performed_by_id: user.id,
        action_type: "created",
        group_id: group_id,
        context: {
            id: `${data.id.split("-")[0]}-${user.id.split("-")[4]}`,
            "parent id": `${image_id.split("-")[0]}-${user.id.split("-")[4]}`,
            content: request.comment
        }
    })

    if (logError) return useReturnResponse(event, internalServerError);

    const { data: post, error: postError } = await server.from("posts").select("*").eq("id", image_id).eq("group_id", group_id).single<Tables<"posts">>();
    if (postError) return useReturnResponse(event, notFoundError);

    if (post.author_id != user.id) await server.from("notifications").insert({
        group_id: group_id,
        post_id: image_id,
        comment_id: data.id,
        target_id: post.author_id,
        title: `You’ve got a comment`,
        message: `Somone has left a comment on your post. Check it out!`,
        type: "comment",
    })

    await useSendNotification({
        title: `You’ve got a comment`,
        message: `Somone has left a comment on your post. Check it out!`,
        target_id: post.author_id as string,
    }).catch(() => {
        console.error("Failed to send notification");
    });

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

})