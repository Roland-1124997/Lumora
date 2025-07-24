export default defineSupabaseEventHandler(async (event, user, client, server) => {
    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, image_id } = getRouterParams(event);

    const { data: accepted, error: memberError } = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).eq("accepted", true).single<Tables<"members">>();
    if (!accepted || memberError) return useReturnResponse(event, forbiddenError);

    const { data: settings, error: settingsError } = await server.from("group_settings").select("*").eq("group_id", group_id).single<Tables<"group_settings">>();
    if ((settings && !settings.social_interactions) || settingsError) return useReturnResponse(event, forbiddenError);

    const query: query = getQuery(event);
    const { items, page, start } = useMakePagination(10, query);

    const { data, error: commentError } = await client.rpc("fetch_post_comments_with_tree", {
        input_group_id: group_id,
        input_post_id: image_id,
        input_limit: items,
        input_offset: start
    });

    if (commentError) return useReturnResponse(event, internalServerError);

    const { data: parent, error } = await client.from('posts').select('author_id').eq("group_id", group_id).eq('id', image_id).single<Tables<"posts">>()

    if (error && error?.details?.includes("0 rows")) return useReturnResponse(event, notFoundError);
    if (error) return useReturnResponse(event, notFoundError);

    const { data: users } = await useListUsers(server);
    const userMap = new Map(users.users.map((u: User) => [u.id, u]));

    const mapReply = (reply: any): any => {
        const author = userMap.get(reply.author_id);
        const isOwner = reply.author_id === user?.id;
        const authorName = author?.user_metadata.name;

        const deleted = reply.content === "This comment has been deleted";

        return {
            id: reply.id,
            created_at: reply.created_at,
            author: {
                name: deleted ? "Deleted" : (isOwner ? `${authorName} (You)` : authorName),
                url: deleted ? undefined : (author?.user_metadata.avatar_url || `/attachments/avatar/${reply.author_id}`),
                is_owner: deleted ? undefined : isOwner,
                owns_post: parent.author_id == reply.author_id,
            },
            content: { text: reply.content },
            related: reply.related?.map(mapReply) || [],
            deleted: deleted
        };
    }

    const updatedData = data.comments.map((data: any) => {
        const author = userMap.get(data.author_id);
        const isOwner = data.author_id === user.id;
        const authorName = author?.user_metadata.name;

        const deleted = data.content === "This comment has been deleted";

        return {
            id: data.id,
            created_at: data.created_at,
            author: {
                name: deleted ? "Deleted" : (isOwner ? `${authorName} (You)` : authorName),
                url: deleted ? undefined : (author?.user_metadata.avatar_url || `/attachments/avatar/${data.author_id}`),
                is_owner: deleted ? undefined : isOwner,
                owns_post: parent.author_id == data.author_id,
            },
            content: { text: data.content },
            related: data.related?.map(mapReply) || [],
            deleted: deleted,
        };
    });

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "success",
            code: 200,
        },
        pagination: {
            page,
            total: Math.ceil((data.parent_count ?? 1) / items),
        },
        data: {
            total_count: data.total_count,
            parent_count: data.parent_count,
            comments: updatedData
        },
    });
});
