export default defineEventHandler( async (event) => {
   
    const client = await serverSupabaseClient(event)
    const { credential } = await readBody(event)
    const { provider } = getRouterParams(event)

    const { error } = await client.auth.signInWithIdToken({
        provider: provider,
        token: credential,
    });

    if (error) return useReturnResponse(event, {
        ...badRequestError,
        error: {
            type: "auth",
            details: error,
        }
    })

    const invite = getCookie(event, "invite_token")
    const session: Omit<Session, "user"> | null = await serverSupabaseSession(event)

    deleteCookie(event, "invite_token")
    useSetCookies(event, session)

    return useReturnResponse(event, {
        status: {
            success: true,
            redirect: invite || "/",
            message: "Ok",
            code: 200
        }
    })
});
