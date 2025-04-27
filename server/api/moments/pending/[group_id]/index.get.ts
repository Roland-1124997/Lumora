export default defineSupabaseEventHandler(async (event, user, client, server) => {

	if (!user) return useReturnResponse(event, unauthorizedError);

	const { group_id } = getRouterParams(event);

	/*
	************************************************************************************
	*/

	const { data, error }: any = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).single()
	if (error) return useReturnResponse(event, notFoundError);

	const { data: settings, error: settingError }: any = await client.from("group_settings").select("*").eq("group_id", group_id).single()
	if (settingError) return useReturnResponse(event, internalServerError)

	const { data: group, error: groupError } = await client.from("groups").select("*").eq("id", group_id).single()
	if (groupError) return useReturnResponse(event, internalServerError)
	
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
			is_owner: group.owner_id == user.id,
		}
	});
})

