export const useFormatListGroup = async (server: SupabaseClient, data: Record<string, any>, user: User) => {

    const { data: users } = await useListUsers(server)

    return await Promise.all(data.map(async (data: Record<string, any>) => {
        const author = users.users.find((user: User) => user.id === data.last_photo_posted_by);
        const isOwner = data.last_photo_posted_by == user.id;

        const { data: attention } = await server.rpc('should_show_group_notification', {
            p_user_id: user.id,
            p_group_id: data.id
        }).single<Boolean>()

        const { data: member } = await server.from("members").select("*").eq("group_id", data.id).eq("user_id", user.id).single<Tables<"members">>()
        const { data: settings } = await server.from("group_settings").select("*").eq("group_id", data.id).single<Tables<"group_settings">>()
        
        const postsQuery = server.from("posts").select("*", { count: "exact" }).eq("Accepted", false).eq("group_id", data.id)
        if (!settings?.can_mod_own_pending) postsQuery.neq("author_id", user.id)

        const { count } = await postsQuery.overrideTypes<Array<Tables<"posts">>>();

        return {
            id: data.id,
            name: data.name,
            description: data.description,
            last_active: data.last_active,
            last_action: !member?.accepted? 'Pending' : data.last_action,
            needs_attention: settings?.needs_review && (settings.owner_id == user.id || member?.can_edit_group) && count && count > 0 ? true : !member?.accepted ? false : attention,
            last_photo_posted_by: {
                name: !member?.accepted ? null : (isOwner ? `${author?.user_metadata?.name} (You)` : author?.user_metadata?.name),
                url: !member?.accepted ? null : (author?.user_metadata.avatar_url || "/profile.jpg")
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

    return (await Promise.all(
        data.map(async (data: Record<string, any>) => {
            const author: User | undefined = user ? undefined : users.users.find((user: User) => user.id === data.author.id);
            const isOwner = user ? data.author_id == user.id : data.author.is_owner;
            const authorName = user ? user.user_metadata.name : author?.user_metadata.name || null;

            const deleted = authorName === null;

            if (!data?.user_left || !deleted) {
                fetch(author?.user_metadata.avatar_url || `/attachments/avatar/${data?.author?.id || data?.author_id}`).catch(() => {});
            }

            return {
                id: data.id,
                created_at: data.created_at,
                updated_at: data.updated_at,
                accepted_at: data.accepted_at,
                has_left: data.user_left || false,
                has_been_accepted: data.accepted,
                has_interactions: data.has_interactions,
                author: {
                    id: data?.author?.id || data.author_id,
                    name: data?.user_left || deleted ? "Unknown" : (isOwner ? `${authorName} (You)` : authorName),
                    url: data?.user_left || deleted ? `/profile.jpg` : (author?.user_metadata.avatar_url || user?.user_metadata.avatar_url || `/attachments/avatar/${data?.author?.id || data?.author_id}`),
                    is_owner: isOwner,
                },
                media: {
                    type: "image",
                    url: `/attachments/${data.media?.url || data.url}`,
                },
            };
        })
    ))
};

export const useFormatMediaData = async (server: SupabaseClient, client: SupabaseClient, data: Record<string, any>, related: Record<string, any>, group_id: string, user: User) => {

    const { data: users } = await useListUsers(server);

    const { data: permissions } = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).single<Tables<"members">>()
    const { data: liked } = await client.from("liked_posts").select("id").eq("post_id", data.id).eq("user_id", user.id).single<Tables<"liked_posts">>()

    const { data: settings } = await server.from("group_settings").select("*").eq("group_id", group_id).single<Tables<"group_settings">>()
    

    const author: User | undefined = users.users.find((user) => user.id === data.author_id);

    return {
        id: data.id,
        created_at: data.created_at,
        has_interactions: !settings?.social_interactions ? null : {
            has_liked: liked ? true : false,
            likes: {
                count: data.likes,
            },
            comments: {
                count: data.comments,
            },
        },
        author: {
            name: author?.user_metadata?.name || "Unknown",
            is_owner: data.author_id == user?.id,
        },
        permision: {
            can_delete_message: permissions?.can_delete_messages_all || permissions?.user_id === data.author_id
        },
        
        media: {
            type: "image",
            url: `/attachments/${data.url}`
        },
        related
    }
}

export const useListUsers = async (server: SupabaseClient) => await server.auth.admin.listUsers();

export const getUpdatedValue = <T>(newValue: T, oldValue: T): T | undefined => {
    return newValue === oldValue ? undefined : newValue;
}

export const replaceWithTarget = (message: string, target: string, replace: string = ":member:"): string => {
    if (!message || !target) return message;
    return message.replace(new RegExp(replace, "g"), `${target}s`);
}


export const isToday = (date: string | Date) => {
    const today = new Date();
    const parsedDate = typeof date === "string" ? new Date(date) : date;

    return (
        parsedDate.getDate() === today.getDate() &&
        parsedDate.getMonth() === today.getMonth() &&
        parsedDate.getFullYear() === today.getFullYear()
    );
};

export const isYesterday = (date: string | Date) => {
    const yesterday = new Date();
    const parsedDate = typeof date === "string" ? new Date(date) : date;

    yesterday.setDate(yesterday.getDate() - 1);

    return (
        parsedDate.getDate() === yesterday.getDate() &&
        parsedDate.getMonth() === yesterday.getMonth() &&
        parsedDate.getFullYear() === yesterday.getFullYear()
    );
};

export const formatDate = (date: string | Date) => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;

    return parsedDate.toLocaleDateString("en-UK", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};