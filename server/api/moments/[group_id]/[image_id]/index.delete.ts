import { serverSupabaseClient } from '#supabase/server'


export default defineEventHandler(async (event) => {
    
    const { image_id } = getRouterParams(event)

    const client = await serverSupabaseClient(event);
    const { error: sessionError } = await useSessionExists(event, client);
    if (sessionError) return useReturnResponse(event, unauthorizedError);;

    const { error } = await client.from('posts').delete().eq('id', image_id)
    if (error) return useReturnResponse(event, internalServerError);


    return useReturnResponse(event, {
        status: {
            success: true,
            message: "Ok",
            code: 200
        }
    });
});
