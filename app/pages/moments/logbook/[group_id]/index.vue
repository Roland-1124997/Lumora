<template>
	<div>
		<div class="sticky z-50 pt-3 -mt-5 bg-white -top-4">
			<div class="flex items-center justify-between w-full gap-2 mb-3 md:justify-end">
				<FieldInputSearch :disabled="searchLoading" class="hidden md:flex" :uri="`/api/moments/logbook/${group_id}?action=${actions}&timestamp=${time}`" placeholder="Search logs..." :update="handleSearch" />

				<div class="relative w-full space-y-2 md:w-1/4">
					<button :disabled="searchLoading" id="filterByAction" title="filterByAction" @click="isActionDropdownOpen = !isActionDropdownOpen" class="flex items-center justify-between gap-2 pl-3 p-2 text-white bg-[#756145] border border-[#756145] disabled:opacity-90 rounded-xl w-full">
						{{ FilterByActionOptions.find((option) => option.value === actions)?.label }}
						<icon :name="isActionDropdownOpen ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" size="1.4rem" />
					</button>
					<ul v-if="isActionDropdownOpen" class="absolute left-0 z-50 w-full mt-1 overflow-scroll bg-white border rounded-md shadow-xl">
						<li v-for="option in FilterByActionOptions" :key="option.value" @click="actions = option.value; isActionDropdownOpen = false;" class="p-2 border-b cursor-pointer hover:bg-gray-100">
						{{ option.label }}
						</li>
					</ul>
				</div>

				<div class="relative w-full space-y-2 md:w-1/4">
					<button :disabled="searchLoading" id="filterByTime" title="filterByTime" @click="isTimeDropdownOpen = !isTimeDropdownOpen" class="flex items-center justify-between p-2 pl-3 gap-2 text-white bg-[#756145] border border-[#756145] disabled:opacity-90 rounded-xl w-full">
						{{ FilterByTimeOptions.find((option) => option.value === time)?.label }}
						<icon :name="isTimeDropdownOpen ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" size="1.4rem" />
					</button>
					<ul v-if="isTimeDropdownOpen" class="absolute left-0 z-50 w-full mt-1 overflow-scroll bg-white border shadow-md rounded-xl">
						<li v-for="option in FilterByTimeOptions" :key="option.value" @click="time = option.value; isTimeDropdownOpen = false;" class="p-2 border-b cursor-pointer hover:bg-gray-100">
						{{ option.label }}
						</li>
					</ul>
				</div>

				<button :disabled="searchLoading" id="reload" title="reload" @click="handleManualReload()" class="flex items-center justify-center p-2 px-2 text-white bg-[#756145] border border-[#756145] rounded-xl w-fit">
					<icon :class="searchLoading ? 'animate-spin' : ''" name="ri:refresh-line" size="1.4em" />
				</button>
			</div>
			<FieldInputSearch :disabled="searchLoading " class="md:hidden" :uri="`/api/moments/logbook/${group_id}?action=${actions}&timestamp=${time}`" placeholder="Search logs..." :update="handleSearch" />
			<hr class="pb-3 mt-3" />
		</div>
		<div :class="PWAInstalled ? 'pb-32' : 'pb-20'" class="relative ">
			<div v-if="!searchLoading && logs.length >= 1" >
				<UtilsTimeline  :loading="searchLoading" :content="logs" :onLastItemVisible/>
			</div>
			<UtilsSearchIndicator v-else :loading="searchLoading">
				<icon class="text-gray-500" name="ri:emotion-sad-line" size="5em" />
				<h1 class="md:w-[30vw] text-center text-balance mt-5 pb-4">
					<span v-if="searched"> No results found. Try a different search term or check for any typos in your query. </span>
					<span v-else> No logs found for the selected action. Try selecting a different action filter or ensure logs exist for this action. </span>
				</h1>
			</UtilsSearchIndicator>
		</div>
	</div>
</template>

<script setup lang="ts">
	useHead({
		htmlAttrs: {
			lang: "en",
		},
	});

	useSeoMeta({
		title: "Lumora - Group audit logs",
		description: "View shared photos and stories in this Lumora group. Connect, comment, and be inspired.",
		ogTitle: "Lumora - Explore This Group",
		ogDescription: "Dive into the latest posts and moments shared in this Lumora group.",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "/",
		twitterTitle: "Lumora - Group audit logs",
		twitterDescription: "Discover photos and connect with members in this Lumora group.",
		twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary",
	});

	definePageMeta({
		middleware: "unauthorized",
	});

	/*
	 ************************************************************************************
	 */

	const { PWAInstalled } = inject<any>("PWA");
	
	const group_id = useRoute().params.group_id;

	const totalPages = ref(0)
	const Page = ref(1);

	const time = ref(7);
	const actions = ref("all");
	
	const searchLoading = ref(false)
	const searchTerm = ref("");
	
	/*
	************************************************************************************
	*/

	const loading = ref(false)

	const onLastItemVisible = async () => {
		if (Page.value >= totalPages.value || loading.value) return;

		loading.value = true;
		Page.value += 1;

		await makeRequest(`/api/moments/logbook/${group_id}?page=${Page.value}&action=${actions.value}&timestamp=${time.value}&search=${searchTerm.value}`);

		if (data.value && Array.isArray(data.value.data)) {
			
			data.value.data.forEach((newItem) => {
					
				const existingGroup = logs.value.find((group: any) => group.date === newItem.date);

				if (existingGroup) existingGroup.items.push(...newItem.items);
				else logs.value.push(newItem);
			});

			totalPages.value = data.value.pagination?.total || 0;
		}

		loading.value = false;
	}


	/*
	************************************************************************************
	*/

	const isActionDropdownOpen = ref(false);

	watch(isActionDropdownOpen, (value) => {
        if (value && isTimeDropdownOpen.value) isTimeDropdownOpen.value = false;
    });

	const isTimeDropdownOpen = ref(false);
	
	watch(isTimeDropdownOpen, (value) => {
        if (value && isActionDropdownOpen.value) isActionDropdownOpen.value = false;
    });

	/*
	************************************************************************************
	*/

	const FilterByActionOptions = [
		{ label: "All actions", value: "all" },
		{ label: "Created", value: "created" },
		{ label: "Deleted", value: "deleted" },
		{ label: "Updated", value: "updated" },
	];

	const FilterByTimeOptions = [
		{ label: "Last day", value: 1 },
		{ label: "Last 7 days", value: 7 },
		{ label: "Last 30 days", value: 30 },
		{ label: "Last 90 days", value: 90 },
	];

	/*
	 ************************************************************************************
	 */

	const logs: any = ref([])
	const { makeRequest, data, error } = useRetryableFetch<ApiResponse<any>>();
	const { updateGroupValue } = inject<any>("group");

		
	await makeRequest(`/api/moments/logbook/${group_id}?action=${actions.value}&timestamp=${time.value}&search=${searchTerm.value}`);
			
	if(data.value) {
		logs.value = data.value.data
		totalPages.value = data.value.pagination?.total || 0;

		updateGroupValue(data.value.meta?.name);
	}
	
	if(error.value) logs.value = []

	/*
	************************************************************************************
	*/

	watch(actions, (value) => {
		searchLoading.value = true
		Page.value = 1
		setTimeout(async () => {
			await makeRequest(`/api/moments/logbook/${group_id}?action=${value}&timestamp=${time.value}&search=${searchTerm.value}`);
			
			if(data.value) {
				logs.value = data.value.data
				totalPages.value = data.value.pagination?.total || 0;
			}
			if(error.value) logs.value = []
			
			searchLoading.value = false
		}, 1500)
	})

	watch(time, (value) => {
		searchLoading.value = true
		Page.value = 1
		setTimeout(async () => {
			await makeRequest(`/api/moments/logbook/${group_id}?action=${actions.value}&timestamp=${value}&search=${searchTerm.value}`);
			
			if(data.value) {
				logs.value = data.value.data
				totalPages.value = data.value.pagination?.total || 0;
			}
			if(error.value) logs.value = []
			
			searchLoading.value = false
		}, 1500)
	})

	/*
	 ************************************************************************************
	 */

	const searched = ref(false)

	const handleSearch = (data: any, error: any, loading: boolean, term: string) => {

		Page.value = 1
		
		searchLoading.value = loading;
		searched.value = true;

		searchTerm.value = term

		if(data.value) {
			logs.value = data.value.data
			totalPages.value = data.value.pagination?.total || 0;
		}
		if(error.value) logs.value = [];
	};

	const handleManualReload = async () => {
		searchLoading.value = true;
		Page.value = 1
		await makeRequest(`/api/moments/logbook/${group_id}?action=${actions.value}&timestamp=${time.value}&search=${searchTerm.value}`);

		if(data.value) {
			logs.value = data.value.data
			totalPages.value = data.value.pagination?.total || 0;
		}
		if(error.value) logs.value = []

		setTimeout(() => {
			searchLoading.value = false;
		}, 1500)
	}

</script>

