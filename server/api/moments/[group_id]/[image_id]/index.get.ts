import { serverSupabaseClient, serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'


export default defineEventHandler(async (event) => {
    const time = Date.now();
    const { group_id, image_id } = getRouterParams(event)

    const client = await serverSupabaseClient(event);
    const server = serverSupabaseServiceRole(event);
    
    const { error: sessionError } = await useSessionExists(event, client, time);
    if (sessionError) return useReturnResponse(event, time, unauthorizedError);;

    const user = await serverSupabaseUser(event);
    if (!user) return useReturnResponse(event, time, internalServerError);

    const { data: groupData, error: errorGroup }: any = await client.from("groups").select("*").eq("id", group_id).single()
    if (errorGroup) return useReturnResponse(event, time, forbiddenError);

    const { count, data, error } = await client.from('posts').select('*', { count: 'exact' }).eq('id', image_id)
    if (error) return useReturnResponse(event, time, internalServerError);
    if (count === 0) return useReturnResponse(event, time, forbiddenError);

    const updated = await Promise.all(data.map(async (posts: any) => {
        const { data: userData } = await server.auth.admin.getUserById(posts.author_id);
        const { data: permissions }: any = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).single()

        return {
            url: client.storage.from("images").getPublicUrl(posts.url).data.publicUrl,
            meta: {
                id: posts.id,
                created_at: posts.created_at,
                likes: posts.likes,
            },
            author: {
                id: posts.author_id,
                name: userData.user?.user_metadata.name
            },
            group: {
                id: posts.group_id,
                name: groupData.name,
            },
            permision: {
                delete: permissions?.can_delete_messages_all || permissions?.user_id === posts.author_id 
            },
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


