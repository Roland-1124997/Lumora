export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id } = getRouterParams(event);
    const { data, error } = await client.from("groups").select("*").eq("id", group_id).single()

    if (error) return useReturnResponse(event, notFoundError);

    const { data: permissions }: any = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).single()

    /*
    ************************************************************************************
    */

    const configuration = {
        sections: [
            {
                title: "Additional options",
                options: [
                    { key: "reviewPosts", label: "Posts need to be reviewed", value: false },
                    { key: "createLinks", label: "Anyone can create links", value: true },
                ],
            },
            {
                title: "Notifications",
                options: [
                    { key: "socialInteractions", label: "Social interactions", value: true },
                    { key: "newsUpdates", label: "News and updates", value: true },
                ],
            },
        ],
    };

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "Data received",
            code: 200
        },
        data: {
            id: data.id,
            name: data.name,
            description: data.description,
            last_active: data.last_active,
            permision: {
                delete: permissions?.can_delete_messages_all || permissions?.user_id === data.author_id,
                edit: permissions?.can_edit_group
            },
            media: {
                type: "image",
                url: `/attachments/${data.thumbnail}`
            },
            configuration
        }
    });
});
