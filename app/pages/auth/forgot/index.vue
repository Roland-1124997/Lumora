<template>
	<div class="w-full h-full max-w-lg mx-auto space-y-8">
		<div class="space-y-2">
			<h1 class="text-4xl font-bold tracking-tight">Forgot Password?</h1>
			<p class="text-base text-gray-500">Enter your email address to request a password reset code.</p>
		</div>

		<FieldFormRequestReset url="/api/auth/forgot" :onSuccess="handleSuccess" :onError="handleError" :schema="Schema" />
		<UtilsSeparator :line="true" />

		<p class="text-sm text-center text-gray-500 bottom-5">
			Take me back to <NuxtLink class="font-bold text-[#817a70] hover:text-[#6e675d]" to="/"> login </NuxtLink>
		</p>
	</div>
</template>

<script setup lang="ts">
	import { toTypedSchema } from "@vee-validate/zod";
	import * as zod from "zod";

	definePageMeta({
		layout: "auth",
		middleware: "authorized",
	});

	const Schema = toTypedSchema(
		zod.object({
			email: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).email({ message: "Must be a valid email" }),
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
