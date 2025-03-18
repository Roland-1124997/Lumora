export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id } = getRouterParams(event);
    const { data, error } = await client.from("groups").select("*").eq("id", group_id).single()

    if (error) return useReturnResponse(event, notFoundError);

    const { data: permissions, error: permisionError }: any = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).single()
    if (permisionError) return useReturnResponse(event, notFoundError)

    const { data: settings, error: settingError }: any = await client.from("group_settings").select("*").eq("group_id", group_id).single()
    if (settingError) return useReturnResponse(event, notFoundError )

    /*
    ************************************************************************************
    */

    const configuration = {
        sections: [
            {
                title: "Additional options",
                options: [
                    { key: "reviewPosts", label: "Posts need to be reviewed", value: settings.needs_review || false },
                    { key: "autoAccept", label: "Auto accept new members", value: settings.auto_accept_new_members || false },
                    { key: "createLinks", label: "Anyone can create links", value: settings.everyone_can_create_link || false },
                ],
            },
            {
                title: "Notifications",
                options: [
                    { key: "socialInteractions", label: "Social interactions", value: settings.social_interactions || false },
                    
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
            ...data,
            id: data.id,
            name: data.name,
            description: data.description,
            last_active: data.last_active,
            permision: {
                change: user.id === data.owner_id,
                delete: permissions?.can_delete_messages_all || permissions?.user_id === data.author_id,
                create: permissions?.can_edit_group || settings?.everyone_can_create_link || false,
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
