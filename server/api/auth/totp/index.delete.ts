export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { data: factors, error: factorError } = await client.auth.mfa.listFactors()

    if ((factors && !factors.all[0]) || factorError) return useReturnResponse(event, internalServerError)

    await client.auth.mfa.unenroll({
        factorId: factors.all[0].id,
    })

    /*
    ************************************************************************************
    */

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "success",
            code: 200
        },
    });
})








