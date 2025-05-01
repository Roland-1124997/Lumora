
const schema = zod.object({
	LinkExpiry: zod.enum(['1day', '7days', '30days', 'never'], {
		message: "Invalid value for Link Expiry",
	}),
	UsageLimit: zod.enum(['1', '5', '10', '25', 'unlimited'], {
		message: "Invalid value for Usage Limit",
	}),
})


export default defineSupabaseEventHandler(async (event, user, client, server) => {

	if (!user) return useReturnResponse(event, unauthorizedError);
	
	const { group_id } = getRouterParams(event);
	const request = await readBody(event)

	const { error: zodError } = await schema.safeParseAsync(request);

	if (zodError) return useReturnResponse(event, {
		...badRequestError,
		error: {
			type: "fields",
			details: zodError.errors
		}
	})

	/*
	************************************************************************************
	*/

	const { data: permissions, error: permisionError } = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).eq("accepted", true).single<Tables<"members">>()
	if (permisionError) return useReturnResponse(event, notFoundError)

	const { data: settings, error: settingError } = await client.from("group_settings").select("*").eq("group_id", group_id).single<Tables<"group_settings">>()
	if (settingError) return useReturnResponse(event, notFoundError)

	if (!settings.everyone_can_create_link && !permissions.can_edit_group) return useReturnResponse(event, forbiddenError)

	/*
	************************************************************************************
	*/

	const token = Math.random().toString(36).substring(2, 8).toUpperCase();
		
	const { error } = await client.from("invite_links").insert({
		group_id: group_id,
		code: token,
		expiresAt: new Date(new Date().setDate(new Date().getDate() + parseInt(request.LinkExpiry))),
		uses: parseInt(request.UsageLimit),
	});

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
		data: {
			code: token
		}
	});
})

