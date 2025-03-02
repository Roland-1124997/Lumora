import { serverSupabaseClient, } from "#supabase/server";

export default defineEventHandler(async (event) => {
    
    const { group_id, user_id, image_id } = getRouterParams(event)

    const client = await serverSupabaseClient(event);
        
    const { error: sessionError } = await useSessionExists(event, client );
    if (sessionError) return useReturnResponse(event, unauthorizedError)
    
    const filePath = client.storage.from("images").getPublicUrl(`${group_id}/${user_id}/${image_id}`).data.publicUrl

    const response = await fetch(filePath) 
    const imageBuffer = await response.arrayBuffer()

    setHeaders(event, {
        'Content-Type': response.headers.get('Content-Type') || 'image/webp',
        'Cache-Control': 'public, max-age=3600',
    })

    return new Response(imageBuffer)

});

