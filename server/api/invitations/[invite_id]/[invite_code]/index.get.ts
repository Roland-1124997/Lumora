
export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { invite_id, invite_code } = getRouterParams(event);
    const { data, error } = await client.from("invite_links").select("*").eq("id", invite_id).eq("code", invite_code).single<Tables<"invite_links">>()

    if (error) return useReturnResponse(event, notFoundError)

    if (data.expiresAt && new Date() > new Date(data.expiresAt)) return useReturnResponse(event, ResourceGoneError);
    if (data.uses == 0) return useReturnResponse(event, ResourceGoneError)

    /*
    ************************************************************************************
    */

    const { data: settings, error: settingError } = await client.from("group_settings").select("*").eq("group_id", data.group_id).single<Tables<"group_settings">>()
    if (settingError) return useReturnResponse(event, internalServerError)

    const { error: memberError } = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", data.group_id).single<Tables<"members">>()

    const { data: group } = await server.from("groups").select("*").eq("id", data.group_id).single<Tables<"groups">>()
    const { count: groupCount } = await server.from("members").select("*", { count: "exact" }).eq("group_id", data.group_id)

    if (memberError?.details?.includes("0 rows")) {
        
        return useReturnResponse(event, {
            status: {
                success: true,
                joined: false,
                redirect: `/moments/${data.group_id}`,
                message: "Ok",
                code: 200
            },
            data: {
                details: {
                    name: group?.name,
                    members: groupCount,
                    auto_accept: settings.auto_accept_new_members
                }
            }
        });
    }

    /*
    ************************************************************************************
    */
    
    return useReturnResponse(event, {
        status: {
            success: true,
            joined: true,
            redirect: `/moments/${data.group_id}`,
            message: "Ok",
            code: 200
        },
        data: {
            details: {
                name: group?.name,
                members: groupCount,
                auto_accept: settings.auto_accept_new_members
            }
        }
    });
})
