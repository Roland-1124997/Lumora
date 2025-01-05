<template>
	<div>
		<div class="flex items-center gap-2 mb-3 -mt-4">
			<input type="text" placeholder="Search..." class="flex-grow w-full p-2 border border-gray-300 outline-none appearance-none rounded-xl focus:ring-2" />
			<button class="flex items-center justify-center p-2 px-2 text-white bg-black border border-black rounded-xl w-fit">
				<icon name="ri:add-circle-line" size="1.4em" />
			</button>
		</div>
		<hr class="mb-3" />
		<section @scroll="updateScrollPercentage" v-bind="containerProps" class="overflow-y-auto h-[80vh]">
			<div v-bind="wrapperProps" class="flex flex-col w-full gap-3">
				<div :id="`${index}`" class="last:pb-[9.6rem]" v-for="(group, index) in List" :key="index">
					<CardGroup :group="group" />
				</div>
			</div>
			<UtilsButtonScroller :totalPages="totalPages" :loading="loading" :scrollPercentage="scrollPercentage" :scrollToTop="() => scrollToTop('smooth')" :scrollToBottom="() => scrollToBottom('smooth')" :Page="Page" />
		</section>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: "unauthorized",
	});

	const List: any = ref([]);
	const loading = ref(false);

	const totalPages = ref(0);
	const Page = ref(1);

	const { data }: any = await useFetch("/api/moments");
	List.value = data.value.groups;
	totalPages.value = data.value?.totalPages;

	const { containerProps, wrapperProps } = useVirtualList(List, {
		itemHeight: 0,
		overscan: 10,
	});

	const { scrollPercentage, scrollToTop, scrollToBottom, updateScrollPercentage } = useScroller(containerProps.ref);

	useInfiniteScroll(
		containerProps.ref,
		async () => {
			if (Page.value >= totalPages.value || loading.value) return;
			loading.value = true;

			Page.value += 1;
			const data: any = await $fetch(`/api/moments?page=${Page.value}`);

			setTimeout(() => {
				loading.value = false;
				List.value.push(...data.groups);
				totalPages.value = data.totalPages;
				scrollPercentage.value = scrollPercentage.value / 2;
			}, 1000);
		},
		{ direction: "bottom", distance: 20 }
	);
</script>
