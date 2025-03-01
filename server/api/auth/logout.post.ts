import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler( async (event) => {
    
    const client = await serverSupabaseClient(event);
    const { error } = await useDeleteSession(client)
    if (error) return useReturnResponse(event, badRequestError)
        
    useDeleteCookies(event)

    return useReturnResponse(event, {
        status: {
            success: true,
            redirect: "/auth",
            message: "Ok",
            code: 200
        }
    })

});
