export default defineNuxtRouteMiddleware(async (to, from) => {

    const store = useSessionsStore()

    if (from.path != "/auth/totp") {
        const { data, error }: any = await useFetch('/api/user')
        store.setSession(data.value?.data, !!error.value)
    }

})