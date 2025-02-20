import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler( async (event) => {
    const time = Date.now();

    const client = await serverSupabaseClient(event);
    const { error } = await useDeleteSession(client)
    if (error) return useReturnResponse(event, time, badRequestError)
        
    useDeleteCookies(event)

    return useReturnResponse(event, time, {
        meta: {
            code: 200,
            message: "OK",
            redirect: "/auth",
        },
    })

});
