<template>
	<div class="">
		<section class="">
			<div class="grid w-full grid-cols-2 gap-3 mb-32 h-fit lg:grid-cols-4">
				<div class=" last:pb-16" v-for="i in 12">
					<LazyCardImageSkeleton/>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>

	useHead({
		htmlAttrs: {
			lang: "nl",
		},
	});

	useSeoMeta({
		title: "Lumora - Timeline",
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
		middleware: "unauthorized",
	});
</script>
