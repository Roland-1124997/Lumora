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
		title: "Lumora",
		description: "Discover and share stunning photos in groups on Lumora. Join the creative community today.",
		ogTitle: "Lumora - Photo Sharing in Groups",
		ogDescription: "Connect through photography. Share your moments, join groups, and explore inspiring images.",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "/",
		twitterTitle: "Lumora - Share Photos",
		twitterDescription: "Join Lumora to share photos, explore groups, and connect with a creative community.",
		twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary",
	});

	definePageMeta({
		middleware: "redirect-client",
		layout: false,
	});
</script>
