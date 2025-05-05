<template>
    <div class="w-full ">
        <input :disabled="disabled || loading" v-model="term" @input="debouncedSearch" type="search" :placeholder="placeholder ? placeholder : 'Search...'" class="flex-grow w-full p-2 px-3 border bg-white border-[#756145] ring-[#756145] outline-none appearance-none rounded-xl focus:ring-1" />
    </div>
</template>

<script setup lang="ts"> 

    const { query } = useRoute();
	
    const term = ref<string>(`${query.search || ""}`);
    const loading = ref<boolean>(false);
    
    const { makeRequest, data, error } = useRetryableFetch<ApiResponse<any>>({ throwOnError: false });

    const { uri, url, update } = defineProps<{
        update: (data: any, error: any, loading: boolean, term?: any) => void;
        disabled?: boolean,
        placeholder?: string;
        url?: string;
        uri: string; 
    }>();

    const debouncedSearch = useDebounce(async () => {
		loading.value = true;
        term.value = term.value.trim();
        const atributes = uri?.split("?")[1]

        if (url) navigateTo(term.value ? `${url}?search=${term.value}` : url);
        
        if(atributes) await makeRequest(`${uri}&search=${term.value}`)
        else await makeRequest(`${uri}?search=${term.value}`)

        setTimeout(() => loading.value = false, 800);
	});


    watch(loading, () => {
        update(data, error, loading.value, term.value);
    });

</script>

<style scoped>

input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 1rem;
    width: 1rem;
    background-color: #756145;
    mask: url('data:image/svg+xml;utf8,<svg fill="white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 8.586L4.707 3.293a1 1 0 00-1.414 1.414L8.586 10l-5.293 5.293a1 1 0 101.414 1.414L10 11.414l5.293 5.293a1 1 0 001.414-1.414L11.414 10l5.293-5.293a1 1 0 00-1.414-1.414L10 8.586z" clip-rule="evenodd"/></svg>') no-repeat center;
    background-size: contain;
}

</style>