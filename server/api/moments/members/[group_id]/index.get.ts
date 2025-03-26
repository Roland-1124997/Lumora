
export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id } = getRouterParams(event);
    const query: query = getQuery(event);
    const currentSearch = query.search ? query.search.toLowerCase() : null;

    const { error: permisionError }: any = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).single()
    if (permisionError) return useReturnResponse(event, notFoundError)

    const { data, error } = await client.from("members").select("*").eq("group_id", group_id)
    if (error) return useReturnResponse(event, notFoundError)

    const { data: users } = await useListUsers(server);

    let usersData: any = data.map((data) => {

        const author: any = users.users.find((user) => user.id === data.user_id);

        return {
            id: author.id,
            name: user.id == author.id ? `${author.user_metadata.name} (You)` : author.user_metadata.name,
            avatar: author.user_metadata.avatar_url,
            Permissions: {
                can_edit_group: data.can_edit_group,
                can_delete_group: data.can_delete_group,
                can_delete_messages_all: data.can_delete_messages_all,
            }

        }
    })

    if (currentSearch) usersData = usersData.filter((user: any) => {
        return user.name.toLowerCase().includes(currentSearch)
    })

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "Ok",
            code: 200
        },
        data: usersData
    });
})
