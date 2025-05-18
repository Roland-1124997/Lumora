export default defineSupabaseEventHandler(async (event, user, client, server) => {
    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, image_id } = getRouterParams(event);

    const { data: accepted, error: memberError } = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).eq("accepted", true).single<Tables<"members">>()
    if (!accepted || memberError) return useReturnResponse(event, forbiddenError);

    const { data: settings, error: settingsError } = await server.from("group_settings").select("*").eq("group_id", group_id).single<Tables<"group_settings">>()
    if ((settings && !settings.social_interactions) || settingsError) return useReturnResponse(event, forbiddenError)

    const { data: comments, error } = await client.from("posts_comments").select("*").eq("group_id", group_id).eq("post_id", image_id).order("created_at", { ascending: false }).overrideTypes<Array<Tables<"posts_comments">>>();
    if (error) return useReturnResponse(event, internalServerError);

    const { data: users } = await useListUsers(server);

    const updatedData = comments.map((data) => {
        const author: User | undefined = users.users.find((user: User) => user.id === data.author_id);
        const isOwner = data.author_id == user.id
        const authorName = author?.user_metadata.name;

        const deleted = authorName === null;

        return {
            id: data.id,
            created_at: data.created_at,
            author: {
                name: isOwner ? `${authorName} (You)` : authorName,
                url: author?.user_metadata.avatar_url || `/attachments/avatar/${data?.author_id}`,
                is_owner: isOwner,
            },
            content: {
                text: data.content,
            }
        };
    });

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "success",
            code: 200,
        },
        data: updatedData,
    });
});
