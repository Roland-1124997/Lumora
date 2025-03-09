export default defineEventHandler(async (event) => {
    
    const { image_id } = getRouterParams(event)

    const client = await serverSupabaseClient(event);
    const server: SupabaseClient = serverSupabaseServiceRole(event);

    const { error: sessionError } = await useSessionExists(event, client);
    if (sessionError) return useReturnResponse(event, unauthorizedError);

    const user = await serverSupabaseUser(event);
    if (!user) return useReturnResponse(event, internalServerError);

    const { data, error }: any = await server.rpc('toggle_like', { liked_post_id: image_id, liked_user_id: user.id }).single()
    if (error) return useReturnResponse(event, internalServerError);

    return useReturnResponse(event, {
        status: {
            success: true,
            message: "Ok",
            code: 200
        },
        data: {
            has_liked: data.is_liked,
            likes: {
                count: data.likes_count,
            }
        }

    });
});

// id: posts.id,
//     created_at: posts.created_at,
//         has_liked: data ? data.user_id === user.id : false,
//             author: {
//     name: userData.user?.user_metadata.name,
//         is_owner: posts.author_id == user.id,
// 			},
// likes: {
//     count: posts.likes,
// 			},
// media: {
//     type: "image",
//         url: client.storage.from("images").getPublicUrl(posts.url).data.publicUrl,
// 			},