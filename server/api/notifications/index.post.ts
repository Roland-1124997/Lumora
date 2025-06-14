export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const request = await readBody(event)

    const { data, error } = await server.from('push_subscriptions').upsert({
        user_id: user.id,
        subscription: request.subscription,
    })

    if(error) return useReturnResponse(event, internalServerError)

    return useReturnResponse(event, {
        status: {
            success: true,
            code: 200,
            message: "OK",
        }
    })

});