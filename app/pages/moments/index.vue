<template>
	<div>
		<div class="flex items-center gap-2 mb-3 -mt-4">
			<input :disabled="searchLoading" type="text" @input="debouncedSearch" v-model="searchTerm" placeholder="Search..." class="flex-grow w-full p-2 border border-gray-300 outline-none appearance-none rounded-xl focus:ring-2" />
			<button class="flex items-center justify-center p-2 px-2 text-white bg-black border border-black rounded-xl w-fit">
				<icon name="ri:add-circle-line" size="1.4em" />
			</button>
		</div>
		<hr class="mb-3" />

		<section v-if="List.length >= 1 && !searchLoading" @scroll="updateScrollPercentage" v-bind="containerProps" class="overflow-y-auto h-[80vh]">
			<div v-bind="wrapperProps" class="flex flex-col w-full gap-3">
				<div :id="`${index}`" class="last:pb-[9.6rem]" v-for="(group, index) in List" :key="index">
					<CardGroup :group="group" />
				</div>
			</div>
			<UtilsButtonScroller :totalPages="totalPages" :loading="loading" :scrollPercentage="scrollPercentage" :scrollToTop="() => scrollToTop('smooth')" :scrollToBottom="() => scrollToBottom('smooth')" :Page="Page" />
		</section>

		<section v-else class="h-[60vh] md:h-[65vh] flex items-start justify-center overflow-hidden">
			<div v-if="searchLoading" class="flex flex-col items-center justify-center w-full h-full gap-5">
				<icon class="text-gray-500 animate-spin" name="ri:loader-2-line" size="5em" />
				<h1 class="text-center text-balance">Zoeken...</h1>
			</div>
			<div v-else class="flex flex-col items-center justify-center w-full h-full gap-5">
				<icon class="text-gray-500" name="rivet-icons:sad" size="5em" />
				<h1 class="text-center text-balance">Geen resultaten gevonden Probeer een andere zoekterm.</h1>
				<button class="underline underline-offset-2 text-[#817a70] font-medium hover:text-[#6e675d]">Maak groep aan</button>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: "unauthorized",
	});

	const List: any = ref([]);
	const loading = ref(false);

	const totalPages = ref(0);
	const Page = ref(1);

	const { query } = useRoute();
	const searchTerm = ref(`${query.search || ""}`);
	const searchLoading = ref(false);

	const { data }: any = await useFetch(`/api/moments?search=${searchTerm.value}`);

	List.value = data.value.groups;
	totalPages.value = data.value?.totalPages;

	const debouncedSearch = useDebounce(async () => {
		Page.value = 1;
		loading.value = true;
		searchLoading.value = true;

		if (searchTerm.value) navigateTo(`/moments?search=${searchTerm.value}`);
		else navigateTo(`/moments`);

		const data = await $fetch(`/api/moments?search=${searchTerm.value}`);

		List.value = [];
		List.value = data.groups;
		totalPages.value = data.totalPages;

		setTimeout(() => {
			loading.value = false;
			searchLoading.value = false;
		}, 1000);
	});

	const { containerProps, wrapperProps } = useVirtualList(List, {
		itemHeight: 0,
		overscan: 10,
	});

	const { scrollPercentage, scrollToTop, scrollToBottom, updateScrollPercentage } = useScroller(containerProps.ref);

	useInfiniteScroll(
		containerProps.ref,
		async () => {
			if (Page.value >= totalPages.value || loading.value) return;
			loading.value = true;

			Page.value += 1;
			const data: any = await $fetch(`/api/moments?page=${Page.value}&search=${searchTerm.value}`);

			setTimeout(() => {
				loading.value = false;
				List.value.push(...data.groups);
				totalPages.value = data.totalPages;
				scrollPercentage.value = scrollPercentage.value / 2;
			}, 1000);
		},
		{ direction: "bottom", distance: 20 }
	);
</script>
