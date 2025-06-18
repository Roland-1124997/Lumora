
export function useRetryableFetch(configuration: { maxAttempts?: number; delay?: number; throwOnError?: boolean } = {}) {
    const { maxAttempts, delay, throwOnError } = {
        maxAttempts: 2,
        delay: 250,
        throwOnError: true,
        ...configuration,
    };

    const fetchWithRetry = async <T>(
        url: Parameters<typeof $fetch>[0],
        options: Parameters<typeof $fetch>[1] & { sessions?: boolean },
        attempts = 0
    ): Promise<ApiResponse<T>> => {
        return $fetch<ApiResponse<T>>(url, options).catch((error: any) => {
            if (++attempts < maxAttempts) {
                return new Promise<ApiResponse<T>>((resolve) =>
                    setTimeout(resolve, delay)
                ).then(() => fetchWithRetry<T>(url, options, attempts));
            }
            
            return Promise.reject(error);
        });
    };

    const makeRequest = async <T>(
        url: Parameters<typeof $fetch>[0],
        options: Parameters<typeof $fetch>[1] & { sessions?: boolean } = { sessions: true }
    ) => {
        const data = ref<ApiResponse<T> | null>(null);
        const error = ref<any | null>(null);

        await fetchWithRetry<T>(url, options)
            .then((response) => data.value = response)
            .catch((err) => {
                error.value = err
                if (throwOnError && !error.value.message?.includes("aborted")) useThrowError(error)
            });

        return { data, error };
    };

    return {
        makeRequest,
    };
}
