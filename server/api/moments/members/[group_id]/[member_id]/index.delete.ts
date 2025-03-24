
export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, member_id } = getRouterParams(event);

    const { error } = await client.from("members").delete().eq("user_id", member_id).eq("group_id", group_id)
    if (error) return useReturnResponse(event, notFoundError)

    return useReturnResponse(event, {
        status: {
            success: true,
            redirect: `/moments/`,
            message: "Ok",
            code: 200
        },
    });
})
