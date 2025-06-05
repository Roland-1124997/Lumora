type FetchUrl = Parameters<typeof $fetch>[0];
type FetchOptions = Parameters<typeof $fetch>[1];

interface Config<T> {
    baseURL: FetchUrl;
    options?: FetchOptions;
    onSuccess: ({ response }: SuccessResponse<T>) => void;
    onError: ({ error, updated }: { error: Ref<ErrorResponse>, updated?: boolean}) => void;
}

interface UpdateParams extends NonNullable<FetchOptions> {
    url?: FetchUrl;
    replaceUrl?: FetchUrl
}

export const useApi = <T>() => {
    const { makeRequest, data, error } = useRetryableFetch<ApiResponse<T>>({ throwOnError: false });
    const prepared = ref<Config<T> | null>(null);
    let lastOptions: UpdateParams | undefined;

    const prepare = (config: Config<T>) => {
        prepared.value = config;
    };

    const load = async () => {
        if (!prepared.value?.baseURL) throw new Error("No URL prepared.");
        const { baseURL, options, onSuccess, onError } = prepared.value;

        await makeRequest(baseURL, options);

        if (data.value) onSuccess({ response: data.value as ApiResponse<T> });
        if (error.value) onError({ error });
    };

    const getSuccess = () => ({
        success: !error.value,
        error: error.value as ErrorResponse["error"],
    })
    
    const reload = async (options?: FetchOptions) => {
        if (!prepared.value?.baseURL) throw new Error("No URL prepared.");
        const { baseURL, options: defaultOptions, onSuccess, onError } = prepared.value;

        const finalOptions = options || defaultOptions;

        await makeRequest(baseURL, finalOptions);

        if (data.value) onSuccess({ response: data.value as ApiResponse<T> });
        if (error.value) onError({ error });

        return getSuccess();
    };

    const update = async (options: UpdateParams) => {
        lastOptions = options;

        if (!prepared.value?.baseURL) throw new Error("No URL prepared.");
        if (!lastOptions) throw new Error("No update options set.");

        const baseUrl = prepared.value.baseURL.toString().replace(/\/$/, "");
        const extraPath = lastOptions.url?.toString().replace(/^\//, "");
        const replaceUrl = lastOptions.replaceUrl || null

        const urlToUseForUpdate = extraPath ? `${baseUrl}/${extraPath}` : (replaceUrl ?? baseUrl);

        const { url: _ignored, ...restOptions } = lastOptions;

        await makeRequest(urlToUseForUpdate, restOptions);

        if (error.value) prepared.value.onError({ error, updated: true });
        
        return getSuccess();
    };

    return {
        prepare,
        load,
        reload,
        update,
    };
};
