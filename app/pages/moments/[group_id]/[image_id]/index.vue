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
					<a target="_parent" download :href="content?.media?.url" class="flex items-center justify-center gap-2 p-2 px-4 text-sm border border-black rounded-xl">Download</a>
					<button class="flex items-center justify-center w-full gap-2 p-2 px-4 text-sm border border-black rounded-xl">Comment</button>
				</div>
				<div class="relative flex items-center justify-center w-full h-fit aspect-square min-h-[51vh] max-h-[78vh] md:h-[78vh] overflow-hidden bg-gray-200 border rounded-lg bg-background">
					<img v-if="loaded" :src="content?.media?.url" class="object-cover w-full h-full" />
					<icon v-else class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="5em" />
				</div>
			</div>

			<div class="pl-3 border-l">
				<div class="flex w-full gap-2 mb-2 md:hidden">
					<button :disabled="content.author.is_owner" @click="likeImage" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-black border border-black rounded-xl">
						<Icon :name="content.has_liked ? 'ri:heart-fill' : 'ri:heart-line'" size="1.2rem" />
						{{ content.likes.count }}
					</button>
					<button v-if="content?.permision?.delete" @click="deleteData" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-black border border-black rounded-xl">
						<Icon name="ri:delete-bin-5-line" size="1.2rem" />
					</button>

					<a v-if="!PWAInstalled" target="_parent" download :href="content?.media?.url" class="flex items-center justify-center gap-2 p-2 px-4 text-sm border border-black rounded-xl">Download</a>
					<div v-else class="relative group">
						<button disabled class="flex items-center justify-center gap-2 p-2 px-4 text-sm border border-black disabled:bg-gray-200 rounded-xl">Download</button>
						<div class="absolute z-50 hidden px-4 py-1 text-xs text-center text-white transition duration-200 ease-in-out transform -translate-y-full bg-black rounded-md w-44 -top-3 group-hover:block">
							<p class="text-center p-[0.45em]">
								<span class="font-semibold text-balance"> Currently not supported on PWAs! </span>
							</p>
							<div class="absolute w-3 h-3 bg-black transform rotate-45 -bottom-[0.44em] left-5 -translate-x-1/2"></div>
						</div>
					</div>

					<button class="flex items-center justify-center w-full gap-2 p-2 px-4 text-sm border border-black rounded-xl">Comment</button>
				</div>

				<hr class="mt-4 mb-2 md:hidden" />

				<div>
					<h2 class="mb-4 text-xl font-semibold">You might also like</h2>
					<p class="mb-2 -mt-4">explore more post from this author</p>

					<div class="grid grid-cols-3 gap-2 mt-4">
						<NuxtLink v-if="loaded" :to="`/moments/${group_id}/${content.post_data.id}`" v-for="content in content.more_from_author" class="flex-shrink-0 overflow-hidden bg-gray-200 border rounded-md aspect-square w-fit h-fit snap-start">
							<img :src="content.post_data?.media?.url" class="object-cover w-full h-full aspect-square" />
						</NuxtLink>

						<div v-else v-for="content in content.more_from_author" class="flex items-center justify-center flex-shrink-0 w-full h-full overflow-hidden bg-gray-200 border rounded-md aspect-square snap-start">
							<icon class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="2em" />
						</div>

						<div v-for="content in 3 - content.more_from_author.length" class="flex items-center justify-center flex-shrink-0 w-full h-full overflow-hidden bg-gray-200 border rounded-md aspect-square snap-start">
							<icon v-if="!loaded" class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="2em" />
						</div>
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

	const loaded = ref(false);

	setTimeout(() => {
		loaded.value = true;
	}, 1500);

	/*
	 ************************************************************************************
	 */

	const PWAInstalled = ref(false);
	const { $pwa } = useNuxtApp();

	PWAInstalled.value = $pwa.isPWAInstalled ? true : false;
	
	const { setGroupData, getGroupData, updateGroupData, removeData, removeItemByMetaId } = useGroupStore();

	const { updateGroupValue } = inject("group");
	const group_id = useRoute().params.group_id;
	const image_id = useRoute().params.image_id;
	const content = ref();

	const group = getGroupData(group_id);

	await $fetch(`/api/moments/${group_id}/${image_id}`)
		.then((response) => {
			content.value = response.data;
			updateGroupValue(response.meta.name);
		})
		.catch((error) => {

			removeItemByMetaId(group_id, image_id);

			throw createError({
				statusCode: error.data.status.code,
				message: error.data.status.message,
				fatal: true,
			});
		});

	/*
	 ************************************************************************************
	 */

	const page = ref(1);
	const total = ref();
	const list = ref();
	const name = ref();

	const deleteData = async () => {
		createDeleteFunction();
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

	/*
	 ************************************************************************************
	 */

	const { updateModalValue } = inject("modal");

	const createDeleteFunction = () => {
		updateModalValue({
			open: true,
			type: "negative",
			name: "Alert",
			requestUrl: `/api/moments/${group_id}/${image_id}`,
			onSuccess: handleSuccess,
			onError: handleError,
		});
	};

	const handleSuccess = async ({ response }) => {
		
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

		setTimeout(() => navigateTo(`/moments/${group_id}`), 500)
	};

	const handleError = async ({ error, actions }) => {
		setTimeout(() => navigateTo(`/moments/${group_id}`), 500)
	};
</script>
