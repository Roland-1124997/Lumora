export default defineSupabaseEventHandler(async (event, user, client) => {

    const { image_id } = getRouterParams(event)

    const { error } = await client.from('posts').delete().eq('id', image_id)
    if (error) return useReturnResponse(event, internalServerError);

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "Ok",
            code: 200
        }
    });

});
