<template>
	<section class="h-[60vh] md:h-[65vh] flex items-start justify-center overflow-hidden">
		<div v-if="loading" class="flex flex-col items-center justify-center w-full h-full gap-5">
			<icon class="text-gray-500 animate-spin" name="ri:loader-2-line" size="5em" />
			<h1 class="mt-5 text-center text-balance">Searching...</h1>
		</div>
		<div v-else class="flex flex-col items-center justify-center w-full h-full gap-5">
			<slot></slot>
		</div>
	</section>
</template>

<script setup lang="ts">
	defineProps<{
		loading: boolean;
	}>();
</script>
