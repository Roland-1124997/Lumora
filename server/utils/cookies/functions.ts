
export const useGetCookies = (event: H3Event) => {

    const accessToken = getCookie(event, "sb-access-token");
    const refreshToken = getCookie(event, "sb-refresh-token");

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
        setCookie(event, "sb-access-token", session.access_token, {
            maxAge: 60 * 10, // Cookie valid for 10 minutes
            httpOnly: true,
        });

        setCookie(event, "sb-refresh-token", session.refresh_token, {
            maxAge: 60 * 60 * 24 * 14, // Cookie valid for 14 days
            httpOnly: true,
        });
    }
}

export const useDeleteCookies = async (event: H3Event) => {
    deleteCookie(event, "sb-access-token");
    deleteCookie(event, "sb-refresh-token");
}
