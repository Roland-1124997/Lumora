
export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { user_id } = getRouterParams(event)
    const { data }: any =  await server.auth.admin.getUserById(user_id)

    const response = await fetch(`https://api.dicebear.com/9.x/initials/svg?seed=${data.user.user_metadata.name || user_id}`)
    const imageBuffer = await response.arrayBuffer()

    setHeaders(event, {
        'Content-Type': response.headers.get('Content-Type') || 'image/webp',
        'Cache-Control': 'public, max-age=300',
    })

    return new Response(imageBuffer)

});

