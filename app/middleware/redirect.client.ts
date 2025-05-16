export default defineNuxtRouteMiddleware(async (to, from) => {

    const store = useSessionsStore()
    const { data, error } = await store.getSession()

    if (error) return navigateTo("/auth")
    if (data && data.mfa_needs_to_verfied) return navigateTo("/auth/totp")

    else return navigateTo("/moments")
    
})