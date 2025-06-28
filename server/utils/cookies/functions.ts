
export const useGetCookies = async (event: H3Event) => {

    const refreshToken = getCookie(event, "refresh-token");
    const session: any = await serverSupabaseSession(event);

    const currentSession: Omit<Session, "user"> | null = {
        refresh_token: refreshToken as string,
        access_token: session?.access_token || "" as string,
        expires_in: 3600,
        token_type: "bearer",
    };

    return currentSession;
}

export const useSetCookies = (event: H3Event, session: Omit<Session, "user"> | null) => {
    if (session) {
        
        setCookie(event, "socket-token", session.access_token, {
            maxAge: 60 * 60, 
            httpOnly: true,
        });
        
        setCookie(event, "refresh-token", session.refresh_token, {
            maxAge: 60 * 60 * 24 * 14,
            httpOnly: true,
        });
    }
}

export const useDeleteCookies = async (event: H3Event) => {

    deleteCookie(event, "socket-token");
    deleteCookie(event, "refresh-token");

    deleteCookie(event, "access-token");
    deleteCookie(event, "access-token.0");
    deleteCookie(event, "access-token.1");

    deleteCookie(event, "opt-verified");
}
