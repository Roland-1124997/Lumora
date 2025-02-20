import { serverSupabaseClient, serverSupabaseUser, serverSupabaseSession } from "#supabase/server";

export default defineEventHandler( async (event) => {
    const time = Date.now();

    const client = await serverSupabaseClient(event)
    const { credential } = await readBody(event)
    const { provider } = getRouterParams(event)

    const { error } = await client.auth.signInWithIdToken({
        provider: provider,
        token: credential,
    });

    if (error) return useReturnResponse(event, time, {
        ...badRequestError,
        errors: error.message,
    })

    const session: any = await serverSupabaseSession(event)
    useSetCookies(event, session)

    return useReturnResponse(event, time, {
        meta: {
            code: 200,
            message: "OK",
            redirect: "/",
        },
    })
});
