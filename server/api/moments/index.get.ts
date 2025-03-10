export default defineEventHandler(async (event) => {
	const query: query = getQuery(event);

	const client = await serverSupabaseClient(event);
	const server = serverSupabaseServiceRole(event)
	
	const { error: sessionError } = await useSessionExists(event, client );
	if (sessionError) return useReturnResponse(event, unauthorizedError)

	const currentSearch = query.search ? query.search.toLowerCase() : "";
	const { items, page, start, end } = useMakePagination(8, query);

	const { count, data, error } = await client.from("groups").select("*", { count: "exact" }).ilike("name", `${currentSearch}%`)
		.range(start, end).order(currentSearch ? "name" : "last_active", { ascending: currentSearch ? true : false });

	if (error) return useReturnResponse(event, internalServerError);
	if (count === 0) return useReturnResponse(event, notFoundError);

	const { data: users} = await server.auth.admin.listUsers();

	const updated = await Promise.all(data.map(async (group: any) => {

		const author: any = users.users.find((user) => user.id === group.last_photo_posted_by);

		return {
			id: group.id,
			name: group.name,
			description: group.description,
			last_active: group.last_active,
			last_photo_posted_by: author.user_metadata.name,
			media: {
				type: "image",
				url: `/attachments/${group.thumbnail}`
			}
		};
	}));

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
		data: updated
	});
});
