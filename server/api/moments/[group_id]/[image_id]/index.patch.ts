export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, image_id } = getRouterParams(event)

    const { data: accepted } = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).eq("accepted", true).single<Tables<"members">>()
    if(!accepted) return useReturnResponse(event, unauthorizedError)

    const { data, error } = await server.rpc('toggle_like', { liked_post_id: image_id, liked_user_id: user.id }).single<{ is_liked: boolean, likes_count: Number }>()
    
    if (error) return useReturnResponse(event, internalServerError);


    /*
    ************************************************************************************
    */

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "Ok",
            code: 200
        },
        data: {
            has_liked: data.is_liked,
            likes: {
                count: data.likes_count,
            }
        }

    });
});

