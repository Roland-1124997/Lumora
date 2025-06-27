<template>
	<FieldFormBaseLayer :url :onSuccess :onError :method :schema label="Reset password">
		<div class="space-y-4">
			<FieldInputEmail name="email" placeholder="Enter your email" required />
		</div>
	</FieldFormBaseLayer>
</template>

<script setup lang="ts">

	const { url, onSuccess, onError, method } = defineProps({
		url: { type: String, required: true },
		onSuccess: { type: Function, required: true },
		onError: { type: Function, required: true },
		method: { type: String, default: "POST" },
		schema: { type: Object, required: true },
	});

</script>
