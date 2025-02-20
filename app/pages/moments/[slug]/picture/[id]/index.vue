<template>
	<div class="pb-20">
		<div class="w-full h-[53vh] overflow-hidden bg-gray-200 md:h-[70vh] rounded-xl mb-4">
			<LazyNuxtImg :src="image.url" :alt="image.author_id" class="z-20 object-cover w-full h-full" />
		</div>
		<div class="p-2 border rounded-xl bg-gray-50">
			{{ image }}
		</div>
	</div>
</template>

<script setup langs="ts">
	useHead({
		htmlAttrs: {
			lang: "nl",
		},
	});

	useSeoMeta({
		title: "Lumora - Moments",
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

	const id = useRoute().params.id;
	const image = ref({});

	const data = await $fetch(`/api/moments/picture/${id}`) //await $fetch(`https://picsum.photos/id/${id}/info`);

	image.value = data.data[0];
</script>
