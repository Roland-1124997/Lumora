export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { data, error } = await client.from("notifications").select("*").order("created_at", { ascending: false })

    const updated = await Promise.all(
        data?.map(async notification => {
            const { data: group } = await client.from("groups").select("*").eq("id", notification.group_id).single<Tables<"groups">>();
            const { data: post } = await client.from("posts").select("*").eq("id", notification.post_id).single<Tables<"posts">>();

            return {
                id: notification.id,
                target_id: notification.target_id,
                title: notification.title,
                message: notification.message,
                type: notification.type,
                reason: notification.reason,
                is_read: notification.is_read,
                group: !group ? undefined : {
                    id: group.id,
                    name: group.name,
                    url: `/moments/${group.id}`,
                },
                post: !post ? undefined : {
                    id: post.id,
                    group_id: post.group_id,
                    url: `/moments/${post.group_id}/${post.id}?comment=${notification.comment_id}`,
                },
                created_at: notification.created_at,
            }
        }) ?? []
    );

    return useReturnResponse(event, {
        status: {
            success: true,
            code: 200,
            message: "OK",
        },
        data: updated
    })

});