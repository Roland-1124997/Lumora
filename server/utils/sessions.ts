import type { User } from '@supabase/auth-js';
import type { SupabaseClient } from "@supabase/supabase-js";
import type { H3Event } from "h3";

export const useGetSession = async (client: SupabaseClient, currentSession: Session) => {
    return await client.auth.getUser(currentSession.access_token);
}

export const useRefreshSession = async (client: SupabaseClient, currentSession: Session) => {
    const result = await client.auth.refreshSession(currentSession);
    return result;
}

export const useDeleteSession = async (client: SupabaseClient) => {
    return await client.auth.signOut();
}

export const useSetSessionData = (user: User) => {
    return {
        id: user.id,
        name: user.user_metadata.name,
        email: {
            verified: user.user_metadata.email_verified,
        },
    };
}

export const useSessionExists = async (event: H3Event, client: SupabaseClient, time: number) => {

    const currentSession = useGetCookies(event);
    let { data, error } = await useGetSession(client, currentSession);

    if (error) error = useReturnResponse(event, time, unauthorizedError);

    return { data, error };
}







