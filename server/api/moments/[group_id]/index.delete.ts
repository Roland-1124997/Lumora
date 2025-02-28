import { serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const time = Date.now();

	const { group_id } = getRouterParams(event);
    const client = await serverSupabaseClient(event);

    const { error: sessionError } = await useSessionExists(event, client, time);
	if (sessionError) return useReturnResponse(event, time, unauthorizedError);;

	const user = await serverSupabaseUser(event);
	if (!user) return useReturnResponse(event, time, internalServerError);

	const { error } = await client.from("groups").delete().eq("id", group_id)
	if(error) return useReturnResponse(event, time, internalServerError)

	return useReturnResponse(event, time, {
		meta: {
			code: 200,
			message: "Data received",
		},
	});
});