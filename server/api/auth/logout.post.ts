export default defineSupabaseEventHandler(async (event, user, client) => {

    if (!user) return useReturnResponse(event, unauthorizedError);
    
    const { error } = await useDeleteSession(client)
    if (error) return useReturnResponse(event, badRequestError)

    /*
    ************************************************************************************
    */

    await useDeleteCookies(event)

    return useReturnResponse(event, {
        status: {
            success: true,
            redirect: "/auth",
            message: "Ok",
            code: 200
        }
    })

});
