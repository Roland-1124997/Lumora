export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const query: query = getQuery(event);
    const { items, page } = useMakePagination(12, query);

    /*
    ************************************************************************************
    */

    const { count, data, error } = await client.from("posts") .select("*").neq("author_id", user.id).order("likes", { ascending: false });
    if (error) return useReturnResponse(event, notFoundError);

    
    const { data: likes } = await client.from("liked_posts").select("*").eq("user_id", user.id)
    const { data: groups } = await client.from("groups").select("*")

    /*
    ************************************************************************************
    */

    const useFormatTimeline = async (server: SupabaseClient, data: Record<string, any>, user?: User) => {

        const { data: users } = await useListUsers(server);

        return await Promise.all(
            data.map(async (data: Record<string, any>) => {

                const author: User | undefined = user ? undefined : users.users.find((user: User) => user.id === data.author_id);
                const authorName = user ? user.user_metadata.name : author?.user_metadata.name || null;
                
                const hasLiked = likes?.find((like) => like.post_id === data.id)
                const group = groups?.find((group) => group.id === data.group_id )

                return {
                    id: data.id,
                    created_at: data.created_at,
                    has_liked: !!hasLiked || false,
                    author: {
                        name: `${authorName}`,
                        url: author?.user_metadata.avatar_url || "/profile.jpg",
                        is_owner: false,
                        
                    },
                    likes: {
                        count: data.likes || 0,
                    },
                    media: {
                        type: "image",
                        url: `/attachments/${data.media?.url || data.url}`,
                    },
                    group: {
                        id: group.id,
                        name: group.name,
                        url: `/attachments/${group.thumbnail}`
                    },
                    url: `/moments/${data.group_id}/${data.id}`
                };
            })
        );
    }

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "Ok",
            code: 200
        },
        pagination: {
            page: page,
            total: Math.ceil((count ?? 1) / items)
        },
        data: await useFormatTimeline(server, data)
    });
})
