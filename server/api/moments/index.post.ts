import crypto from "crypto";

const schema = zod.object({
	name: zod.string({ message: "Dit is een verplicht veld" }).nonempty({ message: "Dit is een verplicht veld" }).max(20, { message: "Maximaal 20 karakters" }),
	description: zod.string({ message: "Dit is een verplicht veld" }).nonempty({ message: "Dit is een verplicht veld" }).max(200, { message: "Maximaal 200 karakters" }),
	files: createFilesObject(zod)
});

export default defineSupabaseEventHandler(async (event, user, client) => {

	if (!user) return useReturnResponse(event, unauthorizedError);
	
	const { request, files, error: validateError } = await useValidateMultipartFormData(event, schema)
	if (validateError) return useReturnResponse(event, validateError)

	/*
	************************************************************************************
	*/

	const { data, error } = await client.from("groups").insert({
		description: request.description,
		name: request.name
	}).select("*").single();

	if (error) return useReturnResponse(event, internalServerError);

	/*
	************************************************************************************
	*/

	const imageId = crypto.randomUUID();
	const buffer = await processImage(files[0]);

	const { data: image, error: storageError } = await uploadImage(client, data.id, user.id, imageId, buffer);
	if (storageError) return useReturnResponse(event, internalServerError);
	
	const { error: updateError } = await client.from("groups").update({
		thumbnail: image.path
	}).eq('id', data.id)

	if (updateError) return useReturnResponse(event, internalServerError);

	/*
	************************************************************************************
	*/
	
	return useReturnResponse(event, {
		status: {
			success: true,
			redirect: `/moments/${data.id}`,
			message: "Ok",
			code: 200
		}
	});
})
