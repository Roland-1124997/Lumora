<template>
	<div>
		<div class="flex items-center gap-2 mb-3 -mt-4">
			<input :disabled="searchLoading" type="text" @input="debouncedSearch" v-model="searchTerm" placeholder="Search..." class="flex-grow w-full p-2 border border-gray-300 outline-none appearance-none rounded-xl focus:ring-2" />
			<button @click="createFunction('Create')" class="flex items-center justify-center p-2 px-2 text-white bg-black border border-black rounded-xl w-fit">
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
				<button @click="createFunction('Create')" class="underline underline-offset-2 text-[#817a70] font-medium hover:text-[#6e675d]">Maak groep aan</button>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">

	useHead({
		htmlAttrs: {
			lang: "nl",
		},
	});

	useSeoMeta({
		title: "Lumora - Moments",
		description: "Bekijk de nieuwste en populairste posts op Lumora!",
		ogTitle: "Lumora",
		ogDescription: "Bekijk de nieuwste en populairste posts op Lumora!",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "/",
		twitterTitle: "Lumora",
		twitterDescription: "Bekijk de nieuwste en populairste posts op Lumora!",
		twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary",
	});

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

	/*
	************************************************************************************
	*/

	const { data, error }: any = await useFetch(`/api/moments?search=${searchTerm.value}`);

	if (!error.value) {
		List.value = data.value.data;
		totalPages.value = data.value.pagination.total;
	}

	const debouncedSearch = useDebounce(async () => {
		Page.value = 1;
		loading.value = true;
		searchLoading.value = true;

		if (searchTerm.value) navigateTo(`/moments?search=${searchTerm.value}`);
		else navigateTo(`/moments`);

		await $fetch(`/api/moments?search=${searchTerm.value}`)
			.then((data: any) => {
				List.value = [];
				List.value = data.data;
				totalPages.value = data.pagination.total;
			})
			.catch(() => (List.value = []))

			.finally(() => {
				setTimeout(() => {
					loading.value = false;
					searchLoading.value = false;
				}, 1000);
			});
	});

	/*
	************************************************************************************
	*/

	const { containerProps, wrapperProps } = useVirtualList(List, { itemHeight: 0, overscan: 10 });
	const { scrollPercentage, scrollToTop, scrollToBottom, updateScrollPercentage } = useScroller(containerProps.ref);

	useInfiniteScroll(containerProps.ref, async () => {
			if (Page.value >= totalPages.value || loading.value) return;

			loading.value = true;
			Page.value += 1;

			await $fetch(`/api/moments?page=${Page.value}&search=${searchTerm.value}`)
				.then((data: any) => {
					setTimeout(() => {
						List.value.push(...data.data);
						totalPages.value = data.pagination.total;
						scrollPercentage.value = scrollPercentage.value / 2;
					}, 500);
				})
				.catch(() => {})
				.finally(() => (loading.value = false));
		},
		{ direction: "bottom", distance: 20 }
	);

	/*
	************************************************************************************
	*/

	const handleSuccess = async ({ response }: SuccessResponse,) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		if (response.meta.redirect) navigateTo(response.meta.redirect);
	};

	const handleError = async ({ error, actions }: ErrorResponse) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		if (error.data.errors.field) actions.setErrors(error.data.errors.field);
	};

	const { updatemodalValue }: any = inject("modal");
	const createFunction = (type: string) => {
		updatemodalValue({
			open: true,
			type: type,
			name: "New group",
			requestUrl: "/api/moments", 
			onSuccess: handleSuccess,
			onError: handleError,
		});
	};
</script>
