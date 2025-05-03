<template>
	<FieldFormBaseLayer :requestUrl :onSuccess :onError :method :schema label="Login">
		<div class="space-y-4">
			<FieldInputEmail name="email" placeholder="Enter your email" required :initialValue />
			<FieldInputPassword name="password" placeholder="Enter your password" required enableToggle />
		</div>

		<div class="flex justify-between">
			<FieldInputCheckBox name="remember" label="Remember me" :initialValue />
			<NuxtLink class="text-sm font-medium text-[#817a70] hover:text-[#6e675d]" to="/"> Forgot Password? </NuxtLink>
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

	const remember = useLocalStorage("user-email", undefined) as Ref<string | undefined>;

	const initialValue = computed(() => {
		return remember.value;
	});
</script>
