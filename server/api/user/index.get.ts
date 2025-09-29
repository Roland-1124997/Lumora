export default defineEventHandler(async (event) => {

    const client = await serverSupabaseClient(event);
    const server = serverSupabaseServiceRole(event);
    const currentSession = await useGetCookies(event);
    
    const { data, error } = await useGetSession(client, currentSession);
    const token = getCookie(event, "socket-token");

    if(currentSession.access_token && !token) {
        setCookie(event, "socket-token", currentSession.access_token, {
            maxAge: 60 * 60,
            httpOnly: true,
        });
    }

    if (error) {
        const { data, error } = await useRefreshSession(client, currentSession);
        if (!data.session || error) return useReturnResponse(event, unauthorizedError);

        useSetCookies(event, data.session);

        if (data.user?.factors) setCookie(event, "opt-verified", "true", {
            maxAge: 60 * 60 * 24 * 14,
            httpOnly: true,
        })

        await server.rpc("track_monthly_user", {
            uid: data.user?.id,
        });

        return useReturnResponse(event, {
            status: {
                success: true,
                message: "Ok",
                code: 200
            },
            data: await useSetSessionData(event, data.user)
        });
    }

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "oK",
            code: 200
        },
        data: await useSetSessionData(event, data.user)
    });
});