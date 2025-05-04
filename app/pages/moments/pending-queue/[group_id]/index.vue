<template>
	<div v-if="List">
		<div class="flex items-center justify-between gap-2 mb-3 -mt-4">

			<div class="items-center hidden gap-2 md:flex ">
				<button :disabled="!has_pinned || List.length < 1 || reload" @click="approvePinned" class="flex items-center justify-center w-full gap-2 p-2 px-4 text-[#756145] border border-[#756145] hover:bg-gray-100 disabled:hover:bg-white disabled:opacity-50 rounded-xl md:w-fit">
					<icon name="ri:checkbox-circle-line" size="1.2em" />
					<span> Approve ({{ pinned_count }})</span>
				</button>

				<button :disabled="!has_pinned || List.length < 1 || reload" @click="rejectPinned" class="flex items-center justify-center w-full gap-2 p-2 px-4 text-[#756145] border border-[#756145] hover:bg-gray-100 disabled:hover:bg-white disabled:opacity-50 rounded-xl md:w-fit">
					<icon name="ri:indeterminate-circle-line" size="1.2em" />
					<span> Reject all ({{ pinned_count }})</span>
				</button>
			</div>

			<button :disabled="!has_pinned || List.length < 1 || reload" @click="approvePinned" class="flex md:hidden items-center justify-center w-full gap-1 p-2 px-1 text-[#756145] border border-[#756145] hover:bg-gray-100 disabled:hover:bg-white disabled:opacity-50 rounded-xl md:w-fit">
				<icon name="ri:checkbox-circle-line" size="1.2em" />
				<span> Approve ({{ pinned_count }})</span>
			</button>

			<button :disabled="!has_pinned || List.length < 1 || reload" @click="rejectPinned" class="flex md:hidden items-center justify-center w-full gap-1 p-2 px-1 text-[#756145] border border-[#756145] hover:bg-gray-100 disabled:hover:bg-white disabled:opacity-50 rounded-xl md:w-fit">
				<icon name="ri:indeterminate-circle-line" size="1.2em" />
				<span> Reject ({{ pinned_count }}) </span>
			</button>
			
			<div class="flex items-center gap-2 ">
				<button :disabled=" reload" @click="handleManualReload()" class="flex items-center justify-center p-2 px-2 text-white bg-[#756145] border border-[#756145] rounded-xl w-fit">
					<icon :class=" reload ? 'animate-spin' : ''" name="ri:refresh-line" size="1.4em" />
				</button>
				<NuxtLink :to="`/moments/settings/${group_id}`" class="flex items-center justify-center gap-2 p-2 px-2 text-white bg-[#756145] border border-[#756145] rounded-xl w-fit">
					<icon name="ri:settings-3-fill" size="1.4em" />
				</NuxtLink>
				
			</div>
		</div>
		<hr class="mb-2" />

		<section v-if="List.length >= 1 && !reload" @scroll="updateScrollPercentage" v-bind="containerProps" class=" h-[80vh] overflow-y-scroll">
			<div v-bind="wrapperProps" class="grid w-full grid-cols-2 gap-3 pb-10 mb-32 lg:grid-cols-4">
				<div :class="PWAInstalled ? 'last:pb-24 pb:last:mb-8' : 'last:pb-4 md:last:pb-8'" v-for="(content, index) in List" :key="index">
					<LazyCardImage v-if="content" :content="content" :methods="[() => approveImage(content), () => rejectImage(content)]"  />
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
		title: "Lumora - Pending group queue",
		description: "View shared photos and stories in this Lumora group. Connect, comment, and be inspired.",
		ogTitle: "Lumora - Explore This Group",
		ogDescription: "Dive into the latest posts and moments shared in this Lumora group.",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "/",
		twitterTitle: "Lumora - Pending group queue",
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
	const { setItemToStart } = useGroupStore();
	const { getPinnedList, clearPinned } = usePinStore();
	const { makeRequest, data } = useRetryableFetch<ApiResponse<Post[]>>();

	const pinned_count = computed(() => {
		return getPinnedList(group_id).details.length;
	});

	const has_pinned = computed(() => {
		return getPinnedList(group_id).details.length > 0;
	});

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
			
		} else if (options.set || page === 1) {
			List.value = response.data as Post[];
			
		} else if (options.update || page > 1) {
			if (Array.isArray(response.data)) List.value.push(...response.data);
		}
	};

	const useFetchData = async (options: Record<string, any>, load: Ref, timer = 250) => {
		load.value = true;

		if (options.reload) Page.value = 1;
		if (options.update) Page.value += 1;

		await makeRequest(`/api/moments/${group_id}?page=${Page.value}&pending=true`, { sessions: options.reload || options.update });

		if (data.value) {
			const response = processPostsApiResponse(data);
			updateListData(response, Page.value, options);
		}

		setTimeout(() => (load.value = false), timer);
	};

	/*
	 ************************************************************************************
	 */

	const accepted = ref(false);
	const need_approval = ref(false);
	const has_permisons = ref(false);
	const loading = ref(false);

	await useFetchData({ set: true }, loading);

	await $fetch(`/api/moments/pending/${group_id}`)
		.then((response) => {
			accepted.value = response.data.accepted;
			need_approval.value = response.data.need_approval;
			has_permisons.value = response.data.has_permisons;
		})
		.catch((error) => {});

	/*
	 ************************************************************************************
	 */

	const { containerProps, wrapperProps } = useVirtualList(List, { itemHeight: 0, overscan: 10 });
	const { scrollPercentage,  scrollToTop, scrollToBottom, updateScrollPercentage } = useScroller(containerProps.ref);

	useInfiniteScroll(
		containerProps.ref,
		async () => {
			if (Page.value >= totalPages.value || loading.value) return;
			await useFetchData({ update: true }, loading, 500);
		},
		{ direction: "bottom", distance: 20 }
	);

	
	/*
	 ************************************************************************************
	 */

	const { updateModalValue } = inject<any>("modal");
	const { addToast } = useToast();
	
	const approveImage = async (image: any) => {

		const handleApproveSuccess = async ({ response }: SuccessResponse<Post>) => {
		
			await handleReload();
			clearPinned(group_id)
			if(data.value) setItemToStart(group_id, {
				...image, has_been_accepted: true,
			});

			addToast({
				message: `Image approved successfully!`,
				type: "success",
				duration: 5000,
			});
		
		};

		const handleApproveError = async ({ error, actions }: ErrorResponse) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			if (error.data.error?.type == "fields") actions.setErrors(error.data.error.details);
			else actions.setErrors({ message: ["An error occurred, unable to approve the image! Please try again later."] });
		};

		updateModalValue({
			open: true,
			type: "image:approve",
			name: "Alert",
			requestUrl: `/api/moments/pending/${group_id}/${image.id}`,
			onSuccess: handleApproveSuccess,
			onError: handleApproveError,
		});
	}

	/*
	 ************************************************************************************
	 */

	const rejectImage = async (image: any) => {
		
		const handleRejectSuccess = async ({ response }: SuccessResponse<Post>) => { 
			await handleReload()
			clearPinned(group_id)

			addToast({
				message: `Image rejected successfully!`,
				type: "success",
				duration: 5000,
			});
		};
			
		const handleRejectError = async ({ error, actions }: ErrorResponse) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			if (error.data.error?.type == "fields") actions.setErrors(error.data.error.details);
			else actions.setErrors({ message: ["An error occurred, unable to approve the image! Please try again later."] });
		};
		
		updateModalValue({
			open: true,
			type: "image:reject",
			name: "Alert",
			requestUrl: `/api/moments/pending/${group_id}/${image.id}`,
			onSuccess: handleRejectSuccess,
			onError: handleRejectError,
		});
		
	}

	/*
	 ************************************************************************************
	 */

	const approvePinned = async () => {

		const handleAllApproveSuccess = async ({ response }: SuccessResponse<Post>) => { 
			await handleReload()

			getPinnedList(group_id).details.forEach((image: any) => {
				setItemToStart(group_id, {
					...image, has_been_accepted: true,
				});
			});

			clearPinned(group_id);

			addToast({
				message: `Images approved successfully!`,
				type: "success",
				duration: 5000,
			});
		};
			
		const handleAllApproveError = async ({ error, actions }: ErrorResponse) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			if (error.data.error?.type == "fields") actions.setErrors(error.data.error.details);
			else actions.setErrors({ message: ["An error occurred, unable to approve the images! Please try again later."] });
		};
		
		updateModalValue({
			open: true,
			type: "images:multiple:approve",
			name: "Alert",
			requestUrl: `/api/moments/pending/marked/${group_id}`,
			onSuccess: handleAllApproveSuccess,
			onError: handleAllApproveError,
		});

	}

	/*
	 ************************************************************************************
	 */

	const rejectPinned = async () => {
		
		const handleAllRejectSuccess = async ({ response }: SuccessResponse<Post>) => { 
			await handleReload()
			clearPinned(group_id)

			addToast({
				message: `Images rejected successfully!`,
				type: "success",
				duration: 5000,
			});
		};
			
		const handleAllRejectError = async ({ error, actions }: ErrorResponse) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			if (error.data.error?.type == "fields") actions.setErrors(error.data.error.details);
			else actions.setErrors({ message: ["An error occurred, unable to reject the images! Please try again later."] });
		};
		
		updateModalValue({
			open: true,
			type: "images:multiple:reject",
			name: "Alert",
			requestUrl: `/api/moments/pending/marked/${group_id}`,
			onSuccess: handleAllRejectSuccess,
			onError: handleAllRejectError,
		});
	}


	/*
	 ************************************************************************************
	 */

	const reload = ref(false);

	const handleReload = async () => {
		const page = ref(1);
		reload.value = true;
		
		while (page.value <= totalPages.value) {
			await makeRequest(`/api/moments/${group_id}?page=${page.value}&pending=true`, { sessions: true });

			if (data.value) {
				const response = processPostsApiResponse(data);
				updateListData(response, page.value);
			}

			if (page.value < totalPages.value) page.value++;
			else break;
		}

		reload.value = false;
	};

	const handleManualReload = async () => {
		await useFetchData({ reload: true }, reload, 2000);
	};

	/*
	 ************************************************************************************
	 */

	
</script>
