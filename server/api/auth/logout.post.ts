export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    await server.from("factor_sessions").delete().eq("user_id", user.id)

    const { error } = await useDeleteSession(client)
    if (error) return useReturnResponse(event, badRequestError)

    /*
    ************************************************************************************
    */

    await useDeleteCookies(event)

    deleteCookie(event, "opt-verified")

    return useReturnResponse(event, {
        status: {
            success: true,
            redirect: "/auth",
            message: "Ok",
            code: 200
        }
    })

});
