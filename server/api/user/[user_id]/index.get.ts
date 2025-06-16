export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);
    const { user_id } = getRouterParams(event);
    const { data, error } = await server.auth.admin.getUserById(user_id)

    if(error) return useReturnResponse(event, notFoundError)

    const groups: any = []
    const { data: members, error: membersError } = await client.from("members").select("group_id").eq("user_id", user_id).overrideTypes<Array<Tables<"members">>>()

    if (!membersError) {
        for (const group of members) {
            const { data, error } = await client.from("groups").select("id, name, thumbnail, description ").eq("id", group.group_id).single<Tables<"groups">>();
            
            if (!error) {
                groups.push({
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    media: {
                        type: "image",
                        url: `/attachments/${data.thumbnail}`,
                    },
                });
            }
        }
    }

    const { data: posts } = await client.from("posts").select("id, url, group_id").order("accepted_at", { ascending: false }).limit(6).eq("author_id", user_id).overrideTypes<Array<Tables<"posts">>>()

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "Ok",
            code: 200
        },
        data: {
            user: {
                id: data.user.id,
                name: data.user.user_metadata.name,
                avatar: data.user.user_metadata.avatar_url || `/attachments/avatar/${user_id}`,
            },
            groups: groups,
            posts: posts?.map((post) => {
                return {
                    id: post.id,
                    group_id: post.group_id,
                    name: groups.find((group: any) => group.id === post.group_id).name,
                    media: {
                        type: "image",
                        url: `/attachments/${post.url}`,
                    },
                }
            })
        }
    })
})
