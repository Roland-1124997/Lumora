<template>
	<div class="relative text-sm">
		<NuxtLink :to class="flex items-center justify-center gap-2 p-2 border rounded-xl bg-gray-50 hover:bg-gray-100">
			<img v-if="options.url" :src="options.url" class="w-5 h-5 font-medium text-gray-500 rounded-full"></img>
			<icon v-else :name="iconName" class="text-gray-400" size="1.2rem" />
			<span v-if="options.name" :class="options.always ? 'flex' : 'hidden md:flex' " class="font-medium text-gray-500 ">{{ options.name }}</span>
		</NuxtLink>
		<span v-if="options.count >= 1" class="absolute right-0 inline-flex items-center justify-center p-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full min-h-5 min-w-5 h-fit w-fit -top-1">
			{{ options.count > 99 ? "99+" : options.count }}
		</span>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		to: { type: String, required: true },
		iconName: { type: String, default: "arrow-left" },
		options: { type: Object, default: () => ({
			notificationCount: undefined,
			name: undefined,
			url: undefined,
			always: true
		}) },
	});
</script>

<style scoped>
	.router-link-active {
		@apply bg-gray-200 text-gray-500;
	}
</style>
