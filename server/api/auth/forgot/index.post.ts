import * as zod from "zod";

const schema = zod.object({
    email: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).email({ message: "Must be a valid email" }),
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

    const exists = !data.users.find((user) => user.user_metadata.email.toLowerCase() === request.email.toLowerCase());

    if (exists) return useReturnResponse(event, {
        ...unauthorizedError,
        error: {
            type: "fields",
            details: {
                email: ["Email does not exist"],
            }
        }
    });

    const session = crypto.randomUUID();
    const token = Array.from(crypto.getRandomValues(new Uint8Array(6)))
        .map((n) => (n % 10).toString())
        .join('');

    await useStorage("verify:reset:token").setItem(session, {
        email: request.email,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 20 * 60 * 1000).toISOString(), // 20 minutes
        token: token
    });

    setTimeout(async () => {
        await useStorage("verify:reset:token").removeItem(session);
    }, 20 * 60 * 1000);

    setCookie(event, "verify-reset-token", session, {
        maxAge: 20 * 60,
        httpOnly: true,
    });

    const html = await renderEmailComponent("ResetPasswordEmail", {
        token: token,   
    });

    const { error } = await useMailer({
         recepient: request.email,
         subject: "Password reset verification required",
         body: html
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
