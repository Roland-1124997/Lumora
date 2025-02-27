import { serverSupabaseClient } from '#supabase/server'


export default defineEventHandler(async (event) => {
    const time = Date.now();
    const { id } = getRouterParams(event)

    const client = await serverSupabaseClient(event);
    const { error: sessionError } = await useSessionExists(event, client, time);
    if (sessionError) return useReturnResponse(event, time, unauthorizedError);;

    const { error } = await client.from('posts').delete().eq('id', id)
    if (error) return useReturnResponse(event, time, internalServerError);


    return useReturnResponse(event, time, {
        meta: {
            code: 200,
            message: "Data deleted",
        },
    });
});
