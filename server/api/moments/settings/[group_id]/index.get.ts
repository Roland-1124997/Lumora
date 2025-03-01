import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
    
    const { group_id } = getRouterParams(event);
    const client: SupabaseClient = await serverSupabaseClient(event);
    
    const { data: user, error: sessionError }: Record<string, any> = await useSessionExists(event, client);
    if (sessionError) return useReturnResponse(event, unauthorizedError);

    const { data, error } = await client.from("groups").select("*").eq("id", group_id).single()
    if (error) return useReturnResponse(event, notFoundError);
    
    
    return useReturnResponse(event, {
        status: {
            success: true,
            message: "Data received",
            code: 200
        },
        
        data: {
            id: data.id,
            name: data.name,
            description: data.description,
            last_active: data.last_active,
            permision: {
                delete: data.owner_id == user.id
            },
            media: {
                type: "image",
                url: client.storage.from("images").getPublicUrl(data.thumbnail).data.publicUrl,
            }
        }
    });
});
