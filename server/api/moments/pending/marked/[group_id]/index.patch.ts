export default defineSupabaseEventHandler(async (event, user, client, server) => {

	if (!user) return useReturnResponse(event, unauthorizedError);

	const { group_id } = getRouterParams(event);

	const request = await readBody(event)

	if (!request || Object.keys(request).length === 0) return useReturnResponse(event, badRequestError)

	/*
	************************************************************************************
	*/

	const { data, error } = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).single<Tables<'members'>>()
	if (error) return useReturnResponse(event, notFoundError);

	const { data: settings, error: settingError } = await client.from("group_settings").select("*").eq("group_id", group_id).single<Tables<'group_settings'>>()
	if (settingError) return useReturnResponse(event, internalServerError)

	if (settings.owner_id != user.id && !data.can_edit_group) return useReturnResponse(event, forbiddenError)

	/*
	************************************************************************************
	*/

	for (const [key, value] of Object.entries(request)) {

		const { data: postData, error: postError } = await server.from("posts").select("*").eq("id", key).select().single<Tables<"posts">>()
		if (postError) return useReturnResponse(event, internalServerError);

		if (!value) {
			await client.from('posts').delete().eq('id', key)

			await server.from("groups").update({
				last_photo_posted_by: null,
				last_action: "Rejected"
			}).eq("id", group_id)
		}

		else {
			const { data: updateData, error: updateError } = await server.from("posts").update({ Accepted: true }).eq("id", key).select().single<Tables<"posts">>()
			if (updateError) return useReturnResponse(event, internalServerError);

			await server.from("groups").update({
				last_photo_posted_by: updateData.author_id,
				last_action: "Approved"
			}).eq("id", group_id)
		}

		const { error: logError } = await server.from("logbook").insert({
			message: value 
				? (postData.author_id === user.id ? 'Approved their own photo' : 'Approved :member: photo') 
				: (postData.author_id === user.id ? 'Rejected their own photo' : 'Rejected :member: photo'),
			performed_by_id: user.id,
			target_user_id: postData.author_id,
			action_type: value ? "created" : "deleted",
			group_id: group_id,
			context: {
				type: "image",
			}
		})

		if (logError) return useReturnResponse(event, internalServerError)
	}

	/*
	************************************************************************************
	*/

	return useReturnResponse(event, {
		status: {
			success: true,
			refresh: true,
			message: "Ok",
			code: 200
		},
		
	});
})

