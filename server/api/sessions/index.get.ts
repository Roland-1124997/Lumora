import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
    
    const client = await serverSupabaseClient(event);
    const currentSession = useGetCookies(event);
    const { data, error } = await useGetSession(client, currentSession);

    if (error) {
        const { data, error } = await useRefreshSession(client, currentSession);
        if (!data.session || error) return useReturnResponse(event, unauthorizedError);

        useSetCookies(event, data.session);
        
        return useReturnResponse(event, {
            status: {
                success: true,
                message: "Ok",
                code: 200
            },
            data: useSetSessionData(data.user)
        });
    }

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "oK",
            code: 200
        },
        data: useSetSessionData(data.user)
    });
});