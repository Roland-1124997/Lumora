
const schema = zod.object({
    code: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).min(6, { message: "Must be at least 6 characters long" }).max(6, { message: "Must be at most 6 characters long" }),
})

export default defineEventHandler(async (event) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const token = getCookie(event, "verify-token");
    const resetToken = getCookie(event, "verify-reset-token");
    
    let reset = false;
    const request = await readBody(event);
    const { error: zodError } = await schema.safeParseAsync(request);

    if (zodError) return useReturnResponse(event, {
        ...badRequestError,
        error: {
            type: "fields",
            details: zodError.errors
        }
    });

    if (!token && !resetToken) return useReturnResponse(event, {
        ...unauthorizedError,
        error: {
            type: "fields",
            details: {
                code: ["Verification token not found"],
            }
        }
    });

    let storage: any = null;
    if (token) storage = await useStorage("verify:token").getItem(token);
    else if (resetToken) storage = await useStorage("verify:reset:token").getItem(resetToken);

    if (!storage) return useReturnResponse(event, {
        ...unauthorizedError,
        error: {
            type: "fields",
            details: {
                code: ["Verification token not found"],
            }
        }
    });

    if (storage.token !== request.code) return useReturnResponse(event, {
        ...unauthorizedError,
        error: {
            type: "fields",
            details: {
                code: ["Invalid verification code"],
            }
        }
    });

    if (new Date(storage.expires_at) < new Date()) return useReturnResponse(event, {
        ...unauthorizedError,
        error: {
            type: "fields",
            details: {
                code: ["Verification token has expired"],
            }
        }
    });

    if(token) {
        const client = await serverSupabaseClient(event);

        let name = storage.name
        if (!storage.name) name = useEmailToName().process(storage.email)

        const { error: userError } = await client.auth.signUp({
            email: storage.email,
            password: storage.password,
            options: {
                data: {
                    name: name,
                },
            }
        });

        if (userError) return useReturnResponse(event, {
            ...unauthorizedError,
            error: {
                type: "fields",
                details: {
                    code: [userError.message],
                }
            }
        });
    }

    if (resetToken) {

        const { data } = await useListUsers(serverSupabaseServiceRole(event))
        const user = data.users.find((user) => user.user_metadata.email.toLowerCase() === storage.email.toLowerCase())

        const token = crypto.randomUUID();
        reset = true;

        await useStorage("verified:email:token").setItem(token, {
            id: user?.id,
            email: storage.email,
        });

        setCookie(event, "verified-email-token", token, {
            maxAge: 60 * 60 * 24 * 30, // 30
            httpOnly: true,
        });
    }

    if (token) await useStorage("verify:token").removeItem(token);
    if (resetToken) await useStorage("verify:reset:token").removeItem(resetToken);
    
    const invite = getCookie(event, "invite_token");
    const session: Omit<Session, "user"> | null = await serverSupabaseSession(event);

    deleteCookie(event, "verify-token");
    deleteCookie(event, "verify-reset-token");
    deleteCookie(event, "invite_token");
    useSetCookies(event, session);

    return useReturnResponse(event, {
        status: {
            success: true,
            redirect: reset ? '/auth/reset-password' : invite || "/",
            message: "Ok",
            code: 200
        }
    });

})



