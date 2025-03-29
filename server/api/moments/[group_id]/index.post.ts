import crypto from "crypto";

const schema = zod.object({
	files: createFilesObject(zod).max(4, { message: "Maximum of 4 images allowed" })
});

export default defineSupabaseEventHandler(async (event, user, client, server) => {

	if (!user) return useReturnResponse(event, unauthorizedError);

	const { request, files, error } = await useValidateMultipartFormData(event, schema)
	if (error) return useReturnResponse(event, error)

	/*
	************************************************************************************
	*/

	const posts: any = []
	const { group_id } = getRouterParams(event);

	for (const file of files) {
		const imageId = crypto.randomUUID();
		const buffer = await processImage(file);

		const { data: image, error: storageError } = await uploadImage(client, group_id, user.id, imageId, buffer);
		if (storageError) return useReturnResponse(event, internalServerError);

		const { data, error } = await client.from("posts").insert({
			url: image.path, group_id: group_id
		}).select().single();

		if (error) return useReturnResponse(event, internalServerError);
		posts.push(data);
	}

	/*
	************************************************************************************
	*/

	const { error: errorGroup } = await server.from("groups").update({
		last_active: new Date(Date.now() + (process.env.time ? parseInt(process.env.time) : 0)).toISOString(),
		last_photo_posted_by: user.id
	}).eq("id", group_id)

	if (errorGroup) return useReturnResponse(event, internalServerError)

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

