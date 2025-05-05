import { create } from "domain";

export default defineSupabaseEventHandler(async (event, user, client, server) => {

	if (!user) return useReturnResponse(event, unauthorizedError);

	const { group_id, image_id } = getRouterParams(event);

	const request = await readBody(event)

	/*
	************************************************************************************
	*/

	const { data, error } = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).single<Tables<'members'>>()
	if (error) return useReturnResponse(event, notFoundError);

	const { data: settings, error: settingError } = await client.from("group_settings").select("*").eq("group_id", group_id).single<Tables<'group_settings'>>()
	if (settingError) return useReturnResponse(event, internalServerError)

	if (settings.owner_id != user.id && !data.can_edit_group) return useReturnResponse(event, forbiddenError)

	/*
	************************************************************************************
	*/

	const { data: postData, error: postError } = await server.from("posts").select("*").eq("id", image_id).select().single<Tables<"posts">>()
	if (postError) return useReturnResponse(event, internalServerError);

	if (!request.has_been_accepted) {
		await client.from('posts').delete().eq('id', image_id)

		await server.from("groups").update({
			last_photo_posted_by: null,
			last_action: "Rejected"
		}).eq("id", group_id)
	} 
	
	else {
		const { data: updateData, error: updateError } = await server.from("posts").update({ Accepted: true }).eq("id", image_id).select().single<Tables<"posts">>()
		if (updateError) return useReturnResponse(event, internalServerError);

		await server.rpc('accept_post', { p_id: image_id });
		await server.from("groups").update({
			last_photo_posted_by: updateData.author_id,
			last_action: "Approved"
		}).eq("id", group_id)
	}

	const { error: logError } = await server.from("logbook").insert({
		message: request.has_been_accepted ? 'Approved :member: photo' : 'Rejected :member: photo',
		performed_by_id: user.id,
		target_user_id: postData.author_id,
		action_type: request.has_been_accepted ? "created" : "deleted",
		group_id: group_id,
		context: {
			type: "image",
		}
	})

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
		},
		
	});
})

