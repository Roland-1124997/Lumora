export function useRetryableFetch<T>(configuration: { maxAttempts?: number; delay?: number; throwOnError?: boolean } = {}) {
    const data = ref<T | null>(null);
    const error = ref<any | null>(null);
    const loading = ref(false);

    const { maxAttempts, delay, throwOnError } = { maxAttempts: 2, delay: 250, throwOnError: true, ...configuration };

    const fetchWithRetry = async (url: Parameters<typeof $fetch>[0], options: Parameters<typeof $fetch>[1] & { sessions?: boolean  }, attempts = 0): Promise<void> => {
        return await $fetch(url, options).then((response) => {data.value = response;}).catch((err) => {
            error.value = err;
            if (++attempts < maxAttempts) return new Promise((resolve) => setTimeout(resolve, delay)).then(() => fetchWithRetry(url, options, attempts));
            if (throwOnError) {
                if (!error.value.message.includes("aborted")) useThrowError(error)
            }
        });
    };

    const makeRequest = (url: Parameters<typeof $fetch>[0], options: Parameters<typeof $fetch>[1] & { sessions?: boolean } = { sessions: true }): Promise<void> => {
        loading.value = true;
        error.value = null;
        return fetchWithRetry(url, options).finally(() => {loading.value = false});
    };

    return {
        data,
        error,
        loading,
        makeRequest,
    };
}