import { serverSupabaseClient, serverSupabaseSession } from "#supabase/server";

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
        errors: {
            auth: error,
        }
    })

    const session: Omit<Session, "user"> | null = await serverSupabaseSession(event)
    useSetCookies(event, session)

    return useReturnResponse(event, time, {
        meta: {
            code: 200,
            message: "OK",
            redirect: "/",
        },
    })
});
