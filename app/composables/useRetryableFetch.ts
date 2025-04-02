
export function useRetryableFetch<T>( maxAttempts: number = 3, retryDelay: number = 250) {
    const data = ref<T | null>(null);
    const error = ref<any>(null);
    const loading = ref(false);

    const makeRequest = async (url: string, options: Record<string, any> = {}): Promise<void> => {
        let attempts = 0;
        loading.value = true;
        error.value = null;

        const fetchWithRetry = (url: string, options: Record<string, any>): Promise<void> => {
            return $fetch(url, options).then((response) => {data.value = response}).catch((err) => {
                error.value = err;
                attempts++;

                if (attempts < maxAttempts) return new Promise((resolve) => setTimeout(resolve, retryDelay)).then(() => fetchWithRetry(url, options)); 
                
                throw createError({
                    statusCode: error.value.data?.status?.code || 500,
                    message: error.value.data?.status?.message || "An unknown error occurred",
                    fatal: true,
                });
                
            });
        };

        return fetchWithRetry(url, options).finally(() => loading.value = false);
    };

    return {
        data,
        error,
        loading,
        makeRequest,
    };
}