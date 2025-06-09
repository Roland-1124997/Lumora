<template>
	<div class="w-full h-full max-w-lg mx-auto space-y-8">
		<div class="space-y-2">
			<h1 class="text-4xl font-bold tracking-tight">Two-Factor Authentication</h1>
			<p class="text-base text-gray-500">Enter the 6-digit code from your authenticator</p>
		</div>

		<FieldFormTotp url="/api/auth/verify/topt" :schema="schema" :onSuccess="handleSuccess" :onError="handleError" />
		<UtilsSeparator :line="true" />

		<p v-if="succeded" class="text-sm text-center text-gray-500 bottom-5">Not redirected yet? <NuxtLink class="font-bold text-[#817a70] hover:text-[#6e675d]" to="/moments">Tap here to speed things up!</NuxtLink></p>
		<p v-else class="text-sm text-center text-gray-500 bottom-5">
			<span class="font-bold text-[#817a70] hover:text-[#6e675d]">Quick tip:</span>
			{{ tips[currentTip] }}
		</p>
	</div>
</template>

<script setup lang="ts">
	import { toTypedSchema } from "@vee-validate/zod";
	import * as zod from "zod";

	definePageMeta({
		layout: "auth",
		middleware: "totp-redirecter",
	});

	const tips = ["If you are using a password manager, you can copy the code from your authenticator app and paste it.", "Authenticator apps like Google Authenticator or Authy work offline.", "Codes refresh every 30 seconds, so make sure to enter the latest one.", "If you change phones, transfer your authenticator accounts before resetting your old device."];

	const currentTip = ref(0);

	onMounted(() => {
		setInterval(() => {
			currentTip.value = (currentTip.value + 1) % tips.length;
		}, 15000);
	});

	const { makeRequest } = useRetryableFetch();
	const store = useSessionsStore();
	const succeded = ref(false);

	const schema = toTypedSchema(
		zod.object({
			code: zod.string({ message: "Invalid TOPT code entered" }).nonempty({ message: "Invalid TOPT code entered" }).min(6, { message: "Incomplete TOPT code entered" }).max(6, { message: "Invalid TOPT code entered" }),
		})
	);

	const handleSuccess = async ({ response }: SuccessResponse<null>) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const { data, error } = await makeRequest<User>("/api/user")

		if(data.value) {
			store.setSession(data.value.data, null);
			succeded.value = true;
			navigateTo(data.value.status.redirect);
		}

		if(error.value) store.setSession(null, true)

	};

	const handleError = async ({ error, actions }: ErrorResponse) => {
		if (error.data.error?.type == "fields") actions.setErrors(error.data.error.details);

		await new Promise((resolve) => setTimeout(resolve, 3000));
		actions.resetForm();
	};
</script>
