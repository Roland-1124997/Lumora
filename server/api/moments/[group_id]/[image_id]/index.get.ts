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
        const { data: liked } = await client.from("liked_posts").select("id").eq("post_id", posts.id).eq("user_id", user.id).single()

        const { data: morePosts, } = await client .from("posts") .select("*").eq("author_id", posts.author_id)
            .neq("id", posts.id).order("created_at", { ascending: true }) .limit(3); 

        const more = await Promise.all(morePosts.map((more_posts: any) => {
            return {
                id: more_posts.id,
                media: {
                    type: "image",
                    url: `/attachments/${more_posts.url}`
                },
            }
        }))

        return {
            id: posts.id,
            created_at: posts.created_at,
            has_liked: liked ? true : false,
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
                url: `/attachments/${posts.url}`
            },
            more_from_author: more
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


