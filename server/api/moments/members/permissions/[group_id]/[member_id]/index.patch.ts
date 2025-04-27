
export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, member_id } = getRouterParams(event);

    const request = await readBody(event);

    /*
    ************************************************************************************
    */

    const { error: permisionError }: any = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).eq("can_delete_group", true).single()
    if (permisionError) return useReturnResponse(event, notFoundError)

    const { error }: any = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", member_id).single()
    if (error) return useReturnResponse(event, notFoundError)

    /*
    ************************************************************************************
    */
    await client.from("members").update({
        can_edit_group: request.can_edit_group,
        can_delete_messages_all: request.can_delete_messages_all,
    }).eq("group_id", group_id).eq("user_id", member_id)

    
    return useReturnResponse(event, {
        status: {
            refresh: true,
            success: true,
            message: "Ok",
            code: 200
        },
    });
})
