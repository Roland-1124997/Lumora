<template>
	<div class="">
		<div class="flex items-center gap-2 mb-3 -mt-4">
			<input type="text" placeholder="Search..." class="flex-grow w-full p-2 border border-gray-300 outline-none appearance-none rounded-xl focus:ring-2" />
			<button :disabled="reload" @click="handleReload()" class="flex items-center justify-center p-2 px-2 text-white bg-black border border-black rounded-xl w-fit">
				<icon :class="reload ? 'animate-spin' : ''" name="ri:refresh-line" size="1.4em" />
			</button>
			<button @click="createFunction('images')" class="flex items-center justify-center p-2 px-2 text-white bg-black border border-black rounded-xl w-fit">
				<icon name="ri:add-circle-line" size="1.4em" />
			</button>
			<button @click="createFunction('Settings')" class="flex items-center justify-center p-2 px-2 text-white bg-black border border-black rounded-xl w-fit">
				<icon name="ri:settings-3-fill" size="1.4em" />
			</button>
		</div>
		<hr class="mb-2" />
		
		<section v-if="List && !reload" @scroll="updateScrollPercentage" v-bind="containerProps" class="h-[80vh] overflow-y-auto">
			<div v-bind="wrapperProps" class="grid w-full grid-cols-2 gap-3 mb-32 lg:grid-cols-4">
				<div class="last:pb-16" v-for="(image, index) in List" :key="index">
					<LazyCardImage :image="image" />
				</div>
			</div>
		</section>

		<section v-else class="h-[80vh] overflow-y-auto">
			<div class="grid w-full grid-cols-2 gap-3 mb-[4.3rem] lg:grid-cols-4">
				<div class="" v-for="i in 12">
					<LazyCardImageSkeleton />
				</div>
			</div>
		</section>

		<UtilsButtonScroller :totalPages :loading :scrollPercentage :scrollToTop="() => scrollToTop('smooth')" :scrollToBottom="() => scrollToBottom('smooth')" :Page />
	</div>
</template>

<script setup>
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

	/*
	************************************************************************************
	*/

	const slug = useRoute().params.slug;
	const id = useRoute().query.id;
	
	const totalPages = ref(1);
	const Page = ref(1);

	const List = ref();
	
	/*
	************************************************************************************
	*/

	const { getGroupData, getScrollData, setGroupData, updateGroupData, updateScrollData, removeData } = useGroupStore();

	const useFetchData = async (options, load, timer = 250) => {

		load.value = true
		if(options.reload) Page.value = 1
		if(options.update) Page.value += 1;

		await $fetch(`/api/moments/${id}?slug=${slug}&page=${Page.value}`).then((response) => {
			totalPages.value = response.pagination.total;
			
			if(options.reload) List.value = response.data;
			if(options.set) List.value = response.data;
			if(options.update) List.value.push(...response.data);
			
			if(options.reload) removeData(id)
			if(options.set || options.reload) setGroupData(id, Page.value, totalPages.value, List.value);
			if(options.update) updateGroupData(id, Page.value, totalPages.value, List.value);
			
		})
		.catch(async (error) => { if(error.data.meta.code == 403) return navigateTo("/moments") })
		.finally(() => setTimeout(() => load.value = false, timer));
	}

	const useDisplayStorageData = (state) => {
		totalPages.value = state.pagination.total;
		List.value = state.data;
		Page.value = state.pagination.page;
	}

	const loading = ref(false);
	const group = getGroupData(id);
	if (!group) await useFetchData({ set: true }, loading)
	else useDisplayStorageData(group)
	
	/*
	************************************************************************************
	*/

	const { containerProps, wrapperProps } = useVirtualList(List, { itemHeight: 0, overscan: 10 });
	const { scrollPercentage, scrollPixels, scrollToTop, scrollToBottom, updateScrollPercentage } = useScroller(containerProps.ref);

	const useScrollToPosition = (state, behavior = "auto") => {
		if (state) {
			scrollPercentage.value = state.percentage;
			scrollPixels.value = state.pixels;

			const container = containerProps.ref.value;
			const scrollPosition = (scrollPixels.value / 100) * state.percentage;

			container.scrollTo({
				top: scrollPosition,
				behavior: behavior,
			});
		}
	}
	
	const scrollData = getScrollData(id);
	onMounted(() => useScrollToPosition(scrollData));
	
	useInfiniteScroll(containerProps.ref, async () => {
		if (Page.value >= totalPages.value || loading.value) return;
		await useFetchData({ update: true }, loading)
	}, { direction: "bottom", distance: 20 });

	watch(scrollPercentage, (percentage) => {
		updateScrollData(id, percentage, scrollPixels.value);
	});

	/*
	************************************************************************************
	*/

	const reload = ref(false);
	const handleReload = async () => await useFetchData({ reload: true }, reload, 2000);
	
	const handleSuccess = async ({ response }) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		if (response.meta.redirect) navigateTo(response.meta.redirect);
		if (response.meta.refresh) await handleReload()
	};

	const handleError = async ({ error, actions }) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		if (error.data.errors.field) actions.setErrors(error.data.errors.field);
	};

	const { updatemodalValue } = inject("modal");
	const createFunction = (type) => {
		updatemodalValue({
			open: true,
			type: type,
			name: type == "Settings" ? type : "New image",
			requestUrl: `/api/moments/${id}`,
			onSuccess: handleSuccess,
			onError: handleError,
		});
	};
</script>
