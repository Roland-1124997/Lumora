<template>
	<div>
		<div class="flex items-center justify-end gap-2 mb-3 -mt-4">
			
			<div class="flex items-center gap-2">
				<button :disabled="reload" @click="handleManualReload()" class="flex items-center justify-center p-2 px-2 text-white bg-[#756145] border border-[#756145] rounded-xl w-fit">
					<icon :class="reload ? 'animate-spin' : ''" name="ri:refresh-line" size="1.4em" />
				</button>
				
			</div>
		</div>
		<hr class="mb-2" />
		<section v-if="List.length >= 1 && !reload" @scroll="updateScrollPercentage" v-bind="containerProps" class="h-[80vh] overflow-y-scroll">
			<div v-bind="wrapperProps" class="grid w-full grid-cols-2 gap-3 pb-10 mb-32 lg:grid-cols-4">
				<div :class="PWAInstalled ? 'last:mb-32 md:last:mb-16' : 'last:mb-8 md:last:mb-16'" v-for="(content, index) in List" :key="index">
					<LazyCardImage :content />
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

<script setup lang="ts">
	useHead({
		htmlAttrs: {
			lang: "nl",
		},
	});

	useSeoMeta({
		title: "Lumora - Trending",
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


	const { PWAInstalled } = inject<any>("PWA");

	const totalPages = ref(1);
	const Page = ref(1);

	const List = ref<Post[]>([]);

	const { setGroupData, setItemToStart, getGroupData, getScrollData, updateGroupData, updateScrollData, removeData } = useGroupStore();

	const useFetchData = async (options: Record<string, any>, load: Ref, timer = 250) => {
		load.value = true;
		if (options.reload) Page.value = 1;
		if (options.update) Page.value += 1;

		await $fetch(`/api/timeline?page=${Page.value}`)
			.then((response: ApiResponse<Post[]>) => {
				totalPages.value = response.pagination?.total || 0;
				
				if (options.set) {
					List.value = response.data as Post[];
					setGroupData("Timeline", "Timeline", Page.value, totalPages.value, List.value);
				}

				if (options.update) {
					List.value.push(...(response.data as Post[]));
					updateGroupData("Timeline", "Timeline", Page.value, totalPages.value, List.value);
				}

				if (options.reload) {
					List.value = response.data as Post[];
					removeData("Timeline");
					setTimeout(() => setGroupData("Timeline", "Timeline", Page.value, totalPages.value, List.value), 3000);
				}
			})
			.catch(async (error) => {
				throw createError({
					statusCode: error.data.status.code,
					message: error.data.status.message,
					fatal: true,
				});
			})
			.finally(() => setTimeout(() => (load.value = false), timer));
	};

	const useDisplayStorageData = (state: Record<string, any>) => {
		totalPages.value = state.pagination.total;
		List.value = state.data;
		Page.value = state.pagination.page;
	};

	const loading = ref(false);
	const group = getGroupData("Timeline");
	if (!group) await useFetchData({ set: true }, loading);
	else useDisplayStorageData(group);

	/*
	 ************************************************************************************
	 */

	const { containerProps, wrapperProps } = useVirtualList(List, { itemHeight: 0, overscan: 10 });
	const { scrollPercentage, scrollPixels, scrollToTop, scrollToBottom, updateScrollPercentage } = useScroller(containerProps.ref);

	const useScrollToPosition = (state: Record<string, any>, behavior: ScrollBehavior = "auto") => {
		if (state) {
			scrollPercentage.value = state.percentage;
			scrollPixels.value = state.pixels;

			const container = containerProps.ref.value;
			const scrollPosition = (scrollPixels.value / 100) * state.percentage;

			if (container)
				container.scrollTo({
					top: scrollPosition,
					behavior: behavior,
				});
		}
	};

	const scrollData = getScrollData("Timeline");
	onMounted(() => {
		if (scrollData) useScrollToPosition(scrollData);
	});

	useInfiniteScroll(
		containerProps.ref,
		async () => {
			if (Page.value >= totalPages.value || loading.value) return;
			await useFetchData({ update: true }, loading);
		},
		{ direction: "bottom", distance: 20 }
	);

	watch(scrollPercentage, (percentage) => updateScrollData("Timeline", percentage, scrollPixels.value));

	/*
	 ************************************************************************************
	 */

	const reload = ref(false);
	const handleManualReload = async () => await useFetchData({ reload: true }, reload, 2000);

</script>
