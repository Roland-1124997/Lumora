<template>
    <div class="w-full h-full max-w-lg mx-auto space-y-8">
		<div class="space-y-2">
			<h1 class="text-4xl font-bold tracking-tight">Two-Factor Authentication</h1>
			<p class="text-base text-gray-500">Enter the 6-digit code from your authenticator</p>
		</div>

        <FieldFormTotp requestUrl="/api/auth/verify/topt/" :schema="schema" :onSuccess="handleSuccess" :onError="handleError" />
        <UtilsSeparator :line="true" />
    </div>
</template>

<script setup lang="ts">

    import { toTypedSchema } from "@vee-validate/zod";
	import * as zod from "zod";

	definePageMeta({
		layout: "auth",
		middleware: "totp-redirecter"
	});

    const schema = toTypedSchema(
		zod.object({
			code: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).min(6, { message: "Must be at least 6 characters long" }).max(6, { message: "Must be at least 6 characters long" }),
		})
	);

	const handleSuccess = async ({ response }: SuccessResponse<null>) => {
		await new Promise((resolve) => setTimeout(resolve, 500));
		if (response.status.redirect) navigateTo(response.status.redirect);
	};

	const handleError = async ({ error, actions }: ErrorResponse) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		if (error.data.error?.type == "fields") actions.setErrors(error.data.error.details);
	};



</script>
