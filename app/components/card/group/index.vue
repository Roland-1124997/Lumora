<template>
	<div ref="target" class="h-16 pb-2 border-b">
		<NuxtLink :to="`/moments/${group.name.replaceAll(' ', '-')}?id=${group.id}`" class="flex items-center space-x-3">
			<div class="flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-200 rounded-full">
				<LazyNuxtImg v-if="loaded && targetIsVisible" :src="group.thumbnail" alt="image" class="object-cover w-full h-full" />
				<icon v-else class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="1.4em" />
			</div>
			<div class="flex-1 pl-3 border-l">
				<div class="flex justify-between">
					<h3 class="text-lg font-semibold">{{ group.name }}</h3>
					<p class="text-sm text-gray-500">{{ useTimeAgo(group.last_active).value }}</p>
				</div>
				<p class="text-sm text-gray-500">
					<span v-if="group.lastPhotoPostedBy">Laatste foto gepost door: {{ group.lastPhotoPostedBy }}</span>
					<span>Nog een activiteit, kom later terug</span>
				</p>
			</div>
		</NuxtLink>
	</div>
</template>

<script setup lang="ts">
	const target = ref(null);
	const targetIsVisible = useElementVisibility(target);
	const loaded = ref(false);

	const { group } = defineProps({
		group: { type: Object, required: true },
	});

	watch(targetIsVisible, (value) => {
		if (value) {
			setTimeout(() => {
				const imageLoad = new Image();
				imageLoad.src = group.thumbnail;
				imageLoad.onload = () => (loaded.value = true);
			}, 500);
		}
	});

	
</script>
