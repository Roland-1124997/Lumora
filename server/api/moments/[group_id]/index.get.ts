export default defineSupabaseEventHandler(async (event, user, client, server) => {

	if (!user) return useReturnResponse(event, unauthorizedError);

	const query: query = getQuery(event);
	const { items, page } = useMakePagination(12, query);
	const { group_id } = getRouterParams(event);

	/*
	************************************************************************************
	*/

	const { data: media, error }: any = await client.rpc("get_group_with_posts", {
		group_id_param: group_id, limit_param: items, page_param: page, user_id_param: user.id
	}).single()

	if (error && error.details.includes("0 rows")) return useReturnResponse(event, notFoundError)
	if (error) return useReturnResponse(event, internalServerError);

	/*
	************************************************************************************
	*/

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
		data: await useFormatGroup(server, media.posts)
	});
})

