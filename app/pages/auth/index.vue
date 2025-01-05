<template>
	<div class="w-full h-full max-w-lg mx-auto space-y-8">
		<div class="space-y-2">
			<h1 class="text-4xl font-bold tracking-tight">Sign in to your Account</h1>
			<p class="text-base text-gray-500">Enter your email and password to log in</p>
		</div>

		<FieldFormAuth type="login" requestUrl="/api/auth" :schema="LoginSchema" :onSuccess="handleSuccess" :onError="handleError" />

		<div class="relative">
			<div class="absolute inset-0 flex items-center">
				<div class="w-full border-t border-gray-200"></div>
			</div>
			<div class="relative flex justify-center text-sm">
				<span class="px-4 text-gray-500 bg-white">Or</span>
			</div>
		</div>

		<!-- <button class="flex items-center justify-center w-full h-12 gap-3 text-base border border-gray-300 rounded-full hover:bg-gray-50">
			<icon name="devicon:google" size="1.2rem"></icon>
			Continue with Google
		</button> -->

		<div class="space-x-3">
			<ClientOnly>
				<div class="flex items-center justify-center w-full">
					<GoogleLogin :callback="handleGoogleSuccess" :buttonConfig="{ logo_alignment: 'center', width: '360', text: 'continue_with', shape: 'circle' }" />
				</div>

				<template #fallback>
					<div class="flex items-center justify-center w-full">
						<button class="flex items-center justify-center w-[360px] h-10 gap-3 text-base border border-gray-300 rounded-full hover:bg-gray-50">
							<icon name="devicon:google" size="1.2rem"></icon>
							Continue with Google
						</button>
					</div>
				</template>
			</ClientOnly>
		</div> 

		<p class="text-sm text-center text-gray-500 bottom-5">Don't have an account?<NuxtLink class="font-medium text-[#817a70] hover:text-[#6e675d]" to="/"> Sign Up </NuxtLink></p>
	</div>
</template>

<script setup>
	import { toTypedSchema } from "@vee-validate/zod";
	import * as zod from "zod";

	definePageMeta({
		layout: "auth",
		middleware: "authorized",
	});

	const LoginSchema = toTypedSchema(
		zod.object({
			email: zod.string({ message: "Dit is een verplicht veld" }).nonempty({ message: "Dit is een verplicht veld" }).email({ message: "Moet een correcte email zijn" }),
			wachtwoord: zod.string({ message: "Dit is een verplicht veld" }).nonempty({ message: "Dit is een verplicht veld" }).min(8, { message: "Moet minimaal 8 lang zijn" }),
			remember: zod.boolean().optional(),
		})
	);

	const handleSuccess = async ({ response }) => {
		await new Promise((resolve) => setTimeout(resolve, 500));
		navigateTo(response.redirect);
	};

	const handleError = async ({ error, actions }) => {
		const errors = error.data.data;
		actions.setErrors(errors);
	};

	const handleGoogleSuccess = async (response) => {
		await $fetch("/api/auth/google/identity", { method: "POST", body: response }).then((response) => {
			navigateTo(response.redirect);
		});
	};
</script>

