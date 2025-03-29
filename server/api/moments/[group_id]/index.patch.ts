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

	const { error } = await client.from("groups").update({
		description: request.description,
		name: request.name
	}).eq("id", group_id)
	
	if (error) return useReturnResponse(event, internalServerError);

	/*
	************************************************************************************
	*/

	const { data, error: settingError }: any = await server.from("group_settings").update({
		needs_review: request.configuration.reviewPosts,
		everyone_can_create_link: request.configuration.createLinks,
		auto_accept_new_members: request.configuration.autoAccept,
		social_interactions: request.configuration.socialInteractions
	}).eq("group_id", group_id)

	if (settingError) return useReturnResponse(event, notFoundError)

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
