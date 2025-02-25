import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const time = Date.now();

    const client = await serverSupabaseClient(event);
    const currentSession = useGetCookies(event);
    const { data, error } = await useGetSession(client, currentSession);

    if (error) {
        const { data, error } = await useRefreshSession(client, currentSession);
        if (!data.session || error) return useReturnResponse(event, time, unauthorizedError);

        useSetCookies(event, data.session);
        
        return useReturnResponse(event, time, {
            meta: {
                code: 200,
                message: "OK",
            },
            user: useSetSessionData(data.user)
        });
    }

    return useReturnResponse(event, time, {
        meta: {
            code: 200,
            message: "OK",
        },
        user: useSetSessionData(data.user)
    });
});