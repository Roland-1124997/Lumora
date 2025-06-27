
const schema = zod.object({
    password: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).min(8, { message: "Must be at least 8 characters long" }),
    confirmation: zod.string({ message: "This field is required" }),
})
.refine((data) => data.password === data.confirmation, {
    message: "Passwords do not match",
    path: ["confirmation"],
})

export default defineEventHandler(async (event) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const token = getCookie(event, "verified-email-token");
    
    const request = await readBody(event);
    const { error: zodError } = await schema.safeParseAsync(request);

    if (zodError) return useReturnResponse(event, {
        ...badRequestError,
        error: {
            type: "fields",
            details: zodError.errors
        }
    });

    if (!token) return useReturnResponse(event, {
        ...unauthorizedError,
        error: {
            type: "fields",
            details: {
                code: ["Verification token not found"],
            }
        }
    });

    const storage: any = await useStorage("verified:email:token").getItem(token);
    
    if (!storage) return useReturnResponse(event, {
        ...unauthorizedError,
        error: {
            type: "fields",
            details: {
                code: ["Verification token not found"],
            }
        }
    });

    const server = serverSupabaseServiceRole(event);

    const { error } = await server.auth.admin.updateUserById(storage.id, {
        password: request.password,
    })

    if (error) return useReturnResponse(event, {
        ...internalServerError,
        error: {
            type: "fields",
            details: {
                code: [error.message],
            }
        }
    });

    deleteCookie(event, "verified-email-token");
    await useStorage("verify:token").removeItem(token);

    return useReturnResponse(event, {
        status: {
            success: true,
            redirect: "/",
            message: "Ok",
            code: 200
        }
    });

})



