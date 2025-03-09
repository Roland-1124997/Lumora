import * as zod from "zod";
import sharp from "sharp";
import crypto from "crypto";

const schema = zod.object({
	name: zod.string({ message: "Dit is een verplicht veld" }).nonempty({ message: "Dit is een verplicht veld" }),
	description: zod.string({ message: "Dit is een verplicht veld" }).nonempty({ message: "Dit is een verplicht veld" }),
	files: zod.array(
		zod.object({
			name: zod.string(), 
			filename: zod.string(), 
			type: zod.string().regex(/^image\/(jpeg|png|)$/, "Alleen PNG of JPEG-bestanden zijn toegestaan"), 
			data: zod.instanceof(Buffer).refine((buffer) => buffer.length <= 10 * 1024 * 1024, {
				message: "Bestandsgrootte mag niet groter zijn dan 10MB", 
			})
		})
	).nonempty("Dit is een verplicht veld") 
});

export default defineEventHandler(async (event) => {
	
	const client: SupabaseClient = await serverSupabaseClient(event);
	
	const { data: user, error: sessionError }: Record<string, any> = await useSessionExists(event, client);
	if (sessionError) return useReturnResponse(event, unauthorizedError);

	const request = await useReadMultipartFormData(event);
	const { error: zodError } = await schema.safeParseAsync(request);

	if (zodError) return useReturnResponse(event, {
		...badRequestError,
		error: {
			type: "fields",
			details: zodError.errors
		}
	})

	const imageId = crypto.randomUUID();
	let buffer: Buffer = Buffer.isBuffer(request.files[0].data) ? request.files[0].data : Buffer.from(request.files[0].data);

	await sharp(buffer).rotate().webp({ quality: 5 }).toBuffer().then((data) => buffer = data)

	const { data, error } = await client.from("groups").insert({
		description: request.description,
		name: request.name
	}).select("*").single();

	if (error) return useReturnResponse(event, internalServerError);

	const { error: storageError } = await client.storage.from('images')
		.upload(`${data.id}/${user.id}/${imageId}.webp`, buffer, {
			contentType: "image/webp",
			cacheControl: '3600',
			upsert: true,
		});

	if (storageError) return useReturnResponse(event, internalServerError);

	const { error: updateError } = await client.from("groups").update({
		thumbnail: `${data.id}/${user.id}/${imageId}.webp`,
	}).eq('id', data.id)

	if (updateError) return useReturnResponse(event, internalServerError);
	
	return useReturnResponse(event, {
		status: {
			success: true,
			redirect: `/moments/${data.id}`,
			message: "Ok",
			code: 200
		}
	});
});
