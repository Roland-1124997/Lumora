export default defineSupabaseEventHandler(async (event, user, client, server) => {
    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, image_id } = getRouterParams(event);

    const { data: accepted, error: memberError } = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).eq("accepted", true).single<Tables<"members">>();
    if (!accepted || memberError) return useReturnResponse(event, forbiddenError);

    const { data: settings, error: settingsError } = await server.from("group_settings").select("*").eq("group_id", group_id).single<Tables<"group_settings">>();
    if ((settings && !settings.social_interactions) || settingsError) return useReturnResponse(event, forbiddenError);

    const { data, error: commentError } = await client.rpc("get_post_comments_with_replies", {
        input_group_id: group_id,
        input_post_id: image_id,
    });
    if (commentError) return useReturnResponse(event, internalServerError);

    const { data: users } = await useListUsers(server);
    const userMap = new Map(users.users.map((u: User) => [u.id, u]));

    const mapReply = (reply: any): any => {
        const author = userMap.get(reply.author_id);
        const isOwner = reply.author_id === user?.id;
        const authorName = author?.user_metadata.name;

        return {
            id: reply.id,
            created_at: reply.created_at,
            author: {
                name: isOwner ? `${authorName} (You)` : authorName,
                url: author?.user_metadata.avatar_url || `/attachments/avatar/${reply.author_id}`,
                is_owner: isOwner,
            },
            content: { text: reply.content },
            related: reply.related?.map(mapReply) || [],
        };
    }

    const updatedData = data.comments.map((data: any) => {
        const author = userMap.get(data.author_id);
        const isOwner = data.author_id === user.id;
        const authorName = author?.user_metadata.name;

        return {
            id: data.id,
            created_at: data.created_at,
            author: {
                name: isOwner ? `${authorName} (You)` : authorName,
                url: author?.user_metadata.avatar_url || `/attachments/avatar/${data.author_id}`,
                is_owner: isOwner,
            },
            content: { text: data.content },
            related: data.related?.map(mapReply) || [],
        };
    });

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "success",
            code: 200,
        },
        data: {
            count: data.count,
            comments: updatedData
        },
    });
});
