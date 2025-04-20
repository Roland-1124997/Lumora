
export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, member_id } = getRouterParams(event);

    const { error } = await client.from("members").update({ accepted: true}).eq("user_id", member_id).eq("group_id", group_id)
    if (error) return useReturnResponse(event, notFoundError)

    const { error: user_left_error } = await server.from("posts").update({ user_left: false }).eq("author_id", member_id).eq("group_id", group_id).select("*")
    if (user_left_error) return useReturnResponse(event, internalServerError)

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "Ok",
            code: 200
        },
    });
})
