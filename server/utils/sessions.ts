import type { User } from '@supabase/auth-js';
import type { SupabaseClient } from "@supabase/supabase-js";

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

