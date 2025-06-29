<template>
	<div v-if="List">
		<div class="flex items-center justify-between gap-2 mb-3 -mt-4 sm:mt-2 lg:-mt-4">
			<div class="items-center hidden gap-2 md:flex">
				<button :disabled="!accepted" @click="createUploadFunction()" class="flex items-center justify-center w-full gap-2 p-2 px-4 text-[#756145] border border-[#756145] hover:bg-gray-100 disabled:opacity-50 rounded-xl md:w-fit">
					<icon name="ri:image-circle-ai-line" size="1.4em" />
					<span> Create posts </span>
				</button>
				<NuxtLink :to="`/moments/pending-queue/${group_id}`" aria-label="pending-queue" v-if="need_approval && has_permisons" class="flex items-center justify-center gap-2 p-2 text-[#756145] border border-[#756145] hover:bg-gray-100 disabled:opacity-50 rounded-xl w-fit">
					<span v-if="posts_count_need_approval >= 1" :class="posts_count_need_approval > 99 ? ' min-w-[1.90rem]' : ' min-w-5'" class="flex items-center justify-center p-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full min-h-5 h-fit w-fit">
						<span class="-mt-[0.10rem]">{{ posts_count_need_approval > 99 ? "99+" : posts_count_need_approval }}</span>
					</span>
					<icon name="ri:folder-received-fill" size="1.4em" />
				</NuxtLink>
				<button id="download" title="download" @click="handleDownload()" class="flex md:hidden items-center justify-center gap-1 p-2 text-[#756145] border border-[#756145] hover:bg-gray-100 disabled:opacity-50 rounded-xl w-fit">
					<icon name="ri:download-2-fill" size="1.4em" />
				</button>
			</div>

			<button :disabled="!accepted" id="uploadPhoto" title="uploadPhoto" @click="createUploadFunction()" class="flex md:hidden items-center justify-center w-full gap-2 p-2 px-4 text-[#756145] border border-[#756145] hover:bg-gray-100 disabled:opacity-50 rounded-xl md:w-fit">
				<icon name="ri:image-circle-ai-line" size="1.4em" />
				<span> Create posts </span>
			</button>
			<NuxtLink :to="`/moments/pending-queue/${group_id}`" aria-label="pending-queue" v-if="need_approval && has_permisons" class="flex md:hidden items-center justify-center gap-1 p-2 text-[#756145] border border-[#756145] hover:bg-gray-100 disabled:opacity-50 rounded-xl w-fit">
				<span v-if="posts_count_need_approval >= 1" :class="posts_count_need_approval > 99 ? ' min-w-[1.90rem]' : ' min-w-5'" class="flex items-center justify-center p-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full min-h-5 h-fit w-fit">
					<span class="-mt-[0.10rem]">{{ posts_count_need_approval > 99 ? "99+" : posts_count_need_approval }}</span>
				</span>
				<icon name="ri:folder-received-fill" size="1.4em" />
			</NuxtLink>
			<button id="download" title="download" @click="handleDownload()" class="flex md:hidden items-center justify-center gap-1 p-2 text-[#756145] border border-[#756145] hover:bg-gray-100 disabled:opacity-50 rounded-xl w-fit">
				<icon name="ri:download-2-fill" size="1.4em" />
			</button>
			<div class="flex items-center gap-2">
				<button :disabled="reload" id="reload" title="reload" @click="handleManualReload()" class="flex items-center justify-center p-2 px-2 text-white bg-[#756145] border border-[#756145] rounded-xl w-fit">
					<icon :class="reload ? 'animate-spin' : ''" name="ri:refresh-line" size="1.4em" />
				</button>
				<NuxtLink :to="`/moments/settings/${group_id}`" aria-label="settings" class="flex items-center justify-center gap-2 p-2 px-2 text-white bg-[#756145] border border-[#756145] rounded-xl w-fit">
					<icon name="ri:settings-3-fill" size="1.4em" />
				</NuxtLink>
			</div>
		</div>
		<hr class="mb-2" />

		<section v-if="List.length >= 1 && !reload" @scroll="updateScrollPercentage" v-bind="containerProps" :class="PWAInstalled ? 'h-[73dvh]' : 'h-[77dvh] md:h-[74dvh] xl:h-[80dvh]'" class="overflow-y-scroll">
			<div v-bind="wrapperProps" class="grid w-full grid-cols-2 gap-3 pb-10 mb-32 lg:grid-cols-4">
				<div v-for="(content, index) in List" :key="index">
					<LazyCardImage v-if="content" :content="content" :has_interaction />
					<LazyCardImageSkeleton v-else />
				</div>
			</div>
		</section>

		<section v-else :class="PWAInstalled ? 'h-[73dvh]' : 'h-[77dvh] md:h-[74dvh] xl:h-[80dvh]'" class="overflow-y-scroll">
			<div class="grid w-full grid-cols-2 gap-3 mb-4 lg:grid-cols-4">
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
		title: () => `Lumora - Group`,
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
	const group_id = useRoute().params.group_id as string;

	const totalPages = ref(1);
	const Page = ref(1);

	const List = ref<Post[]>([]);
	const name = ref();

	/*
	 ************************************************************************************
	 */

	const { updateGroupValue } = inject<any>("group");
	const { setGroupData, getGroupData, getScrollData, updateGroupData, updateScrollData, removeData } = useGroupStore();

	/*
	 ************************************************************************************
	 */

	const { makeRequest } = useRetryableFetch();
	const pending = useApi<Pending>();

	pending.prepare({
		baseURL: `/api/moments/pending/${group_id}`,
		onSuccess: ({ response }) => {
			accepted.value = response.data.accepted;
			need_approval.value = response.data.need_approval;
			has_permisons.value = response.data.has_permisons;
			has_interaction.value = response.data.has_interaction;
			posts_count_need_approval.value = response.data.posts_count_need_approval;
		},
		onError: ({ error, updated }) => {
			if (!updated) useThrowError(error);
		},
	});

	/*
	 ************************************************************************************
	 */

	const processPostsApiResponse = (data: Ref<ApiResponse<Post[]>>) => {
		const response = data.value;
		totalPages.value = response.pagination?.total || 0;
		name.value = response.meta?.name;

		updateGroupValue(name.value);

		return response;
	};

	const updateListData = (response: ApiResponse<Post[]>, page: number = 1, options: { set?: boolean; update?: boolean; reload?: boolean } = {}) => {
		if (options.reload) {
			List.value = response.data;
			removeData(group_id, { partial: false });
			setTimeout(() => setGroupData(group_id, name.value, page, totalPages.value, List.value), 3000);
		} else if (options.set || page === 1) {
			List.value = response.data;
			removeData(group_id, { partial: true });
			setTimeout(() => setGroupData(group_id, name.value, page, totalPages.value, List.value), 200);
		} else if (options.update || page > 1) {
			if (Array.isArray(response.data)) List.value.push(...response.data);
			setTimeout(() => updateGroupData(group_id, name.value, page, totalPages.value, List.value), 200);
		}
	};

	const useFetchPost = async (options: Record<string, any>, load: Ref<boolean>, timer = 250) => {
		load.value = true;

		if (options.reload) Page.value = 1;
		if (options.update) Page.value += 1;

		const { data } = await makeRequest<Post[]>(`/api/moments/${group_id}`, {
			params: {
				page: Page.value,
			},
		});

		if (data.value) {
			const response = processPostsApiResponse(data as Ref<ApiResponse<Post[]>>);
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
	const has_interaction = ref(true);
	const loading = ref(false);

	const group = getGroupData(group_id);

	if (!group) await useFetchPost({ set: true }, loading);
	else useDisplayStorageData(group);

	await pending.load();

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
			await useFetchPost({ update: true }, loading, 500);
		},
		{ direction: "bottom", distance: 20 }
	);

	watch(scrollPercentage, (percentage) => updateScrollData(group_id, percentage, scrollPixels.value));

	/*
	 ************************************************************************************
	 */

	const handleDownload = async () => {
		addToast({
			message: "Preparing your images for download. This may take a few moments...",
			type: "info",
			duration: 10000,
		});

		const { data, error } = await makeRequest(`/api/moments/download/${group_id}`, {
			responseType: "blob",
		});

		if (data.value) {
			const blob = new Blob([data.value as any], { type: "application/zip" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `${group_id}.zip`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		}

		if (error.value)
			addToast({
				message: "Failed to download images.",
				type: "error",
				duration: 5000,
			});
	};

	const handleManualReload = async () => {
		await useFetchPost({ reload: true }, reload, 2000);
	};

	const reload = ref(false);
	const handleReload = async () => {
		const page = ref(1);
		reload.value = true;

		const group = getGroupData(group_id);

		if (!group) {
			reload.value = false;
			return;
		}

		while (page.value <= group.pagination.page) {
			const { data } = await makeRequest<Post[]>(`/api/moments/${group_id}`, {
				params: {
					page: Page.value,
				},
			});

			if (data.value) {
				const response = processPostsApiResponse(data as Ref<ApiResponse<Post[]>>);
				updateListData(response, page.value);
			}

			page.value++;
		}

		setTimeout(() => (reload.value = false), 2000);
	};

	/*
	 ************************************************************************************
	 */

	const { open } = useModal();
	const { addToast } = useToast();

	const createUploadFunction = () => {
		const { onSuccess } = open({
			type: "images",
			name: "Create experience",
			url: `/api/moments/${group_id}`,
		});

		onSuccess(async () => {
			if (need_approval.value) await pending.reload();
			else await handleReload();

			addToast({
				message: need_approval.value ? "Your image has been submitted for approval." : "Your image has been posted successfully.",
				type: "success",
				duration: 5000,
			});
		});
	};
</script>
