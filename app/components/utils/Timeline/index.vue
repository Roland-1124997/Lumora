<template>
	<div class="relative">
		<div v-if="!loading && content.length >= 1" id="line" class="sticky top-0 z-10 w-1 h-full bg-gray-100 left-6"></div>
		<div v-for="(group, groupIndex) in content" :key="group.date" class="mb-2">
			<div :class="PWAInstalled ? 'top-[13.85vh] md:top-[7.95vh]' : 'top-[13.4vh] md:top-[7.95vh]'" class="sticky z-40 flex items-center justify-between px-4 py-3 mb-3 text-lg font-bold text-gray-700 border rounded-xl bg-gray-50">
				<div class="flex items-center justify-center gap-2">
					<div class="flex z-40 justify-center flex-shrink-0 w-8 -ml-[0.35rem]">
						<div class="flex items-center justify-center w-8 h-8 text-white bg-[#756145] border-2 border-gray-100 rounded-full">
							<Icon name="ri:time-line" size="1.4rem" />
						</div>
					</div>
					<h2>{{ group.date }}</h2>
				</div>
				<h3 class="text-sm font-normal text-gray-600">Count({{ group.items.length }})</h3>
			</div>
			<div class="z-40 space-y-4">
				<div class="absolute top-0 z-20 w-1 h-full bg-gray-100 left-6"></div>
				<div v-for="(log, logIndex) in group.items" :key="log.id" class="relative flex items-start gap-3 md:gap-4">
					<div class="z-30 flex justify-center flex-shrink-0 w-8 ml-[0.65rem]">
						<div class="flex items-center justify-center bg-white border-2 rounded-full w-9 h-9 aspect-square border-gray-50">
							<Icon :class="actionStyles[log.action_type].color" :name="actionStyles[log.action_type].icon" size="1.8rem" />
						</div>
					</div>
					<div :ref="groupIndex === content.length - 1 && logIndex === group.items.length - 1 ? 'reference' : ''" class="flex-1 rounded-xl">
						<CardLog :content="log" />
					</div>
				</div>
				
			</div>
		</div>
		<div v-if="!hidden" class="flex justify-end w-full mt-3">
			<button :disabled="loading" id="loadMoreItems" title="loadMoreItems" @click="loadMoreItems" class="flex w-[78vw] md:w-[68vw] items-center justify-center gap-2 p-2 px-3 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
				<icon v-if="loading" class="animate-spin" size="1.25rem" name="ri:refresh-line" />
				<span v-else> Load more logs</span>
			</button>
		</div>
		
	</div>
</template>

<script setup lang="ts">

	const { onLastItemVisible } = defineProps<{
		onLastItemVisible: () => Promise<void>
		content: Array<any>
		loading: boolean,
		hidden: boolean,
	}>()

	const { PWAInstalled } = inject<any>("PWA");
	const loading = ref(false)

	const reference = ref(null)
	const targetIsVisible = useElementVisibility(reference);

	watch(targetIsVisible, async (value) => {
		if(value) await loadMoreItems()
	})

	const loadMoreItems = async () => {
		loading.value = true
		setTimeout( async () => {
			await onLastItemVisible()
			loading.value = false
		}, 500)
	}

	const actionStyles: any = {
		created: { icon: "ri:checkbox-circle-fill", color: "bg-green-500" },
		deleted: { icon: "ri:close-circle-fill", color: "bg-red-500" },
		updated: { icon: "ri:information-2-fill", color: "bg-blue-500" },
	};
</script>
