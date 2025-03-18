

export default defineSupabaseEventHandler(async (event, user, client, server) => {

	if (!user) return useReturnResponse(event, unauthorizedError);
	
	const { invite_id } = getRouterParams(event);

	const { error } = await client.from("invite_links").delete().eq("id", invite_id)
	if (error) return useReturnResponse(event, internalServerError)

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

