import { serverSupabaseClient, serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'


export default defineEventHandler(async (event) => {
   
    const { group_id, image_id } = getRouterParams(event)

    const client = await serverSupabaseClient(event);
    const server = serverSupabaseServiceRole(event);

    const { error: sessionError } = await useSessionExists(event, client);
    if (sessionError) return useReturnResponse(event, unauthorizedError);;

    const user = await serverSupabaseUser(event);
    if (!user) return useReturnResponse(event, internalServerError);

    const { data: groupData, error: errorGroup }: any = await client.from("groups").select("*").eq("id", group_id).single()
    if (errorGroup) return useReturnResponse(event, notFoundError);

    const { count, data, error } = await client.from('posts').select('*', { count: 'exact' }).eq('id', image_id)
    if (error) return useReturnResponse(event, internalServerError);
    if (count === 0) return useReturnResponse(event, notFoundError);

    const updated = await Promise.all(data.map(async (posts: any) => {
        const { data: userData } = await server.auth.admin.getUserById(posts.author_id);
        const { data: permissions }: any = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).single()

        return {

            id: posts.id,
            created_at: posts.created_at,
            author: {
                name: userData.user?.user_metadata.name,
                is_owner: posts.author_id == user.id,
            },
            permision: {
                delete: permissions?.can_delete_messages_all || permissions?.user_id === posts.author_id
            },
            likes: {
                count: posts.likes,
            },
            media: {
                type: "image",
                url: client.storage.from("images").getPublicUrl(posts.url).data.publicUrl,
            },
        };
    }));

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "Ok",
            code: 200
        },
        meta: {
            id: groupData.id,
            name: groupData.name,
            description: groupData.description
        },
        data: updated[0]
    });
});


