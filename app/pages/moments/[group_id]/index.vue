<template>
	<div v-if="List">
		<div class="flex items-center justify-between gap-2 mb-3 -mt-4">
			<div class="items-center hidden gap-2 md:flex">
				<button :disabled="!accepted" @click="createUploadFunction()" class="flex items-center justify-center w-full gap-2 p-2 px-4 text-[#756145] border border-[#756145] hover:bg-gray-100 disabled:opacity-50 rounded-xl md:w-fit">
					<icon name="ri:add-circle-line" size="1.4em" />
					<span> Create posts </span>
				</button>
				<NuxtLink :to="`/moments/pending-queue/${group_id}`" v-if="need_approval && has_permisons" class="flex items-center justify-center w-fit gap-2 p-2 px-4 text-[#756145] border border-[#756145] hover:bg-gray-100 disabled:opacity-50 rounded-xl md:w-fit">
					<span v-if="posts_count_need_approval >= 1" :class="posts_count_need_approval > 99 ? ' min-w-[1.90rem]' : ' min-w-5'" class="flex items-center justify-center p-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full min-h-5 h-fit w-fit ">
						{{ posts_count_need_approval > 99 ? "99+" : posts_count_need_approval }}
					</span>
					<span> Queue</span>
				</NuxtLink>
			</div>

			<button :disabled="!accepted" @click="createUploadFunction()" class="flex md:hidden items-center justify-center w-full gap-2 p-2 px-4 text-[#756145] border border-[#756145] hover:bg-gray-100 disabled:opacity-50 rounded-xl md:w-fit">
				<icon name="ri:add-circle-line" size="1.4em" />
				<span> Create posts </span>
			</button>
			<NuxtLink :to="`/moments/pending-queue/${group_id}`" v-if="need_approval && has_permisons" class="flex md:hidden items-center justify-center w-full max-w-[5.9rem] gap-1 p-2 px-4 text-[#756145] border border-[#756145] hover:bg-gray-100 disabled:opacity-50 rounded-xl md:w-fit">
				<span v-if="posts_count_need_approval >= 1" :class="posts_count_need_approval > 99 ? ' min-w-[1.90rem]' : ' min-w-5'" class="flex items-center justify-center p-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full min-h-5 h-fit w-fit ">
					{{ posts_count_need_approval > 99 ? "99+" : posts_count_need_approval }}
				</span>
				<span> Queue </span>
			</NuxtLink>
			<div class="flex items-center gap-2">
				<button :disabled=" List.length < 1 || reload" @click="handleManualReload()" class="flex items-center justify-center p-2 px-2 text-white bg-[#756145] border border-[#756145] rounded-xl w-fit">
					<icon :class="List.length < 1 || reload ? 'animate-spin' : ''" name="ri:refresh-line" size="1.4em" />
				</button>
				<NuxtLink :to="`/moments/settings/${group_id}`" class="flex items-center justify-center gap-2 p-2 px-2 text-white bg-[#756145] border border-[#756145] rounded-xl w-fit">
					<icon name="ri:information-line" size="1.4em" />
				</NuxtLink>
			</div>
		</div>
		<hr class="mb-2" />

		<section v-if="List.length >= 1 && !reload" @scroll="updateScrollPercentage" v-bind="containerProps" class="h-[80vh] overflow-y-scroll">
			<div v-bind="wrapperProps" class="grid w-full grid-cols-2 gap-3 pb-10 mb-32 lg:grid-cols-4">
				<div :class="PWAInstalled ? 'last:pb-24 pb:last:mb-8' : 'last:pb-4 md:last:pb-8'" v-for="(content, index) in List" :key="index">
					<LazyCardImage v-if="content" :content="content" />
					<LazyCardImageSkeleton v-else />
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
			lang: "en",
		},
	});

	useSeoMeta({
		title: "Lumora - Group",
		description: "View shared photos and stories in this Lumora group. Connect, comment, and be inspired.",
		ogTitle: "Lumora - Explore This Group",
		ogDescription: "Dive into the latest posts and moments shared in this Lumora group.",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "/",
		twitterTitle: "Lumora - Group",
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
	const group_id: any = useRoute().params.group_id;

	const totalPages = ref(1);
	const Page = ref(1);

	const List = ref<Post[] | any>([]);
	const name = ref();

	/*
	 ************************************************************************************
	 */

	const { updateGroupValue } = inject<any>("group");
	const { setGroupData, getGroupData, getScrollData, updateGroupData, updateScrollData, removeData } = useGroupStore();
	const { makeRequest, data } = useRetryableFetch<ApiResponse<Post[]>>();

	/*
	 ************************************************************************************
	 */

	const processPostsApiResponse = (data: Record<string, any>) => {
		const response = data.value;
		totalPages.value = response.pagination?.total || 0;
		name.value = response.meta?.name;

		updateGroupValue(name.value);

		return response;
	};

	const updateListData = (response: ApiResponse<Post[]>, page: number = 1, options: { set?: boolean; update?: boolean; reload?: boolean } = {}) => {
		if (options.reload) {
			List.value = response.data as Post[];
			removeData(group_id, { partial: false });
			setTimeout(() => setGroupData(group_id, name.value, page, totalPages.value, List.value), 3000);
		} else if (options.set || page === 1) {
			List.value = response.data as Post[];
			removeData(group_id, { partial: true });
			setTimeout(() => setGroupData(group_id, name.value, page, totalPages.value, List.value), 200);
		} else if (options.update || page > 1) {
			if (Array.isArray(response.data)) List.value.push(...response.data);
			setTimeout(() => updateGroupData(group_id, name.value, page, totalPages.value, List.value), 200);
		}
	};

	const useFetchData = async (options: Record<string, any>, load: Ref, timer = 250) => {
		load.value = true;

		if (options.reload) Page.value = 1;
		if (options.update) Page.value += 1;

		await makeRequest(`/api/moments/${group_id}?page=${Page.value}`, { sessions: options.reload || options.update });

		if (data.value) {
			const response = processPostsApiResponse(data);
			updateListData(response, Page.value, options);
		}

		setTimeout(() => (load.value = false), timer);
	};

	const useDisplayStorageData = (state: Record<string, any>) => {
		totalPages.value = state.pagination.total;
		List.value = state.data;
		Page.value = state.pagination.page;
		name.value = state.group.name;

		updateGroupValue(name.value);
	};

	/*
	 ************************************************************************************
	 */

	const accepted = ref(false);
	const need_approval = ref(false);
	const has_permisons = ref(false);
	const posts_count_need_approval = ref(0);
	const loading = ref(false);

	const group: any = getGroupData(group_id);
	if (!group) await useFetchData({ set: true }, loading);
	else useDisplayStorageData(group);

	await $fetch(`/api/moments/pending/${group_id}`)
		.then((response) => {
			accepted.value = response.data.accepted;
			need_approval.value = response.data.need_approval;
			has_permisons.value = response.data.has_permisons;
			posts_count_need_approval.value = response.data.posts_count_need_approval;
		})
		.catch((error) => {});

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
			await useFetchData({ update: true }, loading, 500);
		},
		{ direction: "bottom", distance: 20 }
	);

	watch(scrollPercentage, (percentage) => updateScrollData(group_id, percentage, scrollPixels.value));

	/*
	 ************************************************************************************
	 */

	const handleManualReload = async () => {
		await useFetchData({ reload: true }, reload, 2000);
	};

	const reload = ref(false);
	const handleReload = async () => {
		const page = ref(1);
		reload.value = true;

		while (page.value <= totalPages.value) {
			await makeRequest(`/api/moments/${group_id}?page=${page.value}`, { sessions: true });

			if (data.value) {
				const response = processPostsApiResponse(data);
				updateListData(response, page.value);
			}

			if (page.value < totalPages.value) page.value++;
			else break;
		}

		setTimeout(() => (reload.value = false), 2000);
	};

	/*
	 ************************************************************************************
	 */

	
	const { addToast } = useToast();

	const { updateModalValue } = inject<any>("modal");

	const createUploadFunction = () => {
		updateModalValue({
			open: true,
			type: "images",
			name: "Create experience",
			requestUrl: `/api/moments/${group_id}`,
			resize: true,
			minimized: false,
			loading: false,
			onSuccess: handleSuccess,
			onError: handleError,
		});
	};

	const handleSuccess = async ({ response }: SuccessResponse<Post>) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));


		if(need_approval.value) return addToast({ 
			message: "Your image has been submitted for approval.", 
			type: "success", 
			duration: 5000 
		});
		
		else addToast({ 
			message: "Your image has been posted successfully.", 
			type: "success", 
			duration: 5000 
		});

		if (response.status.redirect) navigateTo(response.status.redirect);
		if (response.status.refresh) handleReload();
	};

	const handleError = async ({ error, actions }: ErrorResponse) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		if (error.data.error?.type == "fields") actions.setErrors(error.data.error.details);
		else actions.setErrors({ message: ["An error occurred, unable to post an image! Please try again later."] });
	};
</script>
