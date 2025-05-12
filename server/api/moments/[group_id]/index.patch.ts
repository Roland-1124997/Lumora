const schema = zod.object({
	name: zod.string({ message: "This is a required field" }).nonempty({ message: "This is a required field" }),
	description: zod.string({ message: "This is a required field" }).nonempty({ message: "This is a required field" }),
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

	const { data: permissions, error: permisionError } = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).single<Tables<"members">>()
	if (permisionError) return useReturnResponse(event, notFoundError)

	if (!permissions.can_delete_group) return useReturnResponse(event, forbiddenError)

	/*
	************************************************************************************
	*/

	const { data: group, error: groupError } = await server.from("groups").select("*").eq("id", group_id).single<Tables<"groups">>()
	if (groupError) return useReturnResponse(event, notFoundError)


	const { data, error: settingsError } = await server.from("group_settings").select("*").eq("group_id", group_id).single<Tables<"group_settings">>()
	if (settingsError) return useReturnResponse(event, notFoundError)

	const filteredContext = Object.fromEntries(
		Object.entries({
			description: getUpdatedValue(request.description, group.description),
			name: getUpdatedValue(request.name, group.name),
			"Posts need to be reviewed": getUpdatedValue(request.configuration.reviewPosts, data.needs_review),
			"Anyone can create links": getUpdatedValue(request.configuration.createLinks, data.everyone_can_create_link),
			"Auto accept new members": getUpdatedValue(request.configuration.autoAccept, data.auto_accept_new_members),
			"Can handle own pending posts": getUpdatedValue(request.configuration.canModOwnPending, data.can_mod_own_pending),
			"Social interactions": getUpdatedValue(request.configuration.socialInteractions, data.social_interactions),
		}).filter(([_, value]) => value !== undefined) 
	);
	
	if (Object.keys(filteredContext).length === 0) {
		return useReturnResponse(event, {
			status: {
				success: true,
				refresh: true,
				message: "Ok",
				code: 200
			}
		});
	}
	
	/*
	************************************************************************************
	*/

	const { error } = await server.from("groups").update({
		description: request.description,
		name: request.name
	}).eq("id", group_id)
	
	if (error) return useReturnResponse(event, internalServerError);

	/*
	************************************************************************************
	*/

	const { error: settingError } = await server.from("group_settings").update({
		needs_review: request.configuration.reviewPosts,
		can_mod_own_pending: request.configuration.canModOwnPending,
		everyone_can_create_link: request.configuration.createLinks,
		auto_accept_new_members: request.configuration.autoAccept,
		social_interactions: request.configuration.socialInteractions
	}).eq("group_id", group_id)

	if (settingError) return useReturnResponse(event, notFoundError)

	const { error: logError } = await server.from("logbook").insert({
		message: "Updated the group settings",
		performed_by_id: user.id,
		action_type: "updated",
		group_id: group_id,
		context: filteredContext
	});

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

