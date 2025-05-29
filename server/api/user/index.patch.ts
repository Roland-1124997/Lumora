const schema = zod.object({
    username: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).min(6, { message: "Must be at be least 6 chars long" }).max(16, { message: "Must be at most 16 chars long" }),
    email: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).email({ message: "Must be a valid email" }),
})

export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);
    if (user.app_metadata.provider != "email") return useReturnResponse(event, unauthorizedError)

    /*
    ************************************************************************************
    */

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

    const { data, error} = await server.auth.admin.updateUserById(user.id, { 
        email: request.email,
        user_metadata: {
            name: request.username,
            email: request.email,
        } 
    })

    if(error) return useReturnResponse(event,internalServerError)

    /*
    ************************************************************************************
    */

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "success",
            code: 200
        },
        data: {
            id: user.id,
            name: data.user.user_metadata?.name || user.user_metadata.name,
            avatar: user.user_metadata.avatar || "/profile.jpg",
            email: data.user.email || user.user_metadata.email,
            provider: user.app_metadata.provider
        }
    });
})

