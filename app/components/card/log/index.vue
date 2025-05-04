<template>
	<div class="">
		<div class="flex items-end justify-between">
			<div class="flex items-start gap-2">
				<img class="mt-1 rounded-full w-7 h-7 aspect-square" :src="content.performed_by.url" />
				<div>
					<p class="text-sm font-semibold text-gray-900">
						{{ content.performed_by.name }}
					</p>
					<p class="-mt-[0.20rem] text-sm font-medium text-gray-600">
						{{ content.message }}
					</p>
				</div>
			</div>

			<div class="text-sm text-gray-500">{{ useDateFormat(content.timestamp, "HH:mm") }}</div>
		</div>
		<hr class="mt-2" />

		<div class="p-3 mt-2 bg-gray-100 rounded-md">
			<div class="flex items-center justify-between">
				<h1 class="text-sm font-bold text-gray-700">Additional information</h1>
				<button v-if="content.context" @click="isDropdownOpen = !isDropdownOpen">
					<icon :name="isDropdownOpen ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" size="1.4rem" />
				</button>
			</div>

			<div v-for="(value, key) in content.context" :key="key" class="text-gray-500">
				<p v-if="isDropdownOpen">
					<strong>{{ key }}: </strong>
					<span class="truncate">{{ value }}</span>
				</p>
			</div>
			
			<span class="text-gray-500" v-if="!content.context"> 
				<strong>No content</strong>
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		content: { type: Object, required: true },
	});

	const isDropdownOpen = ref(true);
</script>
