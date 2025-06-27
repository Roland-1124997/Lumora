<template>
	<FieldFormBaseLayer :url :onSuccess :onError :method :schema label="Change Password">
		<div class="space-y-4">
			<FieldInputPassword name="password" placeholder="Enter your new password" required rerender enableToggle />
			<FieldInputPassword name="confirmation" label="Confirmation" placeholder="Confirm your password" required rerender enableToggle />
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
