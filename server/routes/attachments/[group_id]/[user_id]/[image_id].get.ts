
export default defineSupabaseEventHandler(async(event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);
    
    const { group_id, user_id, image_id } = getRouterParams(event)

    const { error: permisionError } = await client.from("members").select("*").eq("user_id", user.id).eq("group_id", group_id).single()
    if (permisionError) return useReturnResponse(event, unauthorizedError)
    
    const filePath = client.storage.from("images").getPublicUrl(`${group_id}/${user_id}/${image_id}`).data.publicUrl

    const response = await fetch(filePath) 
    const imageBuffer = await response.arrayBuffer()

    setHeaders(event, {
        'Content-Type': response.headers.get('Content-Type') || 'image/webp',
        'Cache-Control': 'public, max-age=86400',
    })

    return new Response(imageBuffer)

});

