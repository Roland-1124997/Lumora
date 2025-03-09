<template>
	<div class="container max-w-6xl mx-auto -mt-4 mb-36 md:mb-auto">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="pl-3 border-l">
				<div class="hidden w-full gap-2 mb-4 overflow-scroll md:flex">
					<button :disabled="content.author.is_owner" @click="likeImage" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-black border border-black rounded-xl">
						<Icon :name="content.has_liked ? 'ri:heart-fill' : 'ri:heart-line'" size="1.2rem" />
						{{ content.likes.count }}
					</button>
					<button v-if="content?.permision?.delete" @click="deleteData" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-black border border-black rounded-xl">
						<Icon name="ri:delete-bin-5-line" size="1.2rem" />
					</button>
					<a download target="_blank" :href="content?.media?.url" class="flex items-center justify-center gap-2 p-2 px-4 text-sm border border-black rounded-xl">Download</a>
					<button class="flex items-center justify-center w-full gap-2 p-2 px-4 text-sm border border-black rounded-xl">Comment</button>
				</div>
				<div class="relative w-full h-fit max-h-[78vh] overflow-hidden bg-gray-200 border rounded-lg bg-background">
					<img :src="content?.media?.url" class="object-cover w-full h-full" />
				</div>
			</div>

			<div class="pl-3 border-l">
				<div class="flex w-full gap-2 mb-2 overflow-scroll md:hidden">
					<button :disabled="content.author.is_owner" @click="likeImage" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-black border border-black rounded-xl">
						<Icon :name="content.has_liked ? 'ri:heart-fill' : 'ri:heart-line'" size="1.2rem" />
						{{ content.likes.count }}
					</button>
					<button v-if="content?.permision?.delete" @click="deleteData" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-black border border-black rounded-xl">
						<Icon name="ri:delete-bin-5-line" size="1.2rem" />
					</button>
					<a download target="_blank" :href="content?.media?.url" class="flex items-center justify-center gap-2 p-2 px-4 text-sm border border-black rounded-xl">Download</a>
					<button class="flex items-center justify-center w-full gap-2 p-2 px-4 text-sm border border-black rounded-xl">Comment</button>
				</div>

				<hr class="mt-4 mb-2 md:hidden" />

				<div>
					<h2 class="mb-4 text-xl font-semibold">You might also like</h2>
					<p class="mb-2 -mt-4">explore more post from this author</p>

					<div class="grid grid-cols-3 gap-2 mt-4">
						<NuxtLink :to="`/moments/${group_id}/${content.id}`" v-for="content in content.more_from_author" class="flex-shrink-0 overflow-hidden border rounded-md aspect-square w-fit h-fit snap-start">
							<img :src="content?.media?.url" class="object-cover w-full h-full aspect-square" />
						</NuxtLink>
					</div>
				</div>

				<div class="w-full">
					<hr class="my-2 mt-4" />
					<h2 class="mb-3 text-xl font-semibold">Comments</h2>

					<p class="p-4 mb-2 bg-gray-100 rounded-md">laat een bericht achter</p>
				</div>
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
	const content = ref();

	await $fetch(`/api/moments/${group_id}/${image_id}`)
		.then((response) => {
			content.value = response.data;
			updateGroupValue(response.meta.name);
		})
		.catch((error) => {
			throw createError({
				statusCode: error.data.status.code,
				message: error.data.status.message,
				fatal: true,
			});
		});

	/*
	 ************************************************************************************
	 */

	const { setGroupData, getGroupData, updateGroupData, removeData, removeItemByMetaId } = useGroupStore();

	const group = getGroupData(group_id);

	const page = ref(1);
	const total = ref();
	const list = ref();
	const name = ref();

	const deleteData = async () => {
		await $fetch(`/api/moments/${group_id}/${image_id}`, { method: "DELETE" })
			.then(async () => {
				removeItemByMetaId(group_id, image_id);
				list.value = null;

				while (page.value <= group.pagination.page) {
					await $fetch(`/api/moments/${group_id}?page=${page.value}`).then((response) => {
						total.value = response.pagination.total;
						name.value = response.meta.name;

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
			})
			.catch(() => {})
			.finally(() => setTimeout(() => navigateTo(`/moments/${group_id}`), 500));
	};

	/*
	 ************************************************************************************
	 */

	const { updateItemByMetaId } = useGroupStore();

	const likeImage = async () => {
		const group_id = useRoute().params.group_id;

		await $fetch(`/api/moments/${group_id}/${content.value.id}`, { method: "PATCH" }).then((response) => {
			content.value.likes.count = response.data.likes.count;
			content.value.has_liked = response.data.has_liked;

			updateItemByMetaId(group_id, content.value.id, {
				has_liked: content.value.has_liked,
				likes: { count: content.value.likes.count },
			});
		});
	};
</script>
