import { serverSupabaseClient, serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
	const time = Date.now();
	const query: query = getQuery(event);

	const client = await serverSupabaseClient(event);
	const server = serverSupabaseServiceRole(event)
	const { error: sessionError } = await useSessionExists(event, client, time);
	if (sessionError) return useReturnResponse(event, time, unauthorizedError)

	const currentSearch = query.search ? query.search.toLowerCase() : "";
	const { items, page, start, end } = useMakePagination(8, query);

	const { count, data, error } = await client.from("groups").select("*", { count: "exact" }).ilike("name", `${currentSearch}%`)
		.range(start, end).order(currentSearch ? "name" : "last_active", { ascending: currentSearch ? true : false });

	if (error) return useReturnResponse(event, time, internalServerError);
	if (count === 0) return useReturnResponse(event, time, notFoundError);

	const updated = await Promise.all(data.map(async (group: any) => {
		const { data: userData } = await server.auth.admin.getUserById(group.last_photo_posted_by);
		return {
			thumbnail: client.storage.from("images").getPublicUrl(group.thumbnail).data.publicUrl,
			meta: {
				id: group.id,
				name: group.name.replaceAll(' ', '-'),
				description: group.description,
				last_active: group.last_active,
				last_photo_posted_by: userData.user?.user_metadata.name,
			},
		};
	}));

	return useReturnResponse(event, time, {
		meta: {
			code: 200,
			message: "Data received",
		},
		pagination: {
			page,
			total: Math.ceil((count ?? 1) / items),
		},
		data: updated
	});
});
