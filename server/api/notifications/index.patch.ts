export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { data, error } = await client.from("notifications").select("*").order("created_at", { ascending: false })
    if (error) return useReturnResponse(event, internalServerError)

    for (const notification of data) {
        if (!notification.is_read) {
            notification.is_read = true;

            await server.from("notifications").update({ is_read: true }).eq("id", notification.id);

        }
    }

    return useReturnResponse(event, {
        status: {
            success: true,
            code: 200,
            message: "OK",
        },
        data
    })
});