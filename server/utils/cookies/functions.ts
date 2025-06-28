
export const useGetCookies = (event: H3Event) => {

    const accessToken = getCookie(event, "access-token");
    const refreshToken = getCookie(event, "refresh-token");

    const currentSession: Omit<Session, "user"> | null = {
        refresh_token: refreshToken as string,
        access_token: accessToken as string,
        expires_in: 0,
        token_type: "",
    };

    return currentSession;
}

export const useSetCookies = (event: H3Event, session: Omit<Session, "user"> | null) => {
    if (session) {
        setCookie(event, "access-token", session.access_token, {
            maxAge: 60 * 30, // Cookie valid for 30 minutes
            httpOnly: true,
        });

        setCookie(event, "refresh-token", session.refresh_token, {
            maxAge: 60 * 60 * 24 * 14, // Cookie valid for 14 days
            httpOnly: true,
        });
    }
}

export const useDeleteCookies = async (event: H3Event) => {
    deleteCookie(event, "access-token");
    deleteCookie(event, "refresh-token");

    deleteCookie(event, "storage-token");
    deleteCookie(event, "storage-token.0");
    deleteCookie(event, "storage-token.1");

    deleteCookie(event, "opt-verified");
}
