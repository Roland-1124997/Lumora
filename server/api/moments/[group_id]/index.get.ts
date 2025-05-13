
export default defineSupabaseEventHandler(async (event, user, client, server) => {

	if (!user) return useReturnResponse(event, unauthorizedError);

	const query: query = getQuery(event);
	const { items, page } = useMakePagination(12, query);
	const { group_id } = getRouterParams(event);

	const pending = query.pending ? query.pending.toLowerCase() : false;

	if(page == 1) {
		await server.rpc('upsert_user_group_visit', {
			p_user_id: user.id,
			p_group_id: group_id
		})
	}

	/*
	************************************************************************************
	*/

	const { data: settings, error: settingsError } = await server.from("group_settings").select("*").eq("group_id", group_id).single<Tables<"group_settings">>()
	if (settingsError) return useReturnResponse(event, notFoundError)

	const { data: accepted } = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).eq("accepted", true).single<Tables<"members">>()

	const { data: media, error } = await client.rpc("get_group_with_posts", {
		group_id_param: group_id, limit_param: items, page_param: page, user_id_param: user.id, 
		include_accepted_param: !pending, include_can_mod_own_pending_param: !settings.can_mod_own_pending
	}).single<{
		group_id: string; name: string; thumbnail: string; last_active: string; last_photo_posted_by: string; 
		owner_id: string; description: string; total_count: number; posts: Post[];
	}>()

	if (error) {
		if (error.details?.includes("0 rows")) return useReturnResponse(event, notFoundError)
		return useReturnResponse(event, notFoundError)
	}

	/*
	************************************************************************************
	*/

	if (pending) {
		if (!settings.needs_review) return useReturnResponse(event, notFoundError);
		if (!accepted?.can_edit_group) return useReturnResponse(event, forbiddenError);
	}

	return useReturnResponse(event, {
		status: {
			success: true,
			message: "Ok",
			code: 200
		},
		meta: {
			id: media.group_id,
			name: media.name,
			description: media.description,
		},
		pagination: {
			page: page,
			total: Math.ceil((media.total_count ?? 1) / items)
		},
		data: !accepted ? [] : await useFormatGroup(server, media.posts)
	});
})

