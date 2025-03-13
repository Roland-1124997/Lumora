export default defineSupabaseEventHandler(async (event, user, client, server) => {

    const query: query = getQuery(event);
    const currentSearch = query.search ? query.search.toLowerCase() : "";
    const { items, page, start, end } = useMakePagination(8, query);

    const { count, data, error } = await client.from("groups")
        .select("*", { count: "exact" }).ilike("name", `${currentSearch}%`).range(start, end)
        .order(currentSearch ? "name" : "last_active", { ascending: currentSearch ? true : false });

    if (error) return useReturnResponse(event, internalServerError);
    if (count === 0) return useReturnResponse(event, notFoundError);

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "Data received",
            code: 200
        },
        pagination: {
            page,
            total: Math.ceil((count ?? 1) / items),
        },
        data: await useFormatListGroup(server, data)
    });

})


