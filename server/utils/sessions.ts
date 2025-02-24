
export const useGetSession = async (client: SupabaseClient, currentSession: Session|Omit<Session, "user">) => {
    return await client.auth.getUser(currentSession.access_token);
}

export const useRefreshSession = async (client: SupabaseClient, currentSession: Session|Omit<Session, "user">) => {
    const result = await client.auth.refreshSession(currentSession);
    return result;
}

export const useDeleteSession = async (client: SupabaseClient) => {
    return await client.auth.signOut();
}

export const useSetSessionData = (user: User|null) => {
    return user ? {
        id: user.id as string,
        name: user.user_metadata.name as string,
        email: {
            verified: user.user_metadata.email_verified as boolean,
        },
    } : null;
}

export const useSessionExists = async (event: H3Event, client: SupabaseClient, time: number) => {

    const currentSession = useGetCookies(event);
    const { data, error } = await useGetSession(client, currentSession);

    if (error) return { data, errror: useReturnResponse(event, time, unauthorizedError) };
    return { data, error };
}







