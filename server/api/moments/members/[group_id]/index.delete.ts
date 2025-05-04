
export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id } = getRouterParams(event);

    const { error } = await client.from("members").delete().eq("user_id", user.id).eq("group_id", group_id)
    if (error) return useReturnResponse(event, notFoundError)

    const { error: user_left_error } = await server.from("posts").update({ user_left: true }).eq("author_id", user.id).eq("group_id", group_id).select("*")
    if (user_left_error) return useReturnResponse(event, internalServerError)

    const { error: logError } = await server.from("logbook").insert({
        message: "Left the group on their own",
        performed_by_id: user.id,
        action_type: "deleted",
        group_id: group_id,
    })

    if (logError) return useReturnResponse(event, internalServerError)

    return useReturnResponse(event, {
        status: {
            success: true,
            redirect: `/moments/`,
            message: "Ok",
            code: 200
        },
    });
})
