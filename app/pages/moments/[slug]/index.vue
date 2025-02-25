<template>
	<div class="">
		<div class="flex items-center gap-2 mb-3 -mt-4">
			<input type="text" placeholder="Search..." class="flex-grow w-full p-2 border border-gray-300 outline-none appearance-none rounded-xl focus:ring-2" />
			<button :disabled="reload" @click="reloadList()" class="flex items-center justify-center p-2 px-2 text-white bg-black border border-black rounded-xl w-fit">
				<icon :class="reload ? 'animate-spin' : ''" name="ri:reset-left-line" size="1.4em" />
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
				<div class="" v-for="i in 16">
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
		middleware: ["unauthorized", "allowed"],
	});

	const id = useRoute().query.id;
	const slug = useRoute().params.slug;

	const List = ref();
	const Page = ref(1);

	const totalPages = ref(1);
	const loading = ref(false);
	const reload = ref(false);

	const { getGroupData, getScrollData, setGroupData, updateGroupData, updateScrollData, removeData } = useGroupStore();

	const group = getGroupData(id);
	const scrollData = getScrollData(id);

	if (!group) {
		setTimeout(async () => {
			await $fetch(`/api/moments/${id}?slug=${slug}&page=${Page.value}`)
				.then((data) => {
					totalPages.value = data.pagination.total;
					List.value = data.data;
					setGroupData(id, Page.value, totalPages.value, data.data);
				})
				.catch(() => {});
		}, 5000);
	} else {
		totalPages.value = group.pagination.total;
		List.value = group.data;
		Page.value = group.pagination.page;
	}

	const { containerProps, wrapperProps } = useVirtualList(List, {
		itemHeight: 0,
		overscan: 10,
	});

	const { scrollPercentage, scrollPixels, scrollToTop, scrollToBottom, updateScrollPercentage } = useScroller(containerProps.ref);

	onMounted(() => {
		if (scrollData) {
			scrollPercentage.value = scrollData.percentage;
			scrollPixels.value = scrollData.pixels;

			const container = containerProps.ref.value;
			const scrollPosition = (scrollPixels.value / 100) * scrollData.percentage;

			container.scrollTo({
				top: scrollPosition,
				behavior: "auto",
			});
		}
	});

	useInfiniteScroll(
		containerProps.ref,
		async () => {
			if (Page.value >= totalPages.value || loading.value) return;

			loading.value = true;
			Page.value += 1;

			await $fetch(`/api/moments/${id}?slug=${slug}&page=${Page.value}`)
				.then((data) => {
					List.value.push(...data.data);
					totalPages.value = data.pagination.total;
					updateGroupData(id, Page.value, totalPages.value, List.value);
				})
				.catch(() => {})
				.finally(() => {
					setTimeout(() => (loading.value = false), 250);
				});
		},
		{ direction: "bottom", distance: 20 }
	);

	watch(scrollPercentage, (percentage) => {
		updateScrollData(id, percentage, scrollPixels.value);
	});

	const handleSuccess = async ({ response }) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		if (response.meta.redirect) navigateTo(response.meta.redirect);
		if (response.meta.refresh) reloadList();
	};

	const reloadList = () => {
		reload.value = true;
		removeData(id);
		setTimeout(async () => {
			await $fetch(`/api/moments/${id}?slug=${slug}&page=1`)
				.then((data) => {
					totalPages.value = data.pagination.total;
					List.value = data.data;
					setGroupData(id, 1, totalPages.value, List.value);
					reload.value = false;
				})
				.catch(() => {});
		}, 2000);
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
