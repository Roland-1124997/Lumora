<template>
	<div class="w-full h-full max-w-lg mx-auto space-y-8">
		<div class="space-y-2">
			<h1 class="text-4xl font-bold tracking-tight">Create your Account</h1>
			<p class="text-base text-gray-500">Provide your details to create an account</p>
		</div>

		<FieldFormRegister requestUrl="/api/auth/register" :schema="LoginSchema" :onSuccess="handleSuccess" :onError="handleError" />
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
			lang: "nl",
		},
	});

	useSeoMeta({
		title: "Lumora - Register",
		description: "Bekijk de nieuwste en populairste posts op Lumora!",
		ogTitle: "Lumora",
		ogDescription: "Bekijk de nieuwste en populairste posts op Lumora!",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "/",
		twitterTitle: "Lumora",
		twitterDescription: "Bekijk de nieuwste en populairste posts op Lumora!",
		twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary",
	});
	
	definePageMeta({
		layout: "auth",
		middleware: "authorized",
	});

	const LoginSchema = toTypedSchema(
		zod.object({
			email: zod.string({ message: "Dit is een verplicht veld" }).nonempty({ message: "Dit is een verplicht veld" }).email({ message: "Moet een correcte email zijn" }),
			wachtwoord: zod.string({ message: "Dit is een verplicht veld" }).nonempty({ message: "Dit is een verplicht veld" }).min(8, { message: "Moet minimaal 8 lang zijn" }),
			confirmatie: zod.string({ message: "Dit is een verplicht veld" })
		})

		.refine((data) => data.wachtwoord === data.confirmatie, {
            message: "Wachtwoorden komen niet overheen",
            path: ["confirmatie"],
        })
	);

	const handleSuccess = async ({ response }: SuccessResponse) => {
		if (response.meta.redirect) navigateTo(response.meta.redirect);
	};

	const handleError = async ({ error, actions }: ErrorResponse) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		if (error.data.errors.field) actions.setErrors(error.data.errors.field);
	};

	
</script>
