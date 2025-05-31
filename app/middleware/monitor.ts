export default defineNuxtRouteMiddleware( async(to, from) => {

    const store = useSessionsStore()
    const { data, error } = await store.getSession()

    if(data && !data.team) return useRouter().back()

    if (data && data.mfa_needs_to_verfied) return navigateTo("/auth/totp")
    if(error) return navigateTo("/auth")

})