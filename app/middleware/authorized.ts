export default defineNuxtRouteMiddleware( async (to, from) => {

    const store = useSessionsStore()
    const { data } = await store.getSession()

    if (data && !data.mfa_needs_to_verfied) return navigateTo("/moments")
    if (data && data.mfa_needs_to_verfied) return navigateTo("/auth/totp")

})