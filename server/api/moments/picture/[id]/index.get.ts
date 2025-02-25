import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'


export default defineEventHandler(async (event) => {
    const time = Date.now();
    const { id } = getRouterParams(event)

    const client = await serverSupabaseClient(event);
    const server = serverSupabaseServiceRole(event);
    const { error: sessionError } = await useSessionExists(event, client, time);
    if (sessionError) return useReturnResponse(event, time, unauthorizedError);;

    const { count, data, error } = await client.from('posts').select('*', { count: 'exact' }).eq('id', id)

    if (error) return useReturnResponse(event, time, internalServerError);
    if (count === 0) return useReturnResponse(event, time, notFoundError);

    const updated = await Promise.all(data.map(async (posts: post) => {
        const { data: userData } = await server.auth.admin.getUserById(posts.author_id);
        return {
            ...posts,
            url: client.storage.from("images").getPublicUrl(posts.url).data.publicUrl,
            author: userData.user?.user_metadata.name
        };
    }));

    return useReturnResponse(event, time, {
        meta: {
            code: 200,
            message: "Data received",
        },
        data: updated,
    });
});
