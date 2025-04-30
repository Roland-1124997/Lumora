export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, image_id } = getRouterParams(event)
    const { error } = await client.from('posts').delete().eq('id', image_id)

    await server.from("groups").update({
        last_photo_posted_by: null,
        last_action: "Deleted"
    }).eq("id", group_id)
    
    if (error) return useReturnResponse(event, internalServerError);

    /*
    ************************************************************************************
    */

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "Ok",
            code: 200
        }
    });

});
