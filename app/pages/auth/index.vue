<template>
	<div class="w-full h-full max-w-lg mx-auto space-y-8">
		<div class="space-y-2">
			<h1 class="text-4xl font-bold tracking-tight">Sign in to your Account</h1>
			<p class="text-base text-gray-500">Enter your email and password to log in</p>
		</div>

		<FieldFormAuth requestUrl="/api/auth" :schema="LoginSchema" :onSuccess="handleSuccess" :onError="handleError" />
		<UtilsSeparator />
		<UtilsButtonGoogle />
		
		<p class="text-sm text-center text-gray-500 bottom-5">Don't have an account?<NuxtLink class="font-bold text-[#817a70] hover:text-[#6e675d]" to="/auth/register"> Sign Up </NuxtLink></p>
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
		ogUrl: "/",
		twitterTitle: "Lumora - Login",
		twitterDescription: "Sign in to Lumora to join the conversation and discover the latest posts.",
		twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary_large_image",
	});


	definePageMeta({
		layout: "auth",
		middleware: "authorized",
	});

	const LoginSchema = toTypedSchema(
		zod.object({
			email: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).email({ message: "Must be a valid email" }),
			password: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).min(8, { message: "Must be at least 8 characters long" }),
			remember: zod.boolean().optional(),
		})
	);
	
	const handleSuccess = async ({response}: SuccessResponse<null>) => {
		if (response.status.redirect) navigateTo(response.status.redirect);
	};

	const handleError = async ({ error, actions }: ErrorResponse) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		if(error.data.error?.type == "fields") actions.setErrors(error.data.error.details);
	};

	
</script>
