<template>
	<div class="w-full h-full max-w-lg mx-auto space-y-8">
		<div class="space-y-2">
			<h1 class="text-4xl font-bold tracking-tight">Password Change</h1>
			<p class="text-base text-gray-500">Please enter your new password and confirm it to reset your password. Make sure to choose a strong password that you haven't used before.</p>
		</div>

		<FieldFormPasswordReset url="/api/auth/reset-password" :onSuccess="handleSuccess" :onError="handleError" :schema="Schema" />
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
			password: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).min(8, { message: "Must be at least 8 characters long" }),
			confirmation: zod.string({ message: "This field is required" }),
		})
		.refine((data) => data.password === data.confirmation, {
			message: "Passwords do not match",
			path: ["confirmation"],
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
