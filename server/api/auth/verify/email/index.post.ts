import { generateFromEmail, generateUsername } from "unique-username-generator";

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

    const token = getCookie(event, "verify-token");

    if (!token) return useReturnResponse(event, {
        ...unauthorizedError,
        error: {
            type: "fields",
            details: {
                code: ["Verification token not found"],
            }
        }
    });

    const data: any = await useStorage("verify:token").getItem(token);

    if (!data) return useReturnResponse(event, {
        ...unauthorizedError,
        error: {
            type: "fields",
            details: {
                code: ["Verification token not found"],
            }
        }
    });

    if (data.token !== request.code) return useReturnResponse(event, {
        ...unauthorizedError,
        error: {
            type: "fields",
            details: {
                code: ["Invalid verification code"],
            }
        }
    });

    if (new Date(data.expires_at) < new Date()) return useReturnResponse(event, {
        ...unauthorizedError,
        error: {
            type: "fields",
            details: {
                code: ["Verification token has expired"],
            }
        }
    });

    const client = await serverSupabaseClient(event);

    const username = generateFromEmail(
        data.email,
        3
    );
    
    const { error: userError } = await client.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                name: username,
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

    const invite = getCookie(event, "invite_token");
    const session: Omit<Session, "user"> | null = await serverSupabaseSession(event);

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



