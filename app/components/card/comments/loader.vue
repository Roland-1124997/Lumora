<template>
	<div v-if="loading" class="relative flex flex-col items-start gap-2 pl-3 mb-2 rounded-lg">
		<div class="absolute left-0 w-[0.20rem] bg-gray-100 rounded-full top-0 bottom-0"></div>
		<div class="w-full">
			<div class="p-3 bg-gray-100 rounded-lg">
				<div class="flex items-center gap-2 rounded-lg">
					<div class="z-10 object-cover w-8 h-8 bg-gray-300 border border-gray-200 rounded-full"></div>
					<span class="w-20 h-3 bg-gray-300"> </span>
					<span class="w-10 h-3 bg-gray-300"> </span>
				</div>
				<p class="w-full h-4 mt-3 bg-gray-200"></p>
				<p class="w-4/5 h-4 mt-3 bg-gray-200"></p>
				<div class="flex items-center justify-end gap-2 pt-2 mt-2"></div>
			</div>
		</div>
	</div>

	<div v-else-if="comments.length == 0" class="text-gray-500">
		<p class="text-sm">No comments yet</p>
	</div>
</template>

<script setup lang="ts">
    defineProps({
        loading: { type: Boolean, default: false },
        comments: { type: Array, default: () => [] },
    });

</script>
