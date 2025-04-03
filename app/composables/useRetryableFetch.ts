
export function useRetryableFetch<T>( maxAttempts: number = 3, retryDelay: number = 250) {
    const data = ref<T | null>(null);
    const error = ref<any>(null);
    const loading = ref(false);
    const { addToast } = useToast();
    
    const makeRequest = async (url: string, options: Record<string, any> = {}): Promise<void> => {
        let attempts = 0;
        loading.value = true;
        error.value = null;

        const fetchWithRetry = async (url: string, options: Record<string, any>): Promise<void> => {
            return await $fetch(url, options).then((response) => {data.value = response}).catch((err) => {
                error.value = err;
                attempts++;

                if (attempts < maxAttempts) return new Promise((resolve) => setTimeout(resolve, retryDelay)).then( async () => await fetchWithRetry(url, options)); 
                
                setTimeout(() => {
                    addToast({
                        message: `Failed to fetch data after ${maxAttempts} attempts.`,
                        type: "error",
                        duration: 5000,
                    });
                }, 100);

                throw createError({
                    statusCode: error.value.data?.status?.code || 500,
                    message: error.value.data?.status?.message || "An unknown error occurred",
                    fatal: true,
                });
            });
        };

        return await fetchWithRetry(url, options).finally(() => loading.value = false);
    };

    return {
        data,
        error,
        loading,
        makeRequest,
    };
}