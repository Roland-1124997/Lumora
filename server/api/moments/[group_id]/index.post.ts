import crypto from "crypto";

const schema = zod.object({
	files: createFilesObject(zod).max(4, { message: "Maximum of 4 images allowed" })
});

export default defineSupabaseEventHandler(async (event, user, client, server) => {

	if (!user) return useReturnResponse(event, unauthorizedError);

	const { group_id } = getRouterParams(event);
	const { data: accepted }: any = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).eq("accepted", true).single()
	
	const { request, files, error } = await useValidateMultipartFormData(event, schema)
	if (error) return useReturnResponse(event, error)

	if (!accepted) return useReturnResponse(event, unauthorizedError)

	const { data: settings, error: settingError }: any = await client.from("group_settings").select("*").eq("group_id", group_id).single()
	if (settingError) return useReturnResponse(event, internalServerError)

	/*
	************************************************************************************
	*/

	const posts: any = []

	for (const file of files) {
		const imageId = crypto.randomUUID();
		const buffer = await processImage(file);

		const { data: image, error: storageError } = await uploadImage(client, group_id, user.id, imageId, buffer);
		if (storageError) return useReturnResponse(event, internalServerError);

		const { data, error } = await client.from("posts").insert({
			url: image.path, group_id: group_id, Accepted: !settings.needs_review
		}).select().single();

		if (error) return useReturnResponse(event, internalServerError);
		posts.push(data);
	}

	/*
	************************************************************************************
	*/

	if (!settings.needs_review) {
		const { error: errorGroup } = await server.from("groups").update({
			last_photo_posted_by: user.id,
			last_action: "Created"
		}).eq("id", group_id)

		if (errorGroup) return useReturnResponse(event, internalServerError)
	}

	

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
		meta: {
			id: posts[0].group_id,
			name: posts[0].name,
			description: posts[0].description
		},
		data: await useFormatGroup(server, posts, user)
	});
	
});

