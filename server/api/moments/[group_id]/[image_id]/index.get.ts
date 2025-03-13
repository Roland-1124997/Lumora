export default defineSupabaseEventHandler(async (event, user, client, server) => {

    const { group_id, image_id } = getRouterParams(event)

    const { data: groupData, error: errorGroup }: any = await client.from("groups").select("*").eq("id", group_id).single()
    if (errorGroup) return useReturnResponse(event, notFoundError);

    const { data, error } = await client.from('posts').select('*', { count: 'exact' }).eq('id', image_id).single()

    if (error && error.details.includes("0 rows")) return useReturnResponse(event, notFoundError);
    if (error) return useReturnResponse(event, internalServerError);

    const { data: related }: any = await client.rpc("get_nearest_posts", {
        target_post_id: data.id,
        target_created_at: data.created_at,
        target_group_id: group_id,
        target_author_id: data.author_id,
        limit_posts: 6,
    });

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
        data: await useFormatMediaData(server, client, data, related, group_id, user)
    });
});

