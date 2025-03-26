
export default defineSupabaseEventHandler(async (event, user, client, server) => {

	if (!user) return useReturnResponse(event, unauthorizedError);

	const { group_id } = getRouterParams(event);

	const { data: permissions, error: permisionError }: any = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).single()
	if (permisionError) return useReturnResponse(event, notFoundError)

	
	const { data, error }: any = await client.from("invite_links").select("*").eq("group_id", group_id)
	if (error) return useReturnResponse(event, internalServerError)

	/*
	************************************************************************************
	*/

	const formated = await Promise.all(
		data.map(async (data: Record<string, any>) => {
			return {
				...data,
				permision: {
					delete: permissions?.can_edit_group || permissions?.user_id === data.user_id,
				},
			};
		})
	);

	return useReturnResponse(event, {
		status: {
			success: true,
			refresh: true,
			message: "Ok",
			code: 200
		}, 
		data: formated
	});
})
