<template>
	<div>
		<div v-if="details?.url" class="pb-20">
			<div class="w-full h-[53vh] overflow-hidden bg-gray-200 md:h-[70vh] rounded-xl mb-4">
				<LazyNuxtImg :src="details?.url" :alt="details?.author?.id" class="z-20 object-cover w-full h-full" />
			</div>
			<div class="p-2 border rounded-xl bg-gray-50">
				<button v-if="details?.permision?.delete" @click="deleteData" class="flex items-center justify-center p-2 px-4 text-white bg-black border border-black rounded-xl w-fit">delete</button>
			</div>
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

	/*
	 ************************************************************************************
	 */

	const { updateGroupValue } = inject("group");
	const group_id = useRoute().params.group_id;
	const image_id = useRoute().params.image_id;
	const details = ref();

	await $fetch(`/api/moments/${group_id}/${image_id}`).then((response) => {
		details.value = response.data[0];
		updateGroupValue(details.value.group.name);
	}).catch((error) => {

		throw createError({
            statusCode: error.data.meta.code,
            message: error.data.meta.message,
            fatal: true,
        })

	});

	/*
	 ************************************************************************************
	 */

	const { setGroupData, getGroupData, updateGroupData, removeData, removeItemByMetaId } = useGroupStore();

	const group = getGroupData(group_id);

	const page = ref(1);
	const total = ref()
	const list = ref();
	const name = ref()

	const deleteData = async () => {
		await $fetch(`/api/moments/${group_id}/${image_id}`, { method: "DELETE" }).then(async () => {
			removeItemByMetaId(group_id, image_id);
			list.value = null;

			while (page.value <= group.pagination.page) {
				await $fetch(`/api/moments/${group_id}?page=${page.value}`).then((response) => {

					total.value = response.pagination.total;
					name.value = response.meta.name

					if (page.value === 1) {
						list.value = response.data;
						removeData(group_id, { partial: true });
						setTimeout(() => setGroupData(group_id, name.value, page.value, total.value, list.value), 200);
					} else {
						list.value.push(...response.data);
						setTimeout(() => updateGroupData(group_id, name.value, page.value, total.value, list.value), 200);
					}
				});

				
				if (page.value < total.value) page.value++; 
				else break; 
				
			}
		}).catch(() => {})
		.finally(() => setTimeout(() => navigateTo(`/moments/${group_id}`), 500));
	};

</script>
