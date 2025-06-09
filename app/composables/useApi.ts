
interface Config<T> {
    baseURL: FetchUrl;
    options?: FetchOptions;
    onSuccess?: ({ response, action }: { response: ApiResponse<T>; action: Action }) => void;
    onError: ({ error, updated }: { error: Ref<ErrorResponse["error"]>, updated?: boolean }) => void;
}

interface Action {
    name: "load" | "update" | "reload"
}

interface UpdateParams extends NonNullable<FetchOptions> {
    url?: FetchUrl;
}

export const useApi = <T>() => {
    const { makeRequest } = useRetryableFetch({ throwOnError: false });
    const prepared = ref<Config<T> | null>(null);
    let lastOptions: UpdateParams | undefined;

    const lastAction: Action = {
        name: "load"
    }

    const prepare = (config: Config<T>) => {
        prepared.value = config;
    };


    const load = async () => {
        if (!prepared.value?.baseURL) throw new Error("No URL prepared.");
        const { baseURL, options, onSuccess, onError } = prepared.value;

        lastAction.name = "load"
        const { data, error } = await makeRequest<T>(baseURL, options);

        if (onSuccess && data.value) onSuccess({ response: data.value as ApiResponse<T>, action: lastAction });
        if (error.value) onError({ error });
    };

    const getSuccess = (error: any) => ({
        success: !error?.value,
        error: error.value as ErrorResponse["error"],
    })
    
    const reload = async (options?: FetchOptions) => {
        if (!prepared.value?.baseURL) throw new Error("No URL prepared.");
        const { baseURL, options: defaultOptions, onSuccess, onError } = prepared.value;

        const finalOptions = options || defaultOptions;

        lastAction.name = "reload"
        const { data, error } = await makeRequest<T>(baseURL, finalOptions);

        if (onSuccess && data.value) onSuccess({ response: data.value as ApiResponse<T>, action: lastAction });
        if (error.value) onError({ error });

        return getSuccess(error);
    };

    const update = async (options: UpdateParams) => {
        lastOptions = options;

        if (!prepared.value?.baseURL) throw new Error("No URL prepared.");
        if (!lastOptions) throw new Error("No update options set.");

        const baseUrl = prepared.value.baseURL.toString().replace(/\/$/, "");
        const extraPath = lastOptions.url?.toString().replace(/^\//, "");

        const urlToUseForUpdate = extraPath ? `${baseUrl}/${extraPath}` : baseUrl;

        const { url: _ignored, ...restOptions } = lastOptions;

        lastAction.name = "update"
        const { data, error } = await makeRequest<T>(urlToUseForUpdate, restOptions);

        if (error.value) prepared.value.onError({ error, updated: true });

        return getSuccess(error);
    };

    return {
        prepare,
        load,
        reload,
        update,
    };
};
