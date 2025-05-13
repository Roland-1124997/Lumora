export default defineSupabaseEventHandler(async (event, user, client, server) => {

	if (!user) return useReturnResponse(event, unauthorizedError);

	const { group_id } = getRouterParams(event);

	/*
	************************************************************************************
	*/

	const { data, error } = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).single<Tables<'members'>>()
	if (error) return useReturnResponse(event, notFoundError);

	const { data: settings, error: settingError } = await client.from("group_settings").select("*").eq("group_id", group_id).single<Tables<'group_settings'>>()
	if (settingError) return useReturnResponse(event, internalServerError)

	const postsQuery = client.from("posts").select("*", { count: "exact" }).eq("Accepted", false).eq("group_id", group_id)
	if (!settings.can_mod_own_pending) postsQuery.neq("author_id", user.id)

	const { count } = await postsQuery.overrideTypes<Array<Tables<"posts">>>();

	/*
	************************************************************************************
	*/

	return useReturnResponse(event, {
		status: {
			success: true,
			message: "Ok",
			code: 200
		}, 
		data: { 
			accepted: data.accepted,
			need_approval: settings.needs_review,
			posts_count_need_approval: settings.needs_review && (settings.owner_id == user.id || data.can_edit_group) ? count : 0,
			has_permisons: settings.owner_id == user.id || data.can_edit_group,
		}
	});
})

