export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);
    const { group_id, image_id } = getRouterParams(event)
    const { data: groupData, error: errorGroup } = await client.from("groups").select("*").eq("id", group_id).single<Tables<"groups">>()
    
    if (errorGroup) return useReturnResponse(event, notFoundError);

    const { data: accepted } = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).eq("accepted", true).single<Tables<"members">>()

    /*
    ************************************************************************************
    */

    const { data, error } = await client.from('posts').select('*', { count: 'exact' }).eq("group_id", group_id).eq('id', image_id).eq("Accepted", true).single<Tables<"posts">>()
    if (error && error?.details?.includes("0 rows")) return useReturnResponse(event, notFoundError);
    if (error) return useReturnResponse(event, notFoundError);

    /*
    ************************************************************************************
    */

    const { data: related }: Record<string, any> = await client.rpc("get_nearest_posts", {
        target_post_id: data.id,
        target_created_at: data.created_at,
        target_group_id: group_id,
        target_author_id: data.author_id,
        limit_posts: 6,
    })

    /*
    ************************************************************************************
    */

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "Ok",
            code: 200
        },
        meta: {
            id: groupData.id,
            name: groupData.name as string,
            description: groupData.description as string
        },
        data: !accepted ? [] : await useFormatMediaData(server, client, data, related, group_id, user)
    });
});

