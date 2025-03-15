export default defineNuxtRouteMiddleware(async (to, from) => {

    const store = useSessionsStore()

    const { data, error }: any = await useFetch('/api/user')
    store.setSession(data.value?.data, !!error.value)

})