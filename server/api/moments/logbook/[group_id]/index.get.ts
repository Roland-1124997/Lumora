
export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id } = getRouterParams(event);

    const query: query = getQuery(event);
    const { items, page, start, end } = useMakePagination(100, query);

    const { error: permisionError } = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).single<Tables<"members">>()
    if (permisionError) return useReturnResponse(event, notFoundError)

    /*
    ************************************************************************************
    */

    const { data: users } = await useListUsers(server);

    const logbookQuery = server.from("logbook").select("*", { count: "exact" }).eq("group_id", group_id).order("timestamp", { ascending: false }).range(start, end)

    if (query.action || query.timestamp) {
        logbookQuery.match(query.action && query.action !== "all" ? { action_type: query.action } : {})
            .gte("timestamp", query.timestamp ? new Date(new Date().setDate(new Date().getDate() - query.timestamp)).toISOString() : "1970-01-01T00:00:00.000Z");
    }

    if (query.search) {

        const { data, error } = await client.from("members").select("*").eq("group_id", group_id).overrideTypes<Array<Tables<"members">>>()
        if (error) return useReturnResponse(event, notFoundError)

        const members = data.map((member: Tables<"members">) => users.users.find((user: User) => user.id === member.user_id));
        const targetUser: User | undefined = members.find((user: User | undefined) => user?.user_metadata.name.toLowerCase().includes(query.search.toLowerCase()));

        logbookQuery.eq("performed_by_id", targetUser?.id)
    }

    const { count, data: logs, error } = await logbookQuery.overrideTypes<Array<Tables<"logbook">>>();

    if (error) return useReturnResponse(event, notFoundError);

    /*
    ************************************************************************************
    */

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

    const groupedByDate = formated.reduce((acc: Record<string, any[]>, item: any) => {
        const itemDate = new Date(item.timestamp);
        let dateKey: string;

        if (isToday(itemDate)) dateKey = "Today";
        else if (isYesterday(itemDate)) dateKey = "Yesterday";
        else dateKey = formatDate(itemDate);
        if (!acc[dateKey]) acc[dateKey] = [];

        acc[dateKey].push(item);
        return acc;
    }, {});

    const groupedByDateArray = Object.entries(groupedByDate).map(([date, items]) => ({
        date,
        items,
    }));

    /*
    ************************************************************************************
    */

    return useReturnResponse(event, {
        status: {
            success: true,
            refresh: true,
            message: "Ok",
            code: 200
        },
        pagination: {
            page,
            total: Math.ceil((count ?? 1) / items),
        },
        data: groupedByDateArray
    });
})

