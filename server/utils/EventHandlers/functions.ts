export const defineSupabaseEventHandler = (callback: (event: H3Event, user: User | null, client: SupabaseClient, server: SupabaseClient) => any) => {
    return defineEventHandler(async (event: H3Event) => {

        const client: SupabaseClient = await serverSupabaseClient(event);
        const server: SupabaseClient = serverSupabaseServiceRole(event)

        const { data: user, error } = await useSessionExists(event, client);
        if (error) return useReturnResponse(event, unauthorizedError)

        if (!event.path.startsWith("/api/auth/")) {
            const { data } = await server.from("factor_sessions").select("*").eq("user_id", user?.id).single()
            if (!!data) return useReturnResponse(event, unauthorizedError)
        }
        
        return callback(event, user, client, server)

    })
}
