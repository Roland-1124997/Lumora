export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id } = getRouterParams(event)

    const { error } = await client.from("groups").select("*").eq("id", group_id).single()
    if (error) return useReturnResponse(event, notFoundError);

    const eventStream = createEventStream(event);
    const { getPayLoad, deletePayLoad } = userServerSocket()

    const interval = setInterval(async () => {

        const payload = getPayLoad()

        if (payload) {
            await eventStream.push(payload);
            setTimeout(() => deletePayLoad(), 0);
        }
    
    }, 10);

    eventStream.onClosed(() => {
        clearInterval(interval);
    });

    return eventStream.send();
});


