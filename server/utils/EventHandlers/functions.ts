export const defineSupabaseEventHandler = (callback: (event: H3Event, user: User | null, client: SupabaseClient, server: SupabaseClient) => any) => {
    return defineEventHandler(async (event: H3Event) => {

        const client: SupabaseClient = await serverSupabaseClient(event);
        const server: SupabaseClient = serverSupabaseServiceRole(event)

        const { data: user, error } = await useSessionExists(event, client);
        if (error) return useReturnResponse(event, unauthorizedError)

        if (!event.path.startsWith("/api/auth/")) {
            const { data } = await server.from("factor_sessions").select("*").eq("user_id", user?.id).single()

            const cookie = getCookie(event, "sb-opt-verified")

            if (!!data && !cookie) return useReturnResponse(event, unauthorizedError)
        }

        await useStateChange(client)

        return callback(event, user, client, server)

    })
}

export const defineCachedSupabaseEventHandler = (callback: (event: H3Event, user: User | null, client: SupabaseClient, server: SupabaseClient) => any) => {
    return defineCachedEventHandler(async (event: H3Event) => {

        const client: SupabaseClient = await serverSupabaseClient(event);
        const server: SupabaseClient = serverSupabaseServiceRole(event)

        const { data: user, error } = await useSessionExists(event, client);
        if (error) return useReturnResponse(event, unauthorizedError)

        if (!event.path.startsWith("/api/auth/")) {
            const { data } = await server.from("factor_sessions").select("*").eq("user_id", user?.id).single()

            const cookie = getCookie(event, "sb-opt-verified")

            if (!!data && !cookie) return useReturnResponse(event, unauthorizedError)
        }

        await useStateChange(client)

        return callback(event, user, client, server)

    }, { maxAge: 60 * 10, swr: false  })
}


