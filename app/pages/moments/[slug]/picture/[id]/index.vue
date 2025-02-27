<template>
	<div class="pb-20">
		<div class="w-full h-[53vh] overflow-hidden bg-gray-200 md:h-[70vh] rounded-xl mb-4">
			<LazyNuxtImg :src="details.url" :alt="details.author.id" class="z-20 object-cover w-full h-full" />
		</div>
		<div class="p-2 border rounded-xl bg-gray-50">
			<button v-if="details.permision.delete" @click="deleteData" class="flex items-center justify-center p-2 px-4 text-white bg-black border border-black rounded-xl w-fit">
				delete
			</button>
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
	const details = ref({});

	const data = await $fetch(`/api/moments/picture/${id}`)
	details.value = data.data[0];

	/*
	************************************************************************************
	*/

	const { removeItemByMetaId } = useGroupStore();

	const deleteData = async () => {
		await $fetch(`/api/moments/picture/${id}`, { method: "DELETE" }).then(() => {
			removeItemByMetaId(details.value.group.id, id);
		}).catch().finally(() => setTimeout(() => useRouter().back(), 500))
	}




</script>
