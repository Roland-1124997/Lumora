import { serverSupabaseClient, serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
	const query: query = getQuery(event);

	const { group_id } = getRouterParams(event);

	const client: SupabaseClient = await serverSupabaseClient(event);
	const server = serverSupabaseServiceRole(event)

	const { data: user, error: sessionError }: Record<string, any> = await useSessionExists(event, client);
	if (sessionError) return useReturnResponse(event, unauthorizedError);;

	const { items, page } = useMakePagination(12, query);

	const { data: media, error }: any = await client.rpc("get_group_with_posts", {
		group_id_param: group_id,
		limit_param: items,
		page_param: page,
		user_id_param: user.id
	}).single()

	if (error && error.details.includes("0 rows")) return useReturnResponse(event, notFoundError)
	if (error) return useReturnResponse(event, internalServerError);

	return useReturnResponse(event, {
		status: {
			success: true,
			message: "Ok",
			code: 200
		},
		meta: {
			id: media.group_id,
			name: media.name,
			description: media.description
		},
		pagination: {
			page: page,
			total: Math.ceil((media.total_count ?? 1) / items)
		},
		data: await useFormatGroupPosts(server, client, media)
	});
});
