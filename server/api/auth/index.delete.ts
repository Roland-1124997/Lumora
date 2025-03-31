export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    await server.auth.admin.deleteUser(user.id)

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

