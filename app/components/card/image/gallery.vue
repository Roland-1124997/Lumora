<template>
	<div>
		<h2 class="mb-4 text-xl font-semibold">You might also like</h2>
		<p class="mb-2 -mt-4">Explore more posts from this author</p>

		<div :class="pane <= 38.5 ? 'grid-cols-2' : 'grid-cols-3'" class="grid gap-2 mt-4">
			<div v-for="item in content" :key="item.post_data.id" class="flex-shrink-0 w-full h-full overflow-hidden bg-gray-200 border rounded-md aspect-square snap-start">
				<button @click="$router.replace(`/moments/${id}/${item.post_data.id}`)" v-if="loaded">
					<img :src="item.post_data?.media?.url" :alt="item.post_data?.media?.id" class="object-cover w-full h-full aspect-square" />
				</button>
				<div v-else class="flex items-center justify-center flex-shrink-0 w-full h-full overflow-hidden bg-gray-200 border rounded-md aspect-square snap-start">
					<icon class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="2em" />
				</div>
			</div>
			<div v-for="n in 6 - content.length" :key="'loader-' + n" class="flex items-center justify-center flex-shrink-0 w-full h-full overflow-hidden bg-gray-200 border rounded-md aspect-square snap-start">
				<icon class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="2em" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		content: { type: Object, required: true },
		loaded: { type: Boolean, required: true },
		id: { type: [String, Number], required: true },
		pane: { type: Number, default: 60 },
	});
</script>
