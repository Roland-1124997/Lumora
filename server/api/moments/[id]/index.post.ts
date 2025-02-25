import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import * as zod from "zod";
import sharp from "sharp";
import crypto from "crypto";

const schema = zod.object({
	files: zod.array(
		zod.object({
			name: zod.string(), 
			filename: zod.string(), 
			type: zod.string().regex(/^image\/(jpeg|png|)$/, "Alleen PNG of JPEG-bestanden zijn toegestaan"), 
			data: zod.instanceof(Buffer).refine((buffer) => buffer.length <= 10 * 1024 * 1024, {
				message: "Bestandsgrootte mag niet groter zijn dan 10MB", 
			})
		})
	).nonempty("Dit is een verplicht veld").max(4, { message: "4 afbeeldingen maximaal" })
});

export default defineEventHandler(async (event) => {
	const time = Date.now();

    const { id } = getRouterParams(event);

	const client: SupabaseClient = await serverSupabaseClient(event);
    const { error: sessionError } = await useSessionExists(event, client, time);
	if (sessionError) return useReturnResponse(event, time, unauthorizedError);;

	const user = await serverSupabaseUser(event);
	if (!user) return useReturnResponse(event, time, internalServerError);

	const request = await useReadMultipartFormData(event);

	const { error: zodError } = await schema.safeParseAsync(request);
	if (zodError) return useReturnResponse(event, time, {
		...badRequestError,
		errors: {
			field: zodError.errors,
		}
	})

	request.files.forEach(async (file: FormDataItem) => {
		const imageId = crypto.randomUUID();
		let buffer: Buffer = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data);

		await sharp(buffer).rotate().webp({ quality: 10 }).toBuffer().then((data) => buffer = data)
		
		const { error: storageError } = await client.storage.from('images')
			.upload(`${id}/${user.id}/${imageId}.webp`, buffer, {
				contentType: "image/webp",
				cacheControl: '3600',
				upsert: true,
			});

		if (storageError) return useReturnResponse(event, time, internalServerError);
		
		const { error } = await client.from("posts").insert({
			url: `${id}/${user.id}/${imageId}.webp`,
			group_id: id
		})

		if (error) return useReturnResponse(event, time, internalServerError);
		
	})

	return useReturnResponse(event, time, {
		meta: {
			code: 200,
			message: "Data received",
			refresh: true
		},
	});
	
});
