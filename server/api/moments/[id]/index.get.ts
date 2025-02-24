import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
	const time = Date.now();
    const query: query = getQuery(event);

    const { id } = getRouterParams(event);
    
	const client = await serverSupabaseClient(event);
    const { error: sessionError} = await useSessionExists(event, client, time);
    if (sessionError) return sessionError;

    const { items, page, start, end } = useMakePagination(16, query);
	const { count, data, error } = await client.from("posts").select("*", { count: "exact" }).eq("group_id", id).range(start, end).order("created_at", { ascending: false });

    if (error) return useReturnResponse(event, time, internalServerError);
    if (count === 0) return useReturnResponse(event, time, notFoundError);

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
