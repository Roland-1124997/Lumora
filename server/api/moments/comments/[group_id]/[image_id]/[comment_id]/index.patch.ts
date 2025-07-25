
const schema = zod.object({
    comment: zod.string({ message: "This field is required" }).min(1, "This field is required").max(500, "Message must be less than 500 characters")
});

export default defineSupabaseEventHandler(async (event, user, client, server) => {
    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, image_id, comment_id } = getRouterParams(event);

    const { error: memberError } = await client.from("members").select("*").eq("group_id", group_id).eq("user_id", user.id).eq("accepted", true).single<Tables<"members">>()
    if (memberError) return useReturnResponse(event, forbiddenError);

    const { data: settings, error: settingsError } = await server.from("group_settings").select("*").eq("group_id", group_id).single<Tables<"group_settings">>()
    if ((settings && !settings.social_interactions) || settingsError) return useReturnResponse(event, forbiddenError)

    const request = await readBody(event);

    const { error: zodError } = await schema.safeParseAsync(request);

    if (zodError) return useReturnResponse(event, {
        ...badRequestError,
        error: {
            type: "fields",
            details: zodError.errors
        }
    })
    
    const { data: comment, error: commentError } = await client.from("posts_comments").select("*").eq("id", comment_id).eq("group_id", group_id).single<Tables<"posts_comments">>();

    if (commentError) return useReturnResponse(event, forbiddenError);
    if (comment.author_id != user.id || comment.content == "This comment has been deleted") return useReturnResponse(event, forbiddenError)

    const { data, error } = await client.from("posts_comments").update({
        content: request.comment
    }).eq("id", comment_id).select().single<Tables<"posts_comments">>();

    if (error) return useReturnResponse(event, internalServerError);

    const { error: logError } = await server.from("logbook").insert({
        message: `Edited a comment on image`,
        performed_by_id: user.id,
        action_type: "updated",
        group_id: group_id,
        context: {
            id: `${data.id.split("-")[0]}-${user.id.split("-")[4]}`,
            "new content": request.comment,
            "old content": comment.content
        }
    });

    if (logError) return useReturnResponse(event, internalServerError);

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "success",
            code: 200
        }
    })
});


//api/moments/comments/26b165bf-6d57-4801-8024-23c13eac084c/931641ad-3b54-4fcf-b07c-3e869e0d2135/97b50c09-7b28-4894-abf9-a564adfe820f
//api/moments/comments/26b165bf-6d57-4801-8024-23c13eac084c/931641ad-3b54-4fcf-b07c-3e869e0d2135/97b50c09-7b28-4894-abf9-a564adfe820f