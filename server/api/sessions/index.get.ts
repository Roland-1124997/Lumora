import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        const client = await serverSupabaseClient(event);
    
        const currentSession = useGetCookies(event)
        const { data, error } = await useGetSession(client, currentSession)

        if (error) {
            const { data, error } = await useRefreshSession(client, currentSession)
            
            if (!data.session || error) return reject({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "Je bent niet gemachtigd om toegang te krijgen tot deze bron."
            })
            
            useSetCookies(event, data.session)
            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                user: data.user ? useSetSessionData(data.user) : null
            })
        }

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            user: data.user ? useSetSessionData(data.user) : null
        })
    });
});
