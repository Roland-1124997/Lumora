const schema = zod.object({
    New_password: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).min(8, { message: "Must be at least 8 characters long" }),
    Confirm_password: zod.string({ message: "This field is required" })
})

.refine((data) => data.New_password === data.Confirm_password, {
    message: "Passwords do not match",
    path: ["Confirm_password"],
})

export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);
    if (user.app_metadata.provider != "email") return useReturnResponse(event, unauthorizedError)


    const request = await readBody(event);
    const { error: zodError } = await schema.safeParseAsync(request);

    if (zodError) return useReturnResponse(event, {
        ...badRequestError,
        error: {
            type: "fields",
            details: zodError.errors
        }
    });

    await server.auth.admin.updateUserById(user.id, { 
        password: request.New_password 
    });

    /*
    ************************************************************************************
    */

    await useDeleteCookies(event)

    return useReturnResponse(event, {
        status: {
            success: true,
            redirect: "/auth",
            message: "success",
            code: 200
        },
    });
})

