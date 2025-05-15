const schema = zod.object({
    code: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).min(6, { message: "Must be at least 6 characters long" }).max(6, { message: "Must be at most 6 characters long" }),
})

export default defineEventHandler(async (event) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const request = await readBody(event);
    const { error: zodError } = await schema.safeParseAsync(request);

    if (zodError) return useReturnResponse(event, {
        ...badRequestError,
        error: {
            type: "fields",
            details: zodError.errors
        }
    });

    const client = await serverSupabaseClient(event);
    const session_id = getCookie(event, "sb-mfa-token")

    if (!session_id) return useReturnResponse(event, {
        ...unauthorizedError,
        error: {
            type: "fields",
            details: {
                code: [ "Not enaled for this account" ],
            }
        }
    });

    const { data: factors, error: factorError } = await client.auth.mfa.listFactors()
    if (factorError) return useReturnResponse(event, internalServerError)

    const { error } = await client.auth.mfa.challengeAndVerify({
        factorId: factors.all[0].id,
        code: request.code
    })

    if (error) return useReturnResponse(event, {
        ...unauthorizedError,
        error: {
            type: "fields",
            details: {
                code: [error?.message],
            }
        }
    });

    /*
    ************************************************************************************
    */

    const invite = getCookie(event, "invite_token");
    const session: Omit<Session, "user"> | null = await serverSupabaseSession(event);

    deleteCookie(event, "sb-mfa-token");
    deleteCookie(event, "invite_token");
    useSetCookies(event, session);

    return useReturnResponse(event, {
        status: {
            success: true,
            redirect: invite || "/",
            message: "Ok",
            code: 200
        }
    });

})



