export default defineSupabaseEventHandler(async (event, user, client, server) => {
    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, image_id, comment_id } = getRouterParams(event);

    const { error: memberError } = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).eq("accepted", true).single<Tables<"members">>()
    if (memberError) return useReturnResponse(event, forbiddenError);

    const { data: settings, error: settingsError } = await server.from("group_settings").select("*").eq("group_id", group_id).single<Tables<"group_settings">>()
    if ((settings && !settings.social_interactions) || settingsError) return useReturnResponse(event, forbiddenError)

    const request = await readBody(event);

    const { data: comment, error: commentError } = await client.from("posts_comments").select("*").eq("id", comment_id).eq("group_id", group_id).single<Tables<"posts_comments">>();

    if (commentError) return useReturnResponse(event, forbiddenError);
    if (comment.author_id != user.id || comment.content == "This comment has been deleted") return useReturnResponse(event, forbiddenError)

    const { data, error } = await client.from("posts_comments").update({
        content: request.comment
    }).eq("id", comment_id).select().single<Tables<"posts_comments">>();

    if (error) return useReturnResponse(event, internalServerError);

    const { error: logError } = await server.from("logbook").insert({
        message: `Edited a comment on image`,
        performed_by_id: user.id,
        action_type: "updated",
        group_id: group_id,
        context: {
            id: `${data.id.split("-")[0]}-${user.id.split("-")[4]}`,
            "new content": request.comment,
            "old content": comment.content
        }
    });

    if (logError) return useReturnResponse(event, internalServerError);

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "success",
            code: 200
        }
    })
});