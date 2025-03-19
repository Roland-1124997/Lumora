
export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { invite_id, invite_code } = getRouterParams(event);
    const { data, error }: any = await client.from("invite_links").select("*").eq("id", invite_id).eq("code", invite_code).single()

    if (error) return useReturnResponse(event, notFoundError)

    if (data.expiresAt && new Date() > new Date(data.expiresAt)) return useReturnResponse(event, ResourceGoneError);
    if (parseInt(data.uses) == 0) return useReturnResponse(event, ResourceGoneError)

    const { error: memberError }: any = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", data.group_id).single()

    if (memberError?.details?.includes("0 rows")) {
        const { error} = await client.from("members").insert({
            group_id: data.group_id,
            user_id: user.id,
            can_edit_group: false,
            can_delete_messages_all: false,
            can_delete_group: false,
        })

    
        if (error) return useReturnResponse(event, internalServerError)

        const count = parseInt(data.uses) - 1;

        const { error: updateError } = await server.from("invite_links").update({
            uses: data.uses ? `${count}` : null
        }).eq("group_id", data.group_id).eq("code", invite_code)

        if (updateError) return useReturnResponse(event, internalServerError)

        return useReturnResponse(event, {
            status: {
                success: true,
                redirect: `/moments/${data.group_id}`,
                message: "Ok",
                code: 200
            },
        });
    }
    
    return useReturnResponse(event, {
        status: {
            success: true,
            redirect: `/moments/${data.group_id}`,
            message: "Ok",
            code: 200
        },
    });
})
