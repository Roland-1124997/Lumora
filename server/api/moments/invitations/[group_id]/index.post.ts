
const schema = zod.object({
	LinkExpiry: zod.string({ message: "Dit is een verplicht veld" }).nonempty({ message: "Dit is een verplicht veld" }),
	UsageLimit: zod.string({ message: "Dit is een verplicht veld" }).nonempty({ message: "Dit is een verplicht veld" }),
});

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

	const { data: permissions, error: permisionError }: any = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).single()
	if (permisionError) return useReturnResponse(event, notFoundError)

	const { data: settings, error: settingError }: any = await client.from("group_settings").select("*").eq("group_id", group_id).single()
	if (settingError) return useReturnResponse(event, notFoundError)

	if (!settings.everyone_can_create_link && !permissions.can_edit_group) return useReturnResponse(event, forbiddenError)

	/*
	************************************************************************************
	*/
		
	const { error } = await client.from("invite_links").insert({
		group_id: group_id,
		code: Math.random().toString(36).substring(2, 8).toUpperCase(),
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
		}
	});
})

