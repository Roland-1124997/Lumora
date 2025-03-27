<template>
	<div>
		<div class="flex items-center justify-between gap-2 mb-3 -mt-4">
			<button @click="createUploadFunction()" class="flex items-center justify-center w-full gap-2 p-2 px-4 text-black border border-black hover:bg-gray-100 rounded-xl md:w-fit">
				<icon name="ri:add-circle-line" size="1.4em" />
				<span> Share your experiences </span>
			</button>
			<div class="flex items-center gap-2">
				<button :disabled="reload" @click="handleManualReload()" class="flex items-center justify-center p-2 px-2 text-white bg-black border border-black rounded-xl w-fit">
					<icon :class="reload ? 'animate-spin' : ''" name="ri:refresh-line" size="1.4em" />
				</button>
				<NuxtLink :to="`/moments/settings/${group_id}`" class="flex items-center justify-center gap-2 p-2 px-2 text-white bg-black border border-black rounded-xl w-fit">
					<icon name="ri:information-line" size="1.4em" />
				</NuxtLink>
			</div>
		</div>
		<hr class="mb-2" />
		<section v-if="List.length >= 1 && !reload" @scroll="updateScrollPercentage" v-bind="containerProps" class="h-[80vh] overflow-y-scroll">
			<div v-bind="wrapperProps" class="grid w-full grid-cols-2 gap-3 pb-10 mb-32 lg:grid-cols-4">
				<div :class="PWAInstalled ? 'last:mb-16 md:last:mb-8' : 'last:mb-4 md:last:mb-8'" v-for="(content, index) in List" :key="index">
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

	const { PWAInstalled } = inject<any>("PWA");
	const group_id: any = useRoute().params.group_id;

	const totalPages = ref(1);
	const Page = ref(1);

	const List = ref<Post[]>([]);
	const name = ref();

	/*
	 ************************************************************************************
	 */

	const { updateGroupValue } = inject<any>("group");
	const { setGroupData, setItemToStart, getGroupData, getScrollData, updateGroupData, updateScrollData, removeData } = useGroupStore();

	const useFetchData = async (options: Record<string, any>, load: Ref, timer = 250) => {
		load.value = true;
		if (options.reload) Page.value = 1;
		if (options.update) Page.value += 1;

		await $fetch(`/api/moments/${group_id}?page=${Page.value}`)
			.then((response: ApiResponse<Post[]>) => {
				totalPages.value = response.pagination?.total || 0;
				name.value = response.meta?.name;

				updateGroupValue(name.value);

				if (options.set) {
					List.value = response.data as Post[];
					setGroupData(group_id, name.value, Page.value, totalPages.value, List.value);
				}

				if (options.update) {
					List.value.push(...(response.data as Post[]));
					updateGroupData(group_id, name.value, Page.value, totalPages.value, List.value);
				}

				if (options.reload) {
					List.value = response.data as Post[];
					removeData(group_id);
					setTimeout(() => setGroupData(group_id, name.value, Page.value, totalPages.value, List.value), 3000);
				}
			})
			.catch(async (error) => {
				removeData(group_id);
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
		name.value = state.group.name;

		updateGroupValue(name.value);
	};

	const loading = ref(false);
	const group = getGroupData(group_id);
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

	const scrollData = getScrollData(group_id);
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

	watch(scrollPercentage, (percentage) => updateScrollData(group_id, percentage, scrollPixels.value));

	/*
	 ************************************************************************************
	 */

	const reload = ref(false);
	const handleManualReload = async () => await useFetchData({ reload: true }, reload, 2000);

	const handleReload = async (response: Post | undefined) => {
		if (List.value.length >= 1) {
			reload.value = true;

			if (response) setItemToStart(group_id, response);
			setTimeout(() => (reload.value = false), 2000);
		} else await useFetchData({ reload: true }, reload, 2000);
	};

	const handleSuccess = async ({ response }: SuccessResponse<Post>) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		if (response.status.redirect) navigateTo(response.status.redirect);
		if (response.status.refresh) handleReload(response.data);
	};

	const handleError = async ({ error, actions }: ErrorResponse) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		if (error.data.error?.type == "fields") actions.setErrors(error.data.error.details);
	};

	const { updateModalValue } = inject<any>("modal");

	const createUploadFunction = () => {
		updateModalValue({
			open: true,
			type: "images",
			name: "Create experience",
			requestUrl: `/api/moments/${group_id}`,
			onSuccess: handleSuccess,
			onError: handleError,
		});
	};

	/*
	 ************************************************************************************
	 */
</script>
