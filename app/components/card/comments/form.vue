<template>
	<div class="sticky -top-[0.80rem] pt-1 z-40 pb-3 bg-white">
		<div class="items-center justify-between w-full gap-2 mt-1 mb-1 md:flex">
			<div class="hidden md:block">
				<h2 class="mb-3 text-xl font-semibold">Comments</h2>
				<p class="mb-2 -mt-4">Join the conversation</p>
			</div>
			<div class="flex items-center justify-end gap-2">
				<button class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
					<Icon :class="isAnimating ? 'animate-like' : ''" name="ri:message-3-line" size="1.2rem" />
					<UtilsCounter :count="count" />
				</button>
				<button @click="reload()" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
					<icon :class="loading ? ' animate-spin' : ''" name="ri:refresh-line" size="1.4em" />
				</button>
				<button @click="open({})" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
					<icon name="ri:send-plane-fill" size="1.4em" />
				</button>
			</div>
			<div class="-mt-6 md:hidden ">
				<h2 class="mb-3 text-xl font-semibold">Comments</h2>
				<p class="mb-2 -mt-4">Join the conversation</p>
			</div>
		</div>
		<CardCommentsButtons v-model="pagination" />
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

	defineProps({
		placeholder: { type: String, default: "Leave an message" },
		count: { type: Number, default: 0 },
		isAnimating: { type: Boolean, default: false },
		loading: { type: Boolean, default: false },
		reload: { type: Function, required: true },
		open: { type: Function, required: true },
	});

</script>
