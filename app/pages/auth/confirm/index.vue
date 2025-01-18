<template>
	<div class="flex flex-col space-y-5">
		<h1 class="text-2xl font-semibold">Confirm your email</h1>
		<p class="text-sm text-gray-500">We have sent you an email with a confirmation link. Please check your email and click on the link to confirm your email address.</p>
		<div class="flex items-center space-x-3">
			<icon name="ri:mail-fill" size="2em" />
			<p class="text-sm text-gray-500">Didn't receive the email? <NuxtLink class="font-medium text-[#817a70] hover:text-[#6e675d]" to="/">Resend</NuxtLink></p>
		</div>
	</div>
</template>

<script setup>
	useHead({
		htmlAttrs: {
			lang: "nl",
		},
	});

	useSeoMeta({
		title: "Lumora - Login",
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
</script>
