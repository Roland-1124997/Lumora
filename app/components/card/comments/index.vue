<template>
    <div :class="!isChild ? 'p-4 bg-gray-100' : 'pl-4 py-4 '" class="relative flex flex-col items-start gap-2 mb-2 rounded-lg">
        <div class="absolute left-0 w-[0.20rem] bg-gray-200 rounded-full top-4 bottom-4"></div>
        <div :id="content.id" class="w-full">
            <div class="flex items-center gap-2 rounded-lg">
                <img v-if="content.author.url" :src="content.author.url" :alt="content.author.name" class="z-10 object-cover w-8 h-8 border border-gray-200 rounded-full" />
                <span class="text-sm font-semibold text-gray-800 text-balance">{{ content.author.name }}</span>
                <span class="text-xs text-gray-500">
                    <UtilsTime :date="content.created_at" />
                </span>
            </div>
            <p class="mt-2 text-sm text-gray-700">{{ content.content.text }}</p>
            <div v-if="content.deleted" class="flex items-center justify-end gap-2 pt-2 mt-2 "></div>
            <div v-else class="flex items-center justify-end gap-2 pt-2 mt-2 border-t border-gray-200">
                <button v-if="content.author.is_owner || permisions.can_delete_message" @click="onDelete(content)" class="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 transition bg-gray-300 rounded hover:text-gray-700 hover:bg-gray-200">
                    <Icon name="ri:close-circle-line" size="1.1rem" />
                </button>
                <button v-if="content.author.is_owner" @click="onEdit(content)" class="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 transition bg-gray-300 rounded hover:text-gray-700 hover:bg-gray-200">
                    <Icon name="ri:edit-2-line" size="1.1rem" />
                    <span>Edit</span>
                </button>
                <button v-if="!content.author.is_owner" @click="onReply(content)" class="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 transition bg-gray-300 rounded hover:text-gray-700 hover:bg-gray-200">
                    <Icon name="ri:reply-line" size="1.1rem" />
                    <span>Reply</span>
                </button>
            </div>
            <div v-if="content.related && content.related.length" class="-mt-2">
                <CardComments
                    v-for="reply in content.related"
                    :key="reply.id"
                    :content="reply"
                    :permisions="permisions"
                    :onDelete="onDelete"
                    :onEdit="onEdit"
                    :onReply="onReply"
                    :isChild="true"
                />
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
    isChild: { type: Boolean, default: false },
});

</script>