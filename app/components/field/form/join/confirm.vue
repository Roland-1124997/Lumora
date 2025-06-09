<template>
	<FieldFormBaseLayer class="mb-5" :callback :url :onSuccess :onError :method :resize :schema label="Confirm">
		<template v-slot="{ errors }">
			<div class="py-3 mt-5 border-y h-fit">
				<div class="flex flex-col items-center justify-center w-full h-full gap-5 my-6">
					<icon class="text-[#756145]" name="ri:information-2-line" size="8em" />

					<h1 class="text-lg font-bold text-center text-balance">Accept invite request</h1>

					<p class="-mt-5 text-center text-balance">Allows the user to access this group and interact with others</p>
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

	const { url, onSuccess, onError, method } = defineProps({
		callback: { type: Function, required: false },
		url: { type: String, required: true },
		onSuccess: { type: Function, required: true },
		onError: { type: Function, required: true },
		method: { type: String, default: "PATCH" },
		type: { type: String, required: true },
		resize: { type: Boolean, default: false },
	});

	const schema = toTypedSchema(zod.object({}));
</script>
