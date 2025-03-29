<template>
	<FieldFormBaseLayer class="mb-5" :callback :requestUrl :onSuccess :onError :method :schema label="Upload">
		<template v-slot="{ errors }">
			<div class="py-3 mt-5 border-y h-fit">
				<FieldInputMultipleImages label="images" name="images" />
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
		method: { type: String, default: "POST" },
	});

	const schema = toTypedSchema(
		zod.object({
			images: zod.array(
				zod.instanceof(File)
				.refine((file) => file.size <= 10 * 1024 * 1024, {message: "File size must not exceed 10MB",})
				.refine((file) => ["image/png", "image/jpeg"].includes(file.type), {message: "Only PNG or JPEG files are allowed",})
			)
			.min(1, { message: "You must upload at least one image" }) 
			.max(4, { message: "Maximum of 4 images allowed" })
			.or(zod.literal(undefined).transform(() => [])),
		})
	);
</script>
