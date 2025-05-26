export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { notification_id } = getRouterParams(event);

    const { error } = await server.from("notifications").update({ is_read: true }).eq("id", notification_id)

    if (error) return useReturnResponse(event, notFoundError);

    return useReturnResponse(event, {
        status: {
            success: true,
            code: 200,
            message: "OK",
        },
    })
});