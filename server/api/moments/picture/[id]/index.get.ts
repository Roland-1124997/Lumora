import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const time = Date.now();
    const { id } = getRouterParams(event)

    const client = await serverSupabaseClient(event);
    const { error: sessionError } = await useSessionExists(event, client, time);
    if (sessionError) return sessionError;

    const { count, data, error } = await client.from('posts').select('*', { count: 'exact' }).eq('id', id)

    if (error) return useReturnResponse(event, time, internalServerError);
    if (count === 0) return useReturnResponse(event, time, notFoundError);

    return useReturnResponse(event, time, {
        meta: {
            code: 200,
            message: "Data received",
        },
        data,
    });
});
