import type { H3Event } from "h3";

export const useGetCookies = (event: H3Event) => {
    
    const accessToken = getCookie(event, "sb-access-token");
    const refreshToken = getCookie(event, "sb-refresh-token");

    const currentSession: Session = {
        refresh_token: refreshToken as string,
        access_token: accessToken as string,
    };

    return currentSession;
}

export const useSetCookies = (event: H3Event, session: Session) => {
    setCookie(event, "sb-access-token", session.access_token, {
        maxAge: 60 * 5, // Cookie valid for 5 minutes
        httpOnly: true, 
    });

    setCookie(event, "sb-refresh-token", session.refresh_token, {
        maxAge: 60 * 60 * 24 * 7, // Cookie valid for 7 days
        httpOnly: true,
    });
}

export const useDeleteCookies = (event: H3Event) => {
    deleteCookie(event, "sb-access-token");
    deleteCookie(event, "sb-refresh-token");
}
