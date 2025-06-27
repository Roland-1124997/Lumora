<template>
	<div class="w-full h-full max-w-lg mx-auto space-y-8">
		<div class="space-y-2">
			<h1 class="text-4xl font-bold tracking-tight">
				Email Verification
			</h1>
			<p class="text-base text-gray-500">
				Enter the 6-digit code from your email. If you haven't received an email, please check your spam folder or request a new verification email.
			</p>
		</div>

		<FieldFormTotp url="/api/auth/verify/email" :schema="schema" :onSuccess="handleSuccess" :onError="handleError" :back="false"  />
		<UtilsSeparator :line="true" />

	</div>
</template>

<script setup lang="ts">
	import { toTypedSchema } from "@vee-validate/zod";
	import * as zod from "zod";

	useHead({
		htmlAttrs: {
			lang: "en",
		},
	});

	useSeoMeta({
		title: "Lumora - Login",
		description: "Log in to Lumora to explore photos, connect with others, and join the latest moments.",
		ogTitle: "Login to Lumora",
		ogDescription: "Access your Lumora account to view photos, share memories, and stay connected.",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "https://llumora.onrender.com",
		twitterTitle: "Lumora - Login",
		twitterDescription: "Sign in to Lumora to join the conversation and discover the latest posts.",
		twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary",
	});

	definePageMeta({
		layout: "auth",
		middleware: "authorized",
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
		navigateTo(response.status.redirect);
	};

	const handleError = async ({ error, actions }: ErrorResponse) => {
		if (error.data.error?.type == "fields") actions.setErrors(error.data.error.details);

		await new Promise((resolve) => setTimeout(resolve, 3000));
		actions.resetForm();
	};
</script>
