export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, image_id } = getRouterParams(event)
    const { data, error }: any = await server.rpc('toggle_like', { liked_post_id: image_id, liked_user_id: user.id }).single()
    
    if (error) return useReturnResponse(event, internalServerError);

    const { push } = useEventStream(event)

    await push({
        group_id: group_id,
        image_id: image_id,
        likes: {
            count: data.likes_count,
        }
        
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
        data: {
            has_liked: data.is_liked,
            likes: {
                count: data.likes_count,
            }
        }

    });
});

