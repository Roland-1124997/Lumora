export default defineEventHandler(async (event) => {

    const client = await serverSupabaseClient(event)
    const server = serverSupabaseServiceRole(event)

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

        await server.from("factor_sessions").insert({
            user_id: data.user.id,
        })

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
