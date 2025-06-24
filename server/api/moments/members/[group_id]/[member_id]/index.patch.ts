
export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id, member_id } = getRouterParams(event);

    const { error } = await client.from("members").update({ accepted: true}).eq("user_id", member_id).eq("group_id", group_id)
    if (error) return useReturnResponse(event, notFoundError)

    const { error: user_left_error } = await server.from("posts").update({ user_left: false }).eq("author_id", member_id).eq("group_id", group_id).select("*")
    if (user_left_error) return useReturnResponse(event, internalServerError)

    const { error: logError } = await server.from("logbook").insert({
        message: "Accepted :member: join request",
        performed_by_id: user.id,
        target_user_id: member_id,
        action_type: "created",
        group_id: group_id,
    })

    await server.from("notifications").insert({
        group_id: group_id,
        target_id: member_id,
        title: `Membership approved`,
        message: `You have been accepted into the group by a moderator`,
        type: "group",
    })

    await useSendNotification({
        title: "Membership approved",
        message: "Your request to join the group was accepted by a moderator.",
        target_id: member_id as string,
    }).catch(() => {
        console.error("Failed to send notification");
    });

    if (logError) return useReturnResponse(event, internalServerError)

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "Ok",
            code: 200
        },
    });
})
