<template>
	<div class="">
		<div class="flex items-center gap-2 mb-3 -mt-4">
			<input type="text" placeholder="Search..." class="flex-grow w-full p-2 border border-gray-300 outline-none appearance-none rounded-xl focus:ring-2" />
			<button @click="createFunction('Upload')" class="flex items-center justify-center p-2 px-2 text-white bg-black border border-black rounded-xl w-fit">
				<icon name="ri:add-circle-line" size="1.4em" />
			</button>
			<button @click="createFunction('Settings')" class="flex items-center justify-center p-2 px-2 text-white bg-black border border-black rounded-xl w-fit">
				<icon name="ri:settings-3-fill" size="1.4em" />
			</button>
		</div>
		<hr class="mb-2" />
		<section @scroll="updateScrollPercentage" v-bind="containerProps" class="h-[80vh] overflow-y-auto">
			<div v-bind="wrapperProps" class="grid w-full grid-cols-2 gap-3 mb-32 lg:grid-cols-4">
				<div class="last:pb-16" v-for="(image, index) in List" :key="index">
					<LazyCardImage :image="image" />
				</div>
			</div>
		</section>
		<UtilsButtonScroller :totalPages :loading :scrollPercentage :scrollToTop="() => scrollToTop('auto')" :scrollToBottom="() => scrollToBottom('auto')" :Page />
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

	const id = useRoute().query.id;
	const name = useRoute().params.slug;

	const List = ref([]);
	const Page = ref(1);

	const totalPages = ref(50);
	const loading = ref(false);

	const { getGroupData, getScrollData, setGroupData, updateGroupData, updateScrollData } = useGroupStore();

	const group = getGroupData(name);
	const scrollData = getScrollData(name);

	if (!group) {
		const data = await $fetch(`https://picsum.photos/v2/list?page=${Page.value}&limit=8`);
		setGroupData(name, Page.value, data);
		List.value = data;
	} else {
		List.value = group.list;
		Page.value = group.page;
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
			const data = await $fetch(`https://picsum.photos/v2/list?page=${Page.value}&limit=8`);

			setTimeout(() => {
				loading.value = false;
				List.value.push(...data);
				updateGroupData(name, Page.value, List.value);
			}, 750);
		},
		{ direction: "bottom", distance: 20 }
	);

	watch(scrollPercentage, (percentage) => {
		updateScrollData(name, percentage, scrollPixels.value);
	});

	const { modal, updatemodalValue } = inject("modal");
	const createFunction = (name) => {
		updatemodalValue({
			open: true,
			type: name,
		});
	};
</script>
