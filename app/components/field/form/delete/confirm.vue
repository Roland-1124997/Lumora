<template>
	<FieldFormBaseLayer class="mb-5" :callback :requestUrl :onSuccess :onError :method :schema label="Confirm">
		<template v-slot="{ errors }">
			<div class="py-3 mt-5 border-y h-fit">
				<div class="flex flex-col items-center justify-center w-full h-full gap-5 my-6">
					<icon class="text-[#756145]" name="ri:alert-line" size="8em" />
					<h1 v-if=" type.split(':')[1] == 'account'" class="text-lg font-bold text-center text-balance">
						Delete your account?
					</h1>
					<h1 v-else class="text-lg font-bold text-center text-balance">
						Delete this {{type.split(":")[1]}}?
					</h1>
					
					<p class="-mt-5 text-center text-balance ">
						This is a permanent action that cannot be undone.
					</p>
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

	const { requestUrl, onSuccess, onError, method } = defineProps({
		callback: { type: Function, required: false },
		requestUrl: { type: String, required: true },
		onSuccess: { type: Function, required: true },
		onError: { type: Function, required: true },
		method: { type: String, default: "DELETE" },
		type: { type: String, required: true }
	});

	const schema = toTypedSchema(
		zod.object({})
	);
</script>
