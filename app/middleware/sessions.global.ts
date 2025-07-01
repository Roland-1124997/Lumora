export default defineNuxtRouteMiddleware(async (to, from) => {

    const store = useSessionsStore()
    const client = import.meta.client

    if (from.path !== "/auth/totp") {
        const { data, error } = await useFetch('/api/user')
        store.setSession(data.value?.data, !!error.value)
    }

    const isAuth = (path: string) => path.startsWith("/auth")
    const isRoot = (path: string) => path === "/"

    if (client) {
        
        const redirectCookie = useCookie("redirect-page", {
            maxAge: 60 * 60 * 24 * 1,
        })

        if (!isRoot(to.path) && !isAuth(to.path)) redirectCookie.value = to.path
        else if (isAuth(to.path)) redirectCookie.value = undefined
    }

})