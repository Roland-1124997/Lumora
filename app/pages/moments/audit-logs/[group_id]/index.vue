<template>
	<div>
		<div class="sticky z-50 pt-3 -mt-5 bg-white -top-4">
			<div class="flex items-center justify-between w-full gap-2 mb-3 md:justify-end">
				<FieldInputSearch class="hidden md:flex" uri="/api/moments" placeholder="Search logs..." :url="$route.path" :update="() => {}" />

				<div class="relative w-full space-y-2 md:w-1/4">
					<button @click="isActionDropdownOpen = !isActionDropdownOpen" class="flex items-center justify-between gap-2 pl-3 p-2 text-white bg-[#756145] border border-[#756145] rounded-xl w-full">
						{{ FilterByActionOptions.find((option) => option.value === actions)?.label }}
						<icon :name="isActionDropdownOpen ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" size="1.4rem" />
					</button>
					<ul v-if="isActionDropdownOpen" class="absolute left-0 z-50 w-full mt-1 overflow-scroll bg-white border rounded-md shadow-xl">
						<li v-for="option in FilterByActionOptions" :key="option.value" @click=" actions = option.value; isActionDropdownOpen = false;" class="p-2 border-b cursor-pointer hover:bg-gray-100">
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

				<button @click="() => {}" class="flex items-center justify-center p-2 px-2 text-white bg-[#756145] border border-[#756145] rounded-xl w-fit">
					<icon :class="false ? 'animate-spin' : ''" name="ri:refresh-line" size="1.4em" />
				</button>
			</div>
			<FieldInputSearch class="md:hidden" uri="/api/moments" placeholder="Search logs..." :url="$route.path" :update="() => {}" />
			<hr class="pb-3 mt-3" />
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

	const time = ref(7);
	const actions = ref("all");

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
		{ label: "Group", value: "group" },
		{ label: "Messages", value: "message" },
		{ label: "Moderation", value: "moderation" },
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
</script>
