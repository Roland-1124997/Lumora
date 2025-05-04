

export default defineSupabaseEventHandler(async (event, user, client, server) => {

	if (!user) return useReturnResponse(event, unauthorizedError);
	
	const { group_id, invite_id } = getRouterParams(event);
	const query = getQuery(event);

	const { data: permissions, error: permisionError } = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).eq("accepted", true).single<Tables<"members">>()
	if (permisionError) return useReturnResponse(event, notFoundError)

	if (permissions.can_edit_group) {
		const { error } = await client.from("invite_links").delete().eq("id", invite_id)
		if (error) return useReturnResponse(event, internalServerError)
	} 
	
	else {
		const { error } = await client.from("invite_links").delete().eq("id", invite_id).eq("user_id", user.id)
		if (error) return useReturnResponse(event, internalServerError)
	}

	const { error: logError } = await server.from("logbook").insert({
		message: `Deleted an invite link`,
		performed_by_id: user.id,
		action_type: "deleted",
		group_id: group_id,
		context: {
			token: query.token
		},
	})

	if (logError) return useReturnResponse(event, internalServerError)

	/*
	************************************************************************************
	*/
	
	return useReturnResponse(event, {
		status: {
			success: true,
			refresh: true,
			message: "Ok",
			code: 200
		}
	});
})

