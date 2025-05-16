<template>
    <div class="w-full h-full max-w-lg mx-auto space-y-8">
		<div class="space-y-2">
			<h1 class="text-4xl font-bold tracking-tight">Two-Factor Authentication</h1>
			<p class="text-base text-gray-500">Enter the 6-digit code from your authenticator</p>
		</div>

        <FieldFormTotp requestUrl="/api/auth/verify/topt" :schema="schema" :onSuccess="handleSuccess" :onError="handleError" />
        <UtilsSeparator :line="true" />
		
		<p v-if="succeded" class="text-sm text-center text-gray-500 bottom-5">Not redirected yet? <NuxtLink class="font-bold text-[#817a70] hover:text-[#6e675d]" to="/moments">Tap here to speed things up!</NuxtLink></p>
    </div>
</template>

<script setup lang="ts">

    import { toTypedSchema } from "@vee-validate/zod";
	import * as zod from "zod";

	definePageMeta({
		layout: "auth",
		middleware: "totp-redirecter"
	});

	const store = useSessionsStore()
	const succeded = ref(false)
	
    const schema = toTypedSchema(
		zod.object({
			code: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).min(6, { message: "Must be at least 6 characters long" }).max(6, { message: "Must be at least 6 characters long" }),
		})
	);

	const handleSuccess = async ({ response }: SuccessResponse<null>) => {

		await new Promise((resolve) => setTimeout(resolve, 1000));

		await $fetch('/api/user').then((response) => {
			store.setSession(response.data, null)
			succeded.value = true
			navigateTo(response.status.redirect);
		})
		.catch(() => store.setSession(null, true))
		
	}

	const handleError = async ({ error, actions }: ErrorResponse) => {
		await new Promise((resolve) => setTimeout(resolve, 500));
		if (error.data.error?.type == "fields") actions.setErrors(error.data.error.details);
		
		await new Promise((resolve) => setTimeout(resolve, 2000));
		actions.resetForm()
	};
	
</script>
