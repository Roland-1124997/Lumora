export default defineNuxtRouteMiddleware(async (to, from) => {
    
    const slug = to.params.slug
    const id = to.query.id

    const { error } = await useFetch(`/api/moments/${id}?slug=${slug}`)
    if (error.value?.data.meta.code == 403)return navigateTo("/moments")
        
})