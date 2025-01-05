<template>
	<div ref="target" class="border-b">
		<div class="w-full h-40 overflow-hidden bg-gray-200 md:h-52 rounded-xl">
			<div class="relative z-40 flex items-center justify-between p-2">
				<button @click="likeImage" class="relative z-50 w-11 flex items-center justify-between p-[0.30rem] text-black bg-white border rounded-lg">
					<icon :class="liked ? ' bg-red-600' : ''" :name="liked ? 'ri:heart-fill' : 'ri:heart-line'" size="1.1em" />
					<span class="text-xs font-medium">{{ hearts }}</span>
				</button>
			</div>

			<NuxtLink v-if="loaded && targetIsVisible" :to="`${$route.path}/picture/${image.id}`">
				<LazyNuxtImg :src="image.download_url" :alt="image.author" class="object-cover w-full h-full -mt-[2.83rem] md:-mt-[2.75rem]" />
			</NuxtLink>
			<div class="flex items-center justify-center w-full h-full -mt-[2.83rem] md:-mt-[2.75rem]" v-else>
				<icon class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="2em" />
			</div>
		</div>

		<div class="py-2">
			<p class="text-sm text-gray-500">
				By <span class="font-semibold">{{ image.author }}</span>
			</p>
			<p class="text-sm text-gray-500">2 hours ago</p>
		</div>
	</div>
</template>

<script setup lang="ts">
	const target = ref(null);
	const targetIsVisible = useElementVisibility(target);

	const { image } = defineProps({
		image: { type: Object, required: true },
	});

	const hearts = ref(0);
	const liked = ref(false);
	const loaded = ref(false);

	watch(targetIsVisible, (value) => {
		if (value) {
			setTimeout(() => {
				const imageLoad = new Image();
				imageLoad.src = image.download_url;
				imageLoad.onload = () => (loaded.value = true);
			}, 500);
		}
	});

	const likeImage = () => {
		if (liked.value) {
			hearts.value -= 1;
			liked.value = false;
			return;
		}
		liked.value = true;
		hearts.value += 1;
	};
</script>
