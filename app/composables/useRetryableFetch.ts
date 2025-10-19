
export function useRetryableFetch(configuration: { maxAttempts?: number; delay?: number; throwOnError?: boolean } = {}) {
    const { maxAttempts, delay, throwOnError } = {
        maxAttempts: 2,
        delay: 250,
        throwOnError: true,
        ...configuration,
    };

    const getCsrf = () => {
        
        const cookie = useCookie<string | undefined>("csrf-token") || undefined;
        return cookie.value;
        
    };

    const setCsrf = (token?: string | null) => {
        if (!token) return;
        const cookie = useCookie<string | undefined>("csrf-token");
        cookie.value = token;
    };

    const fetchWithRetry = async <T>(
        url: Parameters<typeof $fetch>[0],
        options: Parameters<typeof $fetch>[1] & { sessions?: boolean },
        attempts = 0
    ): Promise<ApiResponse<T>> => {
        const headers: Record<string, string> = {
            ...(options?.headers as Record<string, string> | undefined),
        };

        const currentToken = getCsrf();
        if (currentToken) headers["x-csrf-token"] = currentToken;

        const userOnResponse = (options)?.onResponse as ((context: any) => void) | undefined;
        
        const withHeaders = {
            ...options, headers,
            onResponse: (context: any) => {

                
                const headerToken = context.response?.headers?.get?.("x-csrf-token");
                setCsrf(headerToken);
                
                if (typeof userOnResponse === "function") userOnResponse(context);
            },
        };

        return $fetch<ApiResponse<T>>(url, withHeaders)
            
        .then((response) => {
                const maybeNew = (response as any)?.data?.token;
                setCsrf(maybeNew);
                return response;
            })
            
            .catch((error: ErrorResponse) => {
                if (++attempts < maxAttempts) {
                    return new Promise<ApiResponse<T>>((resolve) =>
                        setTimeout(resolve, delay)
                    ).then(() => fetchWithRetry<T>(url, withHeaders, attempts));
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
