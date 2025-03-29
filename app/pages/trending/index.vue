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
                <div :class="PWAInstalled ? 'last:pb-[8.5rem] md:last:pb-20' : 'last:pb-16 md:last:pb-20'" v-for="(content, index) in List" :key="index">
                    <LazyCardImage v-if="content" :content="content" />
                    <LazyCardImageSkeleton v-else />
                </div>
            </div>
		</section>

		<section v-else class="h-[80vh] overflow-y-auto">
			<div class="grid w-full grid-cols-2 gap-3 mb-[4.3rem] lg:grid-cols-4">
				<div class="" v-for="i in 8">
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
		title: "Lumora - Timeline",
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

	const useFetchData = async (options: Record<string, any>, load: Ref, timer = 250) => {
		load.value = true;
		if (options.reload) Page.value = 1;
		if (options.update) Page.value += 1;

		List.value = List.value.filter((item: any) => item.placeholder == undefined);

		const { data: response, error} = await useFetch(`/api/trending?page=${Page.value}`)

		if(error.value) throw createError({
			statusCode: error.value.data.status.code,
			message: error.value.data.status.message,
			fatal: true,
		});
		
		totalPages.value = response.value.pagination?.total || 0;
		if (options.set) List.value = response.value.data as Post[];
		if (options.update) List.value.push(...(response.value.data as Post[]));
		if (options.reload) List.value = response.value.data as Post[];

		setTimeout(() => (load.value = false), timer)

	};

	const loading = ref(false);
	await useFetchData({ set: true }, loading);
	
	/*
	 ************************************************************************************
	 */

	const { containerProps, wrapperProps } = useVirtualList(List, { itemHeight: 0, overscan: 10 });
	const { scrollPercentage, scrollToTop, scrollToBottom, updateScrollPercentage } = useScroller(containerProps.ref);

	useInfiniteScroll(
		containerProps.ref,
		async () => {
			if (Page.value >= totalPages.value || loading.value) return;
			await useFetchData({ update: true }, loading);
		},
		{ direction: "bottom", distance: 20 }
	);

	/*
	 ************************************************************************************
	 */

	const reload = ref(false);
	const handleManualReload = async () => await useFetchData({ reload: true }, reload, 2000);

</script>
