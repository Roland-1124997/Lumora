export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id } = getRouterParams(event)

    const { data, error } = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).single()
    if (error) return useReturnResponse(event, notFoundError);

    const { create } = useEventStream(event)

    const eventStream = create({
        id: data.group_id,
    })

    return eventStream.send()
    
});


