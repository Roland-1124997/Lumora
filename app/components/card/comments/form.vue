<template>
	<div class="sticky -top-[0.80rem] pt-1 z-40 pb-3 bg-white">
		<div class="flex items-center justify-between w-full gap-2 mt-1 mb-1">
			<div>
				<h2 class="mb-3 text-xl font-semibold">Comments</h2>
				<p class="mb-2 -mt-4">Join the conversation</p>
			</div>
			<div class="flex items-center gap-2">
				<button class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
					<Icon :class="isAnimating ? 'animate-like' : ''" name="ri:message-3-line" size="1.2rem" />
					<UtilsCounter :count="count" />
				</button>
				<button @click="reload()" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
					<icon :class="loading ? ' animate-spin' : ''" name="ri:refresh-line" size="1.4em" />
				</button>
			</div>
		</div>
		<form @submit.prevent="sumbitData(comment)">
			<div class="flex items-start justify-center gap-2">
				<textarea v-model="comment" :placeholder="placeholder" ref="editable" class="w-full resize-none p-4 bg-gray-100 rounded-xl outline-none appearance-none h-[6.5rem] focus:border focus:border-black"></textarea>
				<button class="flex items-center justify-center p-[0.85rem] text-sm text-white bg-[#756145] rounded-xl">
					<Icon name="ri:send-plane-fill" size="1.4rem" />
				</button>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
	const comment = ref("");
	const editable = ref<HTMLTextAreaElement | null>(null);

	const { onSubmit } = defineProps({
		placeholder: { type: String, default: "Leave an message" },
		count: { type: Number, required: true },
		isAnimating: { type: Boolean, default: false },
		onSubmit: { type: Function, required: true },
		loading: { type: Boolean, default: false },
		reload: { type: Function, required: true },
	});

	const sumbitData = async (text: string) => {
		let internal_text = text || editable.value?.value;

		if (typeof internal_text === "string" && internal_text.trim().length > 0) {
			await onSubmit(internal_text).then(() => {
				if (editable.value) editable.value.value = "";
				comment.value = "";
			});
		}
	};

	defineExpose({ editable });
</script>
