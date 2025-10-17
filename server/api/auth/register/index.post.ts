import * as zod from "zod";

const schema = zod.object({
    name: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).min(3, { message: "Must be at be least 3 chars long" }).max(16, { message: "Must be at most 16 chars long" }),
    email: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).email({ message: "Must be a valid email" }),
    password: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).min(8, { message: "Must be at least 8 characters long" }),
    confirmation: zod.string({ message: "This field is required" }),
})
.refine((data) => data.password === data.confirmation, {
    message: "Passwords do not match",
    path: ["confirmation"],
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

    /*
    ************************************************************************************
    */


    const { data } = await useListUsers(serverSupabaseServiceRole(event))

    const exists = !!data.users.find((user) => user.user_metadata.email.toLowerCase() === request.email.toLowerCase())

    if (exists) return useReturnResponse(event, {
        ...unauthorizedError,
        error: {
            type: "fields",
            details: {
                email: ["Email already exists"],
            }
        }
    });

    if (request.password !== request.confirmation) return useReturnResponse(event, {
        ...badRequestError,
        error: {
            type: "fields",
            details: {
                password: ["Passwords do not match"],
                confirmation: ["Passwords do not match"]
            }
        }
    });

    const session = crypto.randomUUID();
    const token = Array.from(crypto.getRandomValues(new Uint8Array(6)))
        .map((n) => (n % 10).toString())
        .join('');

    await useStorage("verify:token").setItem(session, {
        email: request.email,
        password: request.password,
        name: request.name || null,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 20 * 60 * 1000).toISOString(), // 20 minutes
        token: token
    });

    setTimeout(async () => {
        await useStorage("verify:token").removeItem(session);
    }, 20 * 60 * 1000);

    setCookie(event, "verify-token", session, {
        maxAge: 20 * 60,
        httpOnly: true,
    });

    const html = await renderEmailComponent("VerifyAccountEmail", {
        token: token,
    });

    const { error } = await useMailer({
        recepient: request.email,
        subject: "Account verification required",
        body: html,
    });

    if (error) {
        return useReturnResponse(event, {
            ...internalServerError,
            error: {
                type: "fields",
                details: {
                    email: ["Failed to send verification email"]
                }
            }
        });
    }

    return useReturnResponse(event, {
        status: {
            success: true,
            redirect: "/auth/verify-email",
            message: "Ok",
            code: 200
        }
    });
});
