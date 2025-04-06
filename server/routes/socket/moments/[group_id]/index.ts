export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id } = getRouterParams(event)

    const { data, error } = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).single()
    if (error) return useReturnResponse(event, notFoundError);

    const eventStream = createEventStream(event);
    const { getPayLoad, deletePayLoad } = userServerSocket()

    const interval = setInterval(async () => {

        const payload: any = getPayLoad()
        if (payload && payload.data.group_id === data.group_id) {

            await eventStream.push(JSON.stringify(payload));
            setTimeout(() => deletePayLoad(), 5);
        }
    
    }, 10);

    eventStream.onClosed(() => {
        clearInterval(interval);
    });

    return eventStream.send();
});


