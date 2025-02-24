import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
	const time = Date.now();
	const query: query = getQuery(event);

	const client = await serverSupabaseClient(event);
	const { error: sessionError } = await useSessionExists(event, client, time);
	if (sessionError) return sessionError;

	const currentSearch = query.search ? query.search.toLowerCase() : "";
	const { items, page, start, end } = useMakePagination(8, query);

	const { count, data, error } = await client.from("groups").select("*", { count: "exact" }).ilike("name", `${currentSearch}%`)
		.range(start, end).order(currentSearch ? "name" : "last_active", { ascending: currentSearch ? true : false });

	if (error) return useReturnResponse(event, time, internalServerError);
	if (count === 0) return useReturnResponse(event, time, notFoundError);


	data.forEach((group: group) => {
		group.thumbnail = client.storage.from("images").getPublicUrl(group.thumbnail).data.publicUrl
	})

	return useReturnResponse(event, time, {
		meta: {
			code: 200,
			message: "Data received",
		},
		pagination: {
			page,
			total: Math.ceil((count ?? 1) / items),
		},
		data,
	});
});
