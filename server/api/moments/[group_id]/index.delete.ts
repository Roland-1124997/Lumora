import { serverSupabaseClient, serverSupabaseServiceRole, } from "#supabase/server";

export default defineEventHandler(async (event) => {

	const { group_id } = getRouterParams(event);
    const client = await serverSupabaseClient(event);

    const { data: user, error: sessionError } = await useSessionExists(event, client);
	if (sessionError) return useReturnResponse(event, unauthorizedError);;

	const { error } = await client.from("groups").delete().eq("id", group_id)

	if(error) return useReturnResponse(event, internalServerError)

	return useReturnResponse(event, {
		status: {
			success: true,
			redirect: "/moments",
			message: "Ok",
			code: 200
		}
	});
});