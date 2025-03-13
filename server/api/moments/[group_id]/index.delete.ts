export default defineSupabaseEventHandler(async (event, user, client, server) => {

	const { group_id } = getRouterParams(event);
	const { error } = await client.from("groups").delete().eq("id", group_id)

	if(error) return useReturnResponse(event, internalServerError)

	return useReturnResponse(event, {
		status: {
			success: true,
			redirect: "/moments",
			message: "Ok",
			code: 200
		}
	});
});