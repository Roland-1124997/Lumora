export default defineNuxtRouteMiddleware(async (to, from) => {

    const store = useSessionsStore()

    const { data, error }: any = await useFetch('/api/sessions')
    store.setSession(data.value?.user, !!error.value)

})