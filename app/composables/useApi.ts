interface Config<T> {
    url: Parameters<typeof $fetch>[0];
    options: Parameters<typeof $fetch>[1];
    onSuccess: ({ response }: SuccessResponse<T>) => void;
    onError: ({ error }: any) => void;
}

export const useApi = <T>() => {
    const { makeRequest, data, error } = useRetryableFetch<ApiResponse<T>>();
    const prepared = ref<Config<T> | null>(null);

    const prepare = (config: Config<T>) => {
        prepared.value = config;
    };

    const fetch = async () => {
        if (!prepared.value?.url) throw new Error("No URL prepared.");
        const { url, options, onSuccess, onError } = prepared.value;

        await makeRequest(url, options);

        if (data.value) onSuccess({ response: data.value as ApiResponse<T> });
        if (error.value) onError({ error })
    };

    const reload = async () => {
        await fetch()

        if (data.value) return { success: true}
        else return { success: false }

    };

    return {
        prepare,
        fetch,
        reload,
    };
};






// export const useApi = () => {

//     let uri: Parameters<typeof $fetch>[0]
//     let options: Parameters<typeof $fetch>[1]

//     const { makeRequest, data } = useRetryableFetch<ApiResponse<any>>();
//     const { updateGroupValue } = inject<any>("group");

//     const test = ref()

//     const prepare = ( configuration: any) =>{
//         test.value = configuration
//     }

//     const fetch = async (url: Parameters<typeof $fetch>[0], options: Parameters<typeof $fetch>[1] ) => {

//         uri = url
//         options = options

//         await makeRequest(url, options);

//     }

//     const reload = async () => {
//         await makeRequest(uri, options);
//     }


//     return {
//         prepare,
//         fetch,
//         reload
//     }
// }





// await makeRequest(`/api/moments/settings/${group_id}`);
// if (data.value) {
//     content.value = data.value.data;
//     name.value = data.value.data.name;
//     description.value = data.value.data.description;
//     config.value = data.value.data.configuration;
//     activeTab.value = data.value.data.accepted ? "members" : "requests";

//     originalName.value = data.value.data.name;
//     originalDescription.value = data.value.data.description;

//     data.value.data.configuration.sections.forEach((section: any) => {
//         section.options.forEach((option: any) => {
//             originalConfig.value[option.key] = option.value;
//         });
//     });

//     updateGroupValue(name.value);
// }