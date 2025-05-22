export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, image_id } = getRouterParams(event);

    const { error: memberError } = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).eq("accepted", true).single<Tables<"members">>()
    if (memberError) return useReturnResponse(event, forbiddenError);

    const { data: settings, error: settingsError } = await server.from("group_settings").select("*").eq("group_id", group_id).single<Tables<"group_settings">>()
    if ((settings && !settings.social_interactions) || settingsError) return useReturnResponse(event, forbiddenError)

    const request = await readBody(event);

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

})