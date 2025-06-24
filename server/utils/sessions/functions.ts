
export const useGetSession = async (client: SupabaseClient, currentSession: Session | Omit<Session, "user">) => {
    return await client.auth.getUser(currentSession.access_token || "non_Existing");
}

export const useRefreshSession = async (client: SupabaseClient, currentSession: Session | Omit<Session, "user">) => {
    const result = await client.auth.refreshSession(currentSession);
    return result;
}

export const useDeleteSession = async (client: SupabaseClient) => {
    return await client.auth.signOut();
}
export const useSetSessionData = async (event: H3Event, user: User | null) => {
    if (user) {

        fetch(user.user_metadata.avatar_url || `/attachments/avatar/${user.id}`).catch(() => { })

        const server: SupabaseClient = serverSupabaseServiceRole(event)
        const { data } = await server.from("factor_sessions").select("*").eq("user_id", user.id).single()

        const cookie = getCookie(event, "opt-verified")
        const { data: subscriptions }: any = await server.from("push_subscriptions").select("*").eq("user_id", user.id).single()

        if (!data || cookie) return {
            id: user.id as string,
            name: user.user_metadata.name,
            avatar: user.user_metadata.avatar_url || `/attachments/avatar/${user.id}`,
            email: user.user_metadata.email || user.email,
            team: user.app_metadata.plan == "team" || false,
            provider: user.app_metadata.provider,
            factors: !!user.factors,
            subscriptions: !!subscriptions
        }

        return {
            mfa_needs_to_verfied: !!data,
        }
    }

    return
}

export const useSessionExists = async (event: H3Event, client: SupabaseClient) => {

    const currentSession = useGetCookies(event);
    const { data, error } = await useGetSession(client, currentSession);

    return { data: data?.user, error };
}



export const useStateChange = async (client: SupabaseClient) => {

    let state: string

    return new Promise<string>((resolve) => {
        client.auth.onAuthStateChange((event, session) => {
            state = event;
            resolve(state);
        });
    });
}