

export const useSessionsStore = defineStore("session", () => {
    const session: any = ref({
        data: null,
        error: true,
    })

    const setSession = (data: any, error: any) => session.value = { data, error }

    const clearSession = () =>{ 
        session.value = { data: null, error: null }
        sessionStorage.clear()
    }

    const getSession = async () => {

        if (session.value) return session.value

        await $fetch('/api/sessions').then((data: any) => {
            session.value = { data: data.user, error: null }
        }).catch(error => {
            session.value = { data: null, error }
        })

        return session.value

    }

    return {
        setSession,
        getSession,
        clearSession,
    };
});