import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
	const time = Date.now();
	const query: any = getQuery(event);

  const client = await serverSupabaseClient(event);
  const { error: sessionError } = await useSessionExists(event, client, time);
  if (sessionError) return sessionError;

  const currentSearch = query.search ? query.search.toLowerCase() : "";
  const { items, page, start, end } = useMakePagination(16, query.page ? parseInt(query.page) : 1);

	const { count, data, error } = await client.from("groups").select("*", { count: "exact" }).ilike("name", `${currentSearch}%`)
    .range(start, end).order(currentSearch ? "name" : "last_active", { ascending: currentSearch ? true : false });

  if (error) return useReturnResponse(event, time, internalServerError);
  if (count === 0) return useReturnResponse(event, time, notFoundError);

	return useReturnResponse(event, time, {
		meta: {
			code: 200,
			message: "Data received",
		},
		pagination: {
			page,
      total: Math.ceil((count ?? 1) / page),
			items,
		},
		data,
	});
});
