import { serverSupabaseClient, serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const time = Date.now();
    const query: query = getQuery(event);

    const { id } = getRouterParams(event);
    
    const client = await serverSupabaseClient(event);
    const server = serverSupabaseServiceRole(event)
    const { error: sessionError } = await useSessionExists(event, client, time);
	if (sessionError) return useReturnResponse(event, time, unauthorizedError);;

	const { error: errorGroup } = await client.from("groups").select("*").eq("id", id).eq("name", query.slug.replaceAll('-', ' ')).single() 
	if (errorGroup) return useReturnResponse(event, time, forbiddenError);

    const { items, page, start, end } = useMakePagination(12, query);
    const { count, data, error } = await client.from("posts").select("*", { count: "exact" }).eq("group_id", id).range(start, end).order("created_at", { ascending: false });

    if (error) return useReturnResponse(event, time, internalServerError);
    if (count === 0) return useReturnResponse(event, time, notFoundError);

	const updated = await Promise.all(data.map(async (posts: post) => {
		const { data: userData } = await server.auth.admin.getUserById(posts.author_id);
		return {
			...posts,
			url: client.storage.from("images").getPublicUrl(posts.url).data.publicUrl,
			author: userData.user?.user_metadata.name
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