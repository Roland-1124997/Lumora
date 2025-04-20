export default defineNuxtRouteMiddleware(async (to, from) => {


    const store = useSessionsStore()
    const { error } = await store.getSession()
    if (error) {

        setTimeout(() => {
            const token = useCookie('invite_token')
            token.value = from.fullPath

            return navigateTo("/auth")

        }, 500)
    }

})