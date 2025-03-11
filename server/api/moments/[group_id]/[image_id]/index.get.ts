export default defineEventHandler(async (event) => {

    const { group_id, image_id } = getRouterParams(event)

    const client: SupabaseClient = await serverSupabaseClient(event);
    const server = serverSupabaseServiceRole(event);

    const { error: sessionError } = await useSessionExists(event, client);
    if (sessionError) return useReturnResponse(event, unauthorizedError);;

    const user = await serverSupabaseUser(event);
    if (!user) return useReturnResponse(event, internalServerError);

    const { data: groupData, error: errorGroup }: any = await client.from("groups").select("*").eq("id", group_id).single()
    if (errorGroup) return useReturnResponse(event, notFoundError);

    const { data, error } = await client.from('posts').select('*', { count: 'exact' }).eq('id', image_id).single()
    
    if (error && error.details.includes("0 rows")) return useReturnResponse(event, notFoundError);
    if (error) return useReturnResponse(event, internalServerError);
    

    const { data: users } = await server.auth.admin.listUsers();
    const { data: permissions }: any = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).single()
    const { data: liked } = await client.from("liked_posts").select("id").eq("post_id", data.id).eq("user_id", user.id).single()

    const { data: more }: any = await client.rpc("get_nearest_posts", {
        target_post_id: data.id,
        target_created_at: data.created_at,
        target_group_id: group_id,
        target_author_id: data.author_id,
        limit_posts: 6,
    });

    const author: any = users.users.find((user) => user.id === data.author_id);

    const updated = {
        id: data.id,
        created_at: data.created_at,
        has_liked: liked ? true : false,
        author: {
            name: author.user_metadata.name,
            is_owner: data.author_id == user.id,
        },
        permision: {
            delete: permissions?.can_delete_messages_all || permissions?.user_id === data.author_id
        },
        likes: {
            count: data.likes,
        },
        media: {
            type: "image",
            url: `/attachments/${data.url}`
        },
        more_from_author: more
    }

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
        data: updated
    });
});


