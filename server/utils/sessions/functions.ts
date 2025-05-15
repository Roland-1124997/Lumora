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
export const useSetSessionData = (event: H3Event, user: User | null) => {
    if (user) {
        fetch(user.user_metadata.avatar_url || `/attachments/avatar/${user.id}`).catch(() => {
        })

        const session = getCookie(event, "sb-mfa-token")

        const mfa_needs_to_verfied = user.factors ? (!session ? false : true) : undefined

        if (mfa_needs_to_verfied === true) {
            return {
                id: user.id as string,
                factors: true,
                mfa_needs_to_verfied: true,
            }
        }

        return {
            id: user.id as string,
            name: user.user_metadata.name || "Anymouses",
            avatar: user.user_metadata.avatar_url || `/attachments/avatar/${user.id}`,
            email: user.user_metadata.email || user.email,
            provider: user.app_metadata.provider,
            factors: !!user.factors,
            mfa_needs_to_verfied,
        }
    }

    return
}

export const useSessionExists = async (event: H3Event, client: SupabaseClient) => {

    const currentSession = useGetCookies(event);
    const { data, error } = await useGetSession(client, currentSession);

    return { data: data?.user, error };
}