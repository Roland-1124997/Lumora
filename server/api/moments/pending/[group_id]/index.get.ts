export default defineSupabaseEventHandler(async (event, user, client, server) => {

	if (!user) return useReturnResponse(event, unauthorizedError);

	const { group_id } = getRouterParams(event);

	/*
	************************************************************************************
	*/

	const { data, error }: any = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).single()

	if (error) return useReturnResponse(event, notFoundError);
	
	/*
	************************************************************************************
	*/

	return useReturnResponse(event, {
		status: {
			success: true,
			message: "Ok",
			code: 200
		},
		data: { accepted: data.accepted}
	});
})

