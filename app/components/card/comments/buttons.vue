<template>
	<div v-if="pagination.total > 1" class="flex items-center w-full gap-2 mt-2">
		<button @click="goToPage(pagination.page - 1)" :disabled="pagination.page === 1" class="flex items-center justify-center gap-2 p-2 px-2 text-sm text-white bg-[#756145] disabled:opacity-80 border border-[#756145] rounded-xl">
			<Icon name="ri:arrow-left-s-line" size="1.2rem" />
		</button>

		<button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[page === pagination.page ? 'bg-gray-200' : '']" class="flex items-center justify-center w-full gap-2 p-2 px-4 text-sm text-black border border-gray-200 rounded-xl">
			{{ page }}
		</button>

		<button @click="goToPage(pagination.page + 1)" :disabled="pagination.page === pagination.total" class="flex items-center justify-center gap-2 p-2 px-2 text-sm text-white bg-[#756145] disabled:opacity-80 border border-[#756145] rounded-xl">
			<Icon name="ri:arrow-right-s-line" size="1.2rem" />
		</button>
	</div>
</template>

<script setup lang="ts">
	const pagination = defineModel({
		type: Object,
		default: () => ({
			page: 1,
			total: 1,
		}),
	});

	const visiblePages = computed(() => {
		const max = 5;
		const pages = [];
		let start = Math.max(1, pagination.value.page - Math.floor(max / 2));
		let end = Math.min(pagination.value.total, start + max - 1);

		if (end - start < max - 1) start = Math.max(1, end - max + 1);
		for (let i = start; i <= end; i++) pages.push(i);

		return pages;
	});

	const router = useRouter();

	const goToPage = (page: number) => {
		if (pagination.value.page <= pagination.value.total) {
			pagination.value.page = page;

			router.replace({
				query: {
					...router.currentRoute.value.query,
					page: page,
				},
			});
		} else {
			pagination.value.page = pagination.value.total;

			router.replace({
				query: {
					...router.currentRoute.value.query,
					page: page,
				},
			});
		}
	};
</script>
