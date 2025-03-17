
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

	const { data, error } = await server.from("invite_links").insert({
		group_id: group_id,
		code: Math.random().toString(36).substring(2, 8).toUpperCase(),
		expiresAt: request.LinkExpiry === 'unlimited' ? 'unlimited' : new Date(new Date().setDate(new Date().getDate() + parseInt(request.LinkExpiry))),
		uses: request.UsageLimit === 'unlimited' ? "unlimited" : parseInt(request.UsageLimit),
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

