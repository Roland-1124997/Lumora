export const defineSupabaseEventHandler = (callback: (event: H3Event, user: User | null, client: SupabaseClient, server: SupabaseClient) => any) => {
    return defineEventHandler(async (event: H3Event) => {

        const client: SupabaseClient = await serverSupabaseClient(event);
        const server: SupabaseClient = serverSupabaseServiceRole(event)

        const { data: user, error } = await useSessionExists(event, client);
        if (error) return useReturnResponse(event, unauthorizedError)

        return callback(event, user, client, server)

    })
}
