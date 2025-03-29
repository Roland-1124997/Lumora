export const useFormatListGroup = async (server: SupabaseClient, data: Record<string, any>, user: User) => {

    const { data: users } = await useListUsers(server)

    return await Promise.all(data.map(async (data: Record<string, any>) => {
        const author = users.users.find((user: User) => user.id === data.last_photo_posted_by);
        const isOwner = data.last_photo_posted_by == user.id;

        return {
            id: data.id,
            name: data.name,
            description: data.description,
            last_active: data.last_active,
            last_photo_posted_by: {
                name: isOwner ? `${author?.user_metadata?.name} (You)` : author?.user_metadata?.name,
                url: author?.user_metadata.avatar_url || "/profile.jpg"
            },
            media: {
                type: "image",
                url: `/attachments/${data.thumbnail}`
            }
        };
    }));
}

export const useFormatGroup = async (server: SupabaseClient, data: Record<string, any>, user?: User) => {

    const { data: users } = await useListUsers(server);

    return await Promise.all(
        data.map(async (data: Record<string, any>) => {
            const author: User | undefined = user ? undefined : users.users.find((user: User) => user.id === data.author.id);
            const isOwner = user ? data.author_id == user.id : data.author.is_owner;
            const authorName = user ? user.user_metadata.name : author?.user_metadata.name || null;

            return {
                id: data.id,
                created_at: data.created_at,
                has_liked: data.has_liked || false,
                author: {
                    name: isOwner ? `${authorName} (You)` : authorName,
                    url: author?.user_metadata.avatar_url || user?.user_metadata.avatar_url || "/profile.jpg",
                    is_owner: isOwner,
                },
                likes: {
                    count: data.likes.count || 0,
                },
                media: {
                    type: "image",
                    url: `/attachments/${data.media?.url || data.url}`,
                },
            };
        })
    );
};

export const useFormatMediaData = async (server: SupabaseClient, client: SupabaseClient, data: Record<string, any>, related: Record<string, any>, group_id: string, user: User) => {

    const { data: users } = await useListUsers(server);

    const { data: permissions }: any = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).single()
    const { data: liked } = await client.from("liked_posts").select("id").eq("post_id", data.id).eq("user_id", user.id).single()

    const author: any = users.users.find((user) => user.id === data.author_id);

    return {
        id: data.id,
        created_at: data.created_at,
        has_liked: liked ? true : false,
        author: {
            name: author.user_metadata.name,
            is_owner: data.author_id == user?.id,
        },
        permision: {
            can_delete_message: permissions?.can_delete_messages_all || permissions?.user_id === data.author_id
        },
        likes: {
            count: data.likes,
        },
        media: {
            type: "image",
            url: `/attachments/${data.url}`
        },
        related
    }
}

export const useListUsers = async (server: SupabaseClient) => await server.auth.admin.listUsers();
