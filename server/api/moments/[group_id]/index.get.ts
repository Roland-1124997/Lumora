import { serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const time = Date.now();
    const query: query = getQuery(event);

	const { group_id } = getRouterParams(event);
    
    const client = await serverSupabaseClient(event);
    const server = serverSupabaseServiceRole(event)

    const { error: sessionError } = await useSessionExists(event, client, time);
	if (sessionError) return useReturnResponse(event, time, unauthorizedError);;

	const user = await serverSupabaseUser(event);
	if (!user) return useReturnResponse(event, time, internalServerError);

	const { data: groupData, error: errorGroup }: any = await client.from("groups").select("*").eq("id", group_id).single() 
	if (errorGroup) return useReturnResponse(event, time, forbiddenError);

	const customError = {
		meta: {
			id: group_id,
			name: groupData.name,
			code: 404,
			message: "Not Found",
		},
	}

    const { items, page, start, end } = useMakePagination(12, query);
	const { count, data, error } = await client.from("posts").select("*", { count: "exact" }).eq("group_id", group_id).range(start, end).order("created_at", { ascending: false });

    if (error) return useReturnResponse(event, time, internalServerError);
	if (count === 0) return useReturnResponse(event, time, customError);

	const updated = await Promise.all(data.map(async (posts: any) => {
		const { data: userData } = await server.auth.admin.getUserById(posts.author_id);
		const { data }: any = await server.from("liked_posts").select("*").eq("post_id", posts.id).eq("user_id", user.id).single()

		return {
			
			url: client.storage.from("images").getPublicUrl(posts.url).data.publicUrl,
			meta: {
				id: posts.id,
				created_at: posts.created_at,
			},
			likes: {
				count: posts.likes,
				liked: data ? data.user_id === user.id : false
			},
			author: {
				id: posts.author_id,
				name: userData.user?.user_metadata.name
			},
		};
	}));


	return useReturnResponse(event, time, {
		meta: {
			id: group_id,
			name: groupData.name,
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