<template>
	<div class="w-full h-full max-w-lg mx-auto space-y-8">
		<div class="space-y-2">
			<h1 class="text-4xl font-bold tracking-tight">Create your Account</h1>
			<p class="text-base text-gray-500">Provide your details to create an account</p>
		</div>

		<FieldFormRegister url="/api/auth/register" :schema="RegisterSchema" :onSuccess="handleSuccess" :onError="handleError" />
		<UtilsSeparator />
		<UtilsButtonGoogle />

		<p class="text-sm text-center text-gray-500 bottom-5">Already have an account?<NuxtLink class="font-bold text-[#817a70] hover:text-[#6e675d]" to="/"> login </NuxtLink></p>
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
		title: "Lumora - Register",
		description: "Create an account on Lumora to explore photos, share memories, and connect with others.",
		ogTitle: "Register on Lumora",
		ogDescription: "Sign up for Lumora to start exploring, sharing, and connecting with the community.",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "https://llumora.onrender.com",
		twitterTitle: "Lumora - Register",
		twitterDescription: "Join Lumora by creating an account to explore the latest posts and share your moments.",
		twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary",
	});

	definePageMeta({
		layout: "auth",
		middleware: "authorized",
	});

	const RegisterSchema = toTypedSchema(
		zod
			.object({
				email: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).email({ message: "Must be a valid email" }),
				password: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).min(8, { message: "Must be at least 8 characters long" }),
				confirmation: zod.string({ message: "This field is required" }),
			})

			.refine((data) => data.password === data.confirmation, {
				message: "Passwords do not match",
				path: ["confirmation"],
			})
	);

	const handleSuccess = async ({ response }: SuccessResponse<null>) => {
		if (response.status.redirect) navigateTo(response.status.redirect);
	};

	const handleError = async ({ error, actions }: ErrorResponse) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		if (error.data.error?.type == "fields") actions.setErrors(error.data.error.details);
	};
</script>
