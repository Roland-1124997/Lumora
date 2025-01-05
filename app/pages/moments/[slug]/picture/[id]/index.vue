<template>
	<div class="pb-20 ">
		<div class="w-full h-[53vh] overflow-hidden bg-gray-200 md:h-[70vh] rounded-xl mb-4">
			<LazyNuxtImg :src="image.download_url" :alt="image.author" class="z-20 object-cover w-full h-full" />
		</div>
		<div class="p-2 border rounded-xl bg-gray-50">
			{{ image }}

		</div>
	</div>
</template>

<script setup langs="ts">

	definePageMeta({
		middleware: 'unauthorized',
	});

	const id = useRoute().params.id;
	const image = ref({});

	const data = await $fetch(`https://picsum.photos/id/${id}/info`);

	image.value = data;
</script>
