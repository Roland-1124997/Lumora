export default defineNuxtRouteMiddleware(async (to, from) => {

    const store = useSessionsStore()

    if (from.path !== "/auth/totp") {
        const { data, error } = await useFetch('/api/user')
        store.setSession(data.value?.data, !!error.value)
    }

    const isRootOrAuth = (path: string) => path === "/" || path.startsWith("/auth")

    if (!isRootOrAuth(to.path) && !isRootOrAuth(from.path)) useCookie("redirect-page").value = to.path
    else useCookie("redirect-page").value = "/moments"

})