export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, image_id } = getRouterParams(event)

    const { data, error: postError } = await client.from('posts').select("*").eq('id', image_id).single<Tables<"posts">>()
    if (postError) return useReturnResponse(event, notFoundError)

    const { error } = await client.from('posts').delete().eq('id', image_id)

    if (error) return useReturnResponse(event, internalServerError);

    const { error: logError } = await server.from("logbook").insert({
        message: data.author_id == user.id ? `Deleted their own photo` : 'Deleted :member: photo',
        performed_by_id: user.id,
        target_user_id: data.author_id || undefined,
        action_type: "deleted",
        group_id: group_id,
        context: {
            id: `${data.id.split("-")[0]}-${data.author_id?.split("-")[4]}`,
            type: "image",
        }
    });

    if (data.author_id != user.id) await server.from("notifications").insert({
        group_id: group_id,
        post_id: image_id,
        target_id: data.author_id,
        title: `Your photo has been removed`,
        message: `Your photo was deleted by a moderator.`,
        type: "image",
    })
    

    if (logError) return useReturnResponse(event, internalServerError)

    await useSendNotification({
        title: `Your photo has been removed`,
        message: `Your photo was deleted by a moderator.`,
        target_id: data.author_id as string,
    }).catch(() => {
        console.error("Failed to send notification");
    });

    await server.from("groups").update({
        last_photo_posted_by: null,
        last_action: "Deleted"
    }).eq("id", group_id)

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
