
export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, member_id } = getRouterParams(event);

    /*
    ************************************************************************************
    */

    const { error: permisionError }: any = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).single()
    if (permisionError) return useReturnResponse(event, notFoundError)

    const { data, error }: any = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", member_id).single()
    if (error) return useReturnResponse(event, notFoundError)

    /*
    ************************************************************************************
    */

    const { data: users } = await useListUsers(server);

    const author: any = users.users.find((user) => user.id === member_id);

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "Ok",
            code: 200
        },
        data: {
            id: author.id,
            name: author.user_metadata.name,
            avatar: author.user_metadata.avatar_url || `/attachments/avatar/${author.id}`,
            can_edit_group: data.can_edit_group,
            can_delete_group: data.can_delete_group,
            can_delete_messages_all: data.can_delete_messages_all,
            permissions: {
                options: [
                    { key: "can_edit_group", label: "can edit the group", value: data.can_edit_group || false },
                    { key: "can_delete_messages_all", label: "can delete posts", value: data.can_delete_messages_all || false },
                ],
            },
            
        }
    });
})
