export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const {data, error } = await server.auth.admin.deleteUser(user.id)

    console.log(error)

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

