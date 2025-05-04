
export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id } = getRouterParams(event);

    const { data: permissions, error: permisionError } = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).single<Tables<"members">>()
    if (permisionError) return useReturnResponse(event, notFoundError)

    const { data: logs, error } = await server.from("logbook").select("*").eq("group_id", group_id).order("timestamp", { ascending: false }).overrideTypes<Array<Tables<"logbook">>>()
    if (error) return useReturnResponse(event, notFoundError)

    const { data: users } = await useListUsers(server);

    const formated = await Promise.all(
        logs.map(async (data: Record<string, any>) => {

            const performed_by_user: User | undefined = users.users.find((user: User) => user.id === data.performed_by_id);
            const performed_by_name = performed_by_user?.user_metadata.name || null;

            const target_user: User | undefined = users.users.find((user: User) => user.id === data.target_user_id);
            const target_name = target_user?.user_metadata.name || null;

            return {
                ...data,
                message: replaceWithTarget(data.message, target_name),
                performed_by: {
                    name: performed_by_name,
                    url: performed_by_user?.user_metadata.avatar_url || `/attachments/avatar/${performed_by_user?.id}`,
                },
                context: !data.context || (typeof data.context === 'object' && Object.keys(data.context).length === 0) ? undefined : data.context,
                performed_by_id: undefined,
                performed_by_role: undefined,
                target_user_id: undefined,
            };
        })
    )

    return useReturnResponse(event, {
        status: {
            success: true,
            refresh: true,
            message: "Ok",
            code: 200
        },
        data: formated
    });
})

