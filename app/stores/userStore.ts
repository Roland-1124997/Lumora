

export const useSessionsStore = defineStore("session", () => {
    const session: any = ref({
        data: null,
        error: true,
    })

    const setSession = (data: any, error: any) => session.value = { data, error }
    const { makeRequest } = useRetryableFetch({ throwOnError: false })

    const clearSession = () =>{ 
        session.value = { data: null, error: null }
        sessionStorage.clear()
    }

    const getSession = async () => {

        if (session.value) return session.value

        const { data, error } = await makeRequest<User>('/api/user')

        if (data.value) session.value = { data: data.value.data, error: null }
        if (error.value) session.value = { data: null, error }

        return session.value

    }

    return {
        setSession,
        getSession,
        clearSession,
    };
});