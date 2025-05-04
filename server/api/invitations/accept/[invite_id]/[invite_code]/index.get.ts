
export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { invite_id, invite_code } = getRouterParams(event);
    const { data, error } = await client.from("invite_links").select("*").eq("id", invite_id).eq("code", invite_code).single<Tables<"invite_links">>()

    if (error) return useReturnResponse(event, notFoundError)

    if (data.expiresAt && new Date() > new Date(data.expiresAt)) return useReturnResponse(event, ResourceGoneError);
    if (data.uses == 0) return useReturnResponse(event, ResourceGoneError)


    /*
    ************************************************************************************
    */

    const { data: settings, error: settingError } = await client.from("group_settings").select("*").eq("group_id", data.group_id).single<Tables<"group_settings">>()
    if (settingError) return useReturnResponse(event, internalServerError)

    if (settings.auto_accept_new_members) {
        const { error: user_left_error } = await server.from("posts").update({ user_left: false }).eq("author_id", user.id).eq("group_id", data.group_id).select("*")
        if (user_left_error) return useReturnResponse(event, internalServerError)
    }

    /*
    ************************************************************************************
    */

    const { error: memberError } = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", data.group_id).single<Tables<"members">>()

    if (memberError?.details?.includes("0 rows")) {
        
        const { data: settings, error: settingError } = await client.from("group_settings").select("*").eq("group_id", data.group_id).single<Tables<"group_settings">>()
        if (settingError) return useReturnResponse(event, internalServerError)

        const { error} = await client.from("members").insert({
            group_id: data.group_id,
            user_id: user.id,
            can_edit_group: false,
            can_delete_messages_all: false,
            can_delete_group: false,
            accepted: settings.auto_accept_new_members
        })

        if (error) return useReturnResponse(event, internalServerError)
        const count = data.uses ? data.uses - 1 : null;

        const { error: updateError } = await server.from("invite_links").update({
            uses: data.uses ? `${count}` : null
        }).eq("group_id", data.group_id).eq("code", invite_code)

        if (updateError) return useReturnResponse(event, internalServerError)

        const { error: logError } = await server.from("logbook").insert({
            message: settings.auto_accept_new_members ? "Joined the group" : 'Requested to join the group',
            performed_by_id: user.id,
            action_type: "created",
            group_id: data.group_id,
            context: {
                token: invite_code,
            }
        })

        if (logError) return useReturnResponse(event, internalServerError)

        return useReturnResponse(event, {
            status: {
                success: true,
                redirect: `/moments/${data.group_id}`,
                message: "Ok",
                code: 200
            },
        });
    }

    /*
    ************************************************************************************
    */
    
    return useReturnResponse(event, {
        status: {
            success: true,
            redirect: `/moments/${data.group_id}`,
            message: "Ok",
            code: 200
        },
    });
})
