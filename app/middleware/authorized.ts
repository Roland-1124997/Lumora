export default defineNuxtRouteMiddleware( async (to, from) => {

    const store = useSessionsStore()
    const { data } = await store.getSession()
    
    if (data) return navigateTo("/")

})