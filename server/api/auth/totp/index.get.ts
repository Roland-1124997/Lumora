export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { data: factors, error } = await client.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'one_time_code'
    })

    if(error) return useReturnResponse(event, internalServerError)
    
    /*
    ************************************************************************************
    */

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "success",
            code: 200
        },
        data: factors.totp

    });

})








