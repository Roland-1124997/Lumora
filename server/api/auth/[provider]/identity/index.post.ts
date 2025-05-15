export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const { credential } = await readBody(event)
    const { provider } = getRouterParams(event)

    /*
    ************************************************************************************
    */

    const { data, error } = await client.auth.signInWithIdToken({
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

    if (data.user.factors) {

        const session: Omit<Session, "user"> | null = await serverSupabaseSession(event);
        useSetCookies(event, session);

        const session_id = crypto.randomUUID()

        setCookie(event, "sb-mfa-token", session_id, {
            maxAge: 60 * 10, // Cookie valid for 10 minutes
            httpOnly: true,
        });

        return useReturnResponse(event, {
            status: {
                success: true,
                redirect: "/auth/totp",
                message: "Ok",
                code: 200
            }
        });
    }

    /*
    ************************************************************************************
    */

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
