
export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, member_id } = getRouterParams(event);

    const request = await readBody(event);

    /*
    ************************************************************************************
    */

    const { error: permisionError } = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).eq("can_delete_group", true).single<Tables<"members">>()
    if (permisionError) return useReturnResponse(event, notFoundError)

    const { data, error } = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", member_id).single<Tables<"members">>()
    if (error) return useReturnResponse(event, notFoundError)
    /*
    ************************************************************************************
    */

    const filteredContext = Object.fromEntries(
        Object.entries({
            "can edit the group": getUpdatedValue(request.can_edit_group, data.can_edit_group),
            "can delete posts": getUpdatedValue(request.can_delete_messages_all, data.can_delete_messages_all),
        }).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(filteredContext).length === 0) {
        return useReturnResponse(event, {
            status: {
                success: true,
                refresh: true,
                message: "Ok",
                code: 200
            }
        });
    }

    /*
    ************************************************************************************
    */

    await client.from("members").update({
        can_edit_group: request.can_edit_group,
        can_delete_messages_all: request.can_delete_messages_all,
    }).eq("group_id", group_id).eq("user_id", member_id)

    const { error: logError } = await server.from("logbook").insert({
        message: "Updated :member: permissions",
        performed_by_id: user.id,
        target_user_id: member_id,
        action_type: "updated",
        group_id: group_id,
        context: filteredContext
    })

    if (logError) return useReturnResponse(event, internalServerError)

    await server.from("notifications").insert({
        group_id: group_id,
        target_id: member_id,
        title: `Permissions have been updated`,
        message: `${user.user_metadata.name} has updated your permissions in the group`,
        type: "group",
    })

    return useReturnResponse(event, {
        status: {
            refresh: true,
            success: true,
            message: "Ok",
            code: 200
        },
    });
})
