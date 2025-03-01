import { serverSupabaseClient, serverSupabaseUser, serverSupabaseServiceRole } from "#supabase/server";
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
	
	const { group_id } = getRouterParams(event);

	const client: SupabaseClient = await serverSupabaseClient(event);
	const server: SupabaseClient = serverSupabaseServiceRole(event)
    
	const { error: sessionError } = await useSessionExists(event, client);
	if (sessionError) return useReturnResponse(event, unauthorizedError);;

	const user = await serverSupabaseUser(event);
	if (!user) return useReturnResponse(event, internalServerError);

	const request = await useReadMultipartFormData(event);

	const { error: zodError } = await schema.safeParseAsync(request);
	if (zodError) return useReturnResponse(event, {
		...badRequestError,
		error: {
			type: "fields",
			details: zodError.errors
		}
	})

	let post: any = []
	for (const file of request.files) {
		const imageId = crypto.randomUUID();
		let buffer: Buffer = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data);

		await sharp(buffer).rotate().webp({ quality: 10 }).toBuffer().then((data) => buffer = data);

		const { error: storageError } = await client.storage.from('images')
			.upload(`${group_id}/${user.id}/${imageId}.webp`, buffer, {
				contentType: "image/webp",
				cacheControl: '3600',
				upsert: true,
			});

		if (storageError) return useReturnResponse(event, internalServerError);

		const { data, error } = await client.from("posts").insert({
			url: `${group_id}/${user.id}/${imageId}.webp`,
			group_id: group_id
		}).select().single()

		if (error) return useReturnResponse(event, internalServerError);
		post.push(data); 
	}

	const { error: errorGroup } = await server.from("groups").update({
		last_active: new Date(Date.now() + (process.env.time ? parseInt(process.env.time) : 0)).toISOString(),
		last_photo_posted_by: user.id
	}).eq("id", group_id)

	if (errorGroup) return useReturnResponse(event, internalServerError)

	const updated = await Promise.all(post.map(async (posts: any) => {
		return {
			id: posts.id,
			created_at: posts.created_at,
			media: {
				type: "image",
				url: client.storage.from("images").getPublicUrl(posts.url).data.publicUrl,
			},
			likes: {
				count: posts.likes,
			},
			has_liked: false,
			author: {
				name: user.user_metadata.name,
				is_owner: posts.author_id == user.id,
			}
		};
	}));

	return useReturnResponse(event, {
		status: {
			success: true,
			refresh: true,
			message: "Ok",
			code: 200
		},
		meta: {
			id: post[0].group_id,
		},
		data: updated
	});
	
});
