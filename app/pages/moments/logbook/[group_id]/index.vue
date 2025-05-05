<template>
	<div>
		<div class="sticky z-50 pt-3 -mt-5 bg-white -top-4">
			<div class="flex items-center justify-between w-full gap-2 mb-3 md:justify-end">
				<FieldInputSearch :disabled="searchLoading" class="hidden md:flex" :uri="`/api/moments/logbook/${group_id}`" placeholder="Search logs..." :update="handleSearch" />

				<div class="relative w-full space-y-2 md:w-1/4">
					<button @click="isActionDropdownOpen = !isActionDropdownOpen" class="flex items-center justify-between gap-2 pl-3 p-2 text-white bg-[#756145] border border-[#756145] rounded-xl w-full">
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
					<button @click="isTimeDropdownOpen = !isTimeDropdownOpen" class="flex items-center justify-between p-2 pl-3 gap-2 text-white bg-[#756145] border border-[#756145] rounded-xl w-full">
						{{ FilterByTimeOptions.find((option) => option.value === time)?.label }}
						<icon :name="isTimeDropdownOpen ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" size="1.4rem" />
					</button>
					<ul v-if="isTimeDropdownOpen" class="absolute left-0 z-50 w-full mt-1 overflow-scroll bg-white border shadow-md rounded-xl">
						<li v-for="option in FilterByTimeOptions" :key="option.value" @click="time = option.value; isTimeDropdownOpen = false;" class="p-2 border-b cursor-pointer hover:bg-gray-100">
						{{ option.label }}
						</li>
					</ul>
				</div>

				<button :disabled="searchLoading" @click="handleManualReload()" class="flex items-center justify-center p-2 px-2 text-white bg-[#756145] border border-[#756145] rounded-xl w-fit">
					<icon :class="searchLoading ? 'animate-spin' : ''" name="ri:refresh-line" size="1.4em" />
				</button>
			</div>
			<FieldInputSearch :disabled="searchLoading" class="md:hidden" :uri="`/api/moments/logbook/${group_id}`"  placeholder="Search logs..." :update="handleSearch" />
			<hr class="pb-3 mt-3" />
		</div>
		<div :class="PWAInstalled ? 'pb-32' : 'pb-20'" class="">
			<div class="relative">
				<div class="absolute top-0 z-20 w-1 h-full bg-gray-100 left-6"></div>
				
				
				
				<div v-for="(logs, group) in groupedLogs" :key="group" class="mb-2">
					<div :class=" PWAInstalled ? 'top-[13.85vh] md:top-[7.95vh]' : 'top-[13.4vh] md:top-[7.95vh]'" class="sticky z-30 flex items-center justify-between px-4 py-3 mb-3 text-lg font-bold text-gray-700 border rounded-xl bg-gray-50">

						<div class="z-30 flex items-center justify-center gap-2">
							<div class="flex z-30 justify-center flex-shrink-0 w-8 -ml-[0.35rem]">
								<div class="flex items-center justify-center w-8 h-8 text-white bg-[#756145] border-2 border-gray-100 rounded-full">
									<Icon name="ri:time-line" size="1.4rem"/>
								</div>
							</div>
							<h2 class="">{{ group }}</h2>
						</div>
						<h3 class="text-sm font-normal text-gray-400 ">Count({{ logs.length }})</h3>
					</div>
					
					<ul class="space-y-4">
						
						<li v-for="log in logs" :key="log.id" class="relative flex items-start gap-3 md:gap-4">
							<div class="z-20 flex justify-center flex-shrink-0 w-8 ml-[0.65rem]">
								<div class="flex items-center justify-center bg-white border-2 rounded-full w-9 h-9 aspect-square border-gray-50 ">
									<Icon :class="`${actionStyles[log.action_type].color}`" :name="actionStyles[log.action_type].icon" size="1.8rem" />
								</div>
							</div>
							<div class="flex-1 rounded-xl">
								<CardLog :content="log"	/>
							</div>
						</li>
					</ul>
				</div>
			</div>
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
	const { query } = useRoute();
	
	const group_id = useRoute().params.group_id;

	const time = ref(7);
	const actions = ref("all");
	
	const searchLoading = ref(false)
	const searchTerm = ref(`${query.search || ""}`);
	const searched = ref(false)

	const isActionDropdownOpen = ref(false);
	const isTimeDropdownOpen = ref(false);

	watch(isActionDropdownOpen, (value) => {
        if (value && isTimeDropdownOpen.value) isTimeDropdownOpen.value = false;
    });

	watch(isTimeDropdownOpen, (value) => {
        if (value && isActionDropdownOpen.value) isActionDropdownOpen.value = false;
    });

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

	const actionStyles: any = {
		created: { icon: "ri:checkbox-circle-fill", color: "bg-green-500" },
		deleted: { icon: "ri:close-circle-fill", color: "bg-red-500" },
		updated: { icon: "ri:information-2-fill", color: "bg-blue-500" },
	};


	const logs = ref()

	const { makeRequest, data, error } = useRetryableFetch<ApiResponse<any>>();

	await makeRequest(`/api/moments/logbook/${group_id}`);

	if(data.value) {
		logs.value = data.value.data
	}

	const handleSearch = (data: any, error: any, loading: boolean) => {
		searchLoading.value = loading;
		searched.value = true;

		if (data.value) {
			logs.value = data.value.data
		}

		if (error.value) logs.value = [];
	};

	const handleManualReload = async () => {

		searchLoading.value = true;

		await makeRequest(`/api/moments/logbook/${group_id}?search=${searchTerm.value}`);

		if (data.value) {
			logs.value = data.value.data
		}

		setTimeout(() => {
			searchLoading.value = false;
		}, 1500)
	}

	
	const isToday = (date: string | Date) => {
		const today = new Date();
		const parsedDate = typeof date === "string" ? new Date(date) : date;
	
		return (
			parsedDate.getDate() === today.getDate() &&
			parsedDate.getMonth() === today.getMonth() &&
			parsedDate.getFullYear() === today.getFullYear()
		);
	};

	const isYesterday = (date: Date) => {
		const yesterday = new Date();
		const parsedDate = typeof date === "string" ? new Date(date) : date;
		
		yesterday.setDate(yesterday.getDate() - 1);
		
		return (
			parsedDate.getDate() === yesterday.getDate() &&
			parsedDate.getMonth() === yesterday.getMonth() &&
			parsedDate.getFullYear() === yesterday.getFullYear()
		);
	};

	const formatDate = (date: Date) => {

		const parsedDate = typeof date === "string" ? new Date(date) : date;

		return parsedDate.toLocaleDateString("en-uk", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	};


	const groupedLogs = computed(() => {
	const groups: Record<string, any> = {};
	const now = new Date();

	logs.value.filter((log: any) => {
		
		if (time.value !== 0) {
			const logDate = new Date(log.timestamp);
			const diffInDays = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
			if (diffInDays > time.value) return false;
		}

		if (actions.value !== "all" && log.action_type !== actions.value) return false;

		return true;
	}).forEach((log: any) => {
		let group = "Older";
		if (isToday(log.timestamp)) group = "Today";
		else if (isYesterday(log.timestamp)) group = "Yesterday";
		else group = formatDate(log.timestamp);

		if (!groups[group]) groups[group] = [];
		groups[group].push(log);
	});

	return groups;
	});

	
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>