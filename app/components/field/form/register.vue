<template>
	<FieldFormBaseLayer :requestUrl :onSuccess :onError :method :schema label="Register">
		<div class="space-y-4">
			<FieldInputEmail name="email" placeholder="Enter your email" :required="true" />
			<FieldInputPassword name="password" placeholder="Enter your password" :required="true" :enableToggle="true" />
			<FieldInputPassword name="confirmation" label="Confirmation" placeholder="Confirm your password" :required="true" :enableToggle="true" />
		</div>
	</FieldFormBaseLayer>
</template>

<script setup lang="ts">
	const { requestUrl, onSuccess, onError, method } = defineProps({
		requestUrl: { type: String, required: true },
		onSuccess: { type: Function, required: true },
		onError: { type: Function, required: true },
		method: { type: String, default: "POST" },
		schema: { type: Object, required: true },
	});
</script>
