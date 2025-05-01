
export default defineSupabaseEventHandler(async (event, user, client, server) => {

	if (!user) return useReturnResponse(event, unauthorizedError);

	const { group_id } = getRouterParams(event);

	const { data: permissions, error: permisionError } = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).single<Tables<"members">>()
	if (permisionError) return useReturnResponse(event, notFoundError)

	const { data: accepted } = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).eq("accepted", true).single<Tables<"members">>()

	if (!accepted) return useReturnResponse(event, {
		status: {
			success: true,
			refresh: true,
			message: "Ok",
			code: 200
		},
		data: []
	});

	const { data: links, error } = await client.from("invite_links").select("*").eq("group_id", group_id).overrideTypes<Array<Tables<"invite_links">>>()
	if (error) return useReturnResponse(event, internalServerError)

	/*
	************************************************************************************
	*/

	const formated = await Promise.all(
		links.map(async (data: Record<string, any>) => {
			return {
				...data,
				permision: {
					delete: permissions?.can_edit_group || permissions?.user_id === data.user_id,
				},
			};
		})
	) as [{
		created_at: string, expiresAt: string, code: string, uses: number | null, 
		group_id: string, id: string, user_id: string, permision: { delete: boolean }
	}]

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
