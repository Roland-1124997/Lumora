
export default defineSupabaseEventHandler(async (event, user, client, server) => {

	if (!user) return useReturnResponse(event, unauthorizedError);

	const { group_id } = getRouterParams(event);
	const { data, error }: any = await server.from("invite_links").select("**").eq("group_id", group_id)

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
		}, 
		data
	});
})
