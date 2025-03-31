<template>
	<div></div>
</template>

<script setup>
	useHead({
		htmlAttrs: {
			lang: "en",
		},
	});

	useSeoMeta({
		title: "Lumora - Home",
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
		middleware: "redirect-client",
		layout: false,
	});
</script>
