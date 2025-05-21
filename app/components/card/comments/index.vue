<template>
	<div class="p-4 bg-gray-100 rounded-lg">
		<div class="flex items-center gap-2 pb-2 border-b border-gray-200">
			<img :src="content.author.url" :alt="content.author.name" class="object-cover w-8 h-8 border rounded-full" />

			<div class="flex items-center justify-between w-full gap-2">
				<div class="text-sm font-semibold text-gray-800">
					{{ content.author.name }}
				</div>
				<p class="text-xs text-gray-800">
					{{ useDateFormat(content.created_at, "DD-MM-YYYY - HH:mm") }}
				</p>
			</div>
		</div>
		<p class="pb-2 mt-1 text-sm text-gray-700 text-balance">{{ content.content.text }}</p>
        
		<div class="flex items-center justify-end pt-2 mt-2 border-t border-gray-200 ">
			<div class="flex items-center justify-end gap-2">
				<button v-if="content.author.is_owner || permisions.can_delete_message" @click="onDelete(content.id)" class="flex items-center gap-2 p-2 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
					<Icon name="ri:close-circle-line" size="1.2rem" />
				</button>
				<button v-if="content.author.is_owner" @click="onEdit(content.id)" class="flex items-center gap-2 p-2 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
					<Icon name="ri:edit-2-line" size="1.2rem" />
				</button>
				<button v-if="!content.author.is_owner" @click="onReply(content.id)" class="flex items-center gap-2 p-2 pr-3 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
					<Icon name="ri:reply-line" size="1.2rem" />
					<span class="text-sm font-semibold text-white">Reply</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		content: { type: Object, required: true },
        permisions: { type: Object, required: true },
		onDelete: { type: Function, required: true },
		onEdit: { type: Function, required: true },
		onReply: { type: Function, required: true },
	});
</script>
