export default defineSupabaseEventHandler(async (event, user, client, server) => {

	if (!user) return useReturnResponse(event, unauthorizedError);

	const { group_id, image_id } = getRouterParams(event);

	const request = await readBody(event)

	/*
	************************************************************************************
	*/

	const { data, error }: any = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).single()
	if (error) return useReturnResponse(event, notFoundError);

	const { data: settings, error: settingError }: any = await client.from("group_settings").select("*").eq("group_id", group_id).single()
	if (settingError) return useReturnResponse(event, internalServerError)

	if (settings.owner_id != user.id && !data.can_edit_group) return useReturnResponse(event, forbiddenError)

	/*
	************************************************************************************
	*/

	
	if (!request.has_been_accepted) {
		await client.from('posts').delete().eq('id', image_id)

		return useReturnResponse(event, {
			status: {
				success: true,
				refresh: true,
				message: "Ok",
				code: 200
			},
		});
	}

	const { error: updateError }: any = await server.from("posts").update({ Accepted: true }).eq("id", image_id)
	if (updateError) return useReturnResponse(event, internalServerError);

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

