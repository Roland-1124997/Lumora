import { serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'


export default defineEventHandler(async (event) => {
    const time = Date.now();
    const { image_id } = getRouterParams(event)

    const client = await serverSupabaseClient(event);
    const server: SupabaseClient = serverSupabaseServiceRole(event);

    const { error: sessionError } = await useSessionExists(event, client, time);
    if (sessionError) return useReturnResponse(event, time, unauthorizedError);;

    const user = await serverSupabaseUser(event);
    if (!user) return useReturnResponse(event, time, internalServerError);

    const { data, error }: any = await server.rpc('toggle_like', { liked_post_id: image_id, liked_user_id: user.id }).single()
    if (error) return useReturnResponse(event, time, internalServerError);

    return useReturnResponse(event, time, {
        meta: {
            code: 200,
            message: "Data received",
        },
        data: {
            likes: {
                count: data.likes_count,
                liked: data.is_liked
            }
        }
    });
});
