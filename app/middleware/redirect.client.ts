export default defineNuxtRouteMiddleware(async (to, from) => {

    const store = useSessionsStore()
    const { data, error } = await store.getSession()

    const page = useCookie("redirect-page", {
        default: () => "/moments"
    })

    if (error) return navigateTo("/auth")
    if (data?.mfa_needs_to_verfied) return navigateTo("/auth/totp")
    else return navigateTo(page.value)
})