<template>
	<FieldFormBaseLayer class="mb-5" :callback :requestUrl :onSuccess :onError :method :resize :schema :label="type.split(':')[1] == 'approve' ? 'Approve image' : 'Reject image'">
		<template v-slot="{ errors }">
			<div class="py-3 mt-5 border-y h-fit">
				<div class="flex flex-col items-center justify-center w-full h-full gap-5 my-6">
					<icon class="text-[#756145]" :name=" type.split(':')[1] == 'approve' ? 'ri:information-2-line' : 'ri:alert-line'" size="8em" />
					<h1 v-if="type.split(':')[1] == 'approve'" class="text-lg font-bold text-center text-balance">Approve this image?</h1>

					<h1 v-else class="text-lg font-bold text-center text-balance">Reject this image?</h1>

					<p v-if="type.split(':')[1] == 'approve'" class="-mt-5 text-center text-balance">Are you sure you want to approve this image?</p>
					<p v-else class="-mt-5 text-center text-balance">Are you sure you want to reject this image?</p>

					<p class="text-center text-red-700">
						{{ errors.message }}
					</p>
				</div>
			</div>
		</template>
	</FieldFormBaseLayer>
</template>

<script setup lang="ts">
	import { toTypedSchema } from "@vee-validate/zod";
	import * as zod from "zod";

	const { requestUrl, onSuccess, onError, method, type } = defineProps({
		callback: { type: Function, required: false },
		requestUrl: { type: String, required: true },
		onSuccess: { type: Function, required: true },
		onError: { type: Function, required: true },
		method: { type: String, default: "PATCH" },
		type: { type: String, required: true },
		resize: { type: Boolean, default: false },
	});

	const schema = toTypedSchema(
		zod.object({
			has_been_accepted: zod.boolean().default(type.split(':')[1] == 'approve'),
		})
	);
</script>
