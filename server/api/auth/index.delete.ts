export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { error } = await server.auth.admin.deleteUser(user.id)

    if (error) return useReturnResponse(event, internalServerError);

    await useDeleteSession(client)
    
    /*
    ************************************************************************************
    */

    return useReturnResponse(event, {
        status: {
            success: true,
            redirect: "/auth",
            message: "success",
            code: 200
        },

    });

})

