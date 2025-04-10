<template>
	<div>
		<splitpanes :horizontal="isMobile" class="w-full h-full" @resize="savePaneSize">
			<pane :size="paneLeft" class="pl-3 -mt-4 border-l md:pr-3" min-size="50" max-size="70">
				<div class="hidden w-full gap-2 mb-4 max-w-[35vw] md:flex">
					<button v-if="!content.author.is_owner" @click="likeImage" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
						<Icon :name="content.has_liked ? 'ri:heart-fill' : 'ri:heart-line'" size="1.2rem" />
						<UtilsCounter :count="content.likes.count" />
					</button>
					<button v-if="content?.permision?.can_delete_message" @click="deleteData" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
						<Icon name="ri:delete-bin-5-line" size="1.2rem" />
					</button>
					<a target="_parent" download :href="content?.media?.url" class="flex items-center justify-center gap-2 p-2 px-4 text-sm border border-[#756145] rounded-xl">Download</a>
					<button @click="focusEditable" class="flex items-center justify-center w-full gap-2 p-2 px-4 text-sm border border-[#756145] rounded-xl">Comment</button>
				</div>
				<div :class="loaded ? 'bg-black' : ' bg-gray-200'" class="relative flex items-center justify-center w-full h-full min-h-[51vh] max-h-[78vh] md:h-[78vh] overflow-hidden border rounded-lg">
					<img v-if="loaded" :src="content?.media?.url" class="object-contain w-full h-full" />
					<icon v-else class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="5em" />
				</div>
			</pane>
			<pane :size="paneRight" class="pl-3 overflow-hidden border-l mb-36 md:mb-auto">
				<div class="md:h-[82.5vh] overflow-scroll">
					<div class="flex w-full gap-2 mt-4 mb-2 md:hidden">
						<button v-if="!content.author.is_owner" @click="likeImage" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
							<Icon :name="content.has_liked ? 'ri:heart-fill' : 'ri:heart-line'" size="1.2rem" />
							<UtilsCounter :count="content.likes.count" />
						</button>

						<button v-if="content?.permision?.can_delete_message" @click="deleteData" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
							<Icon name="ri:delete-bin-5-line" size="1.2rem" />
						</button>

						<a v-if="!PWAInstalled" target="_parent" download :href="content?.media?.url" class="flex items-center justify-center gap-2 p-2 px-4 text-sm border border-[#756145] rounded-xl">Download</a>
						<div v-else class="relative group">
							<button disabled class="flex items-center justify-center gap-2 p-2 px-4 text-sm border border-[#756145] disabled:bg-gray-100 rounded-xl">Download</button>
							<div class="absolute z-50 hidden px-4 py-1 text-xs text-center text-white transition duration-200 ease-in-out transform -translate-y-full bg-[#756145] rounded-md w-44 top-[6.35rem] group-hover:block">
								<p class="text-center p-[0.45em]">
									<span class="font-semibold text-balance"> Currently not supported on PWAs! </span>
								</p>
								<div class="absolute w-3 h-3 bg-[#756145] transform rotate-45 -top-[0.44em] left-5 -translate-x-1/2"></div>
							</div>
						</div>
						<button @click="focusEditable" class="flex items-center justify-center w-full gap-2 p-2 px-4 text-sm border border-[#756145] rounded-xl">Comment</button>
					</div>

					<hr class="mt-4 mb-2 md:hidden" />
					<h2 class="mb-4 text-xl font-semibold">You might also like</h2>
					<p class="mb-2 -mt-4">Explore more posts from this author</p>

					<div :class="paneRight <= 38.5 ? 'grid-cols-2' : 'grid-cols-3'" class="grid gap-2 mt-4">
						<div v-for="content in content.related" class="flex-shrink-0 w-full h-full overflow-hidden bg-gray-200 border rounded-md aspect-square snap-start">
							<NuxtLink v-if="loaded" :to="`/moments/${group_id}/${content.post_data.id}`">
								<img :src="content.post_data?.media?.url" class="object-cover w-full h-full aspect-square" />
							</NuxtLink>
							<div v-else class="flex items-center justify-center flex-shrink-0 w-full h-full overflow-hidden bg-gray-200 border rounded-md aspect-square snap-start">
								<icon class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="2em" />
							</div>
						</div>

						<div v-for="content in 6 - content.related.length" class="flex items-center justify-center flex-shrink-0 w-full h-full overflow-hidden bg-gray-200 border rounded-md aspect-square snap-start">
							<icon class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="2em" />
						</div>
					</div>

					<hr class="my-2 mt-4" />

					<h2 class="mb-3 text-xl font-semibold">Comments</h2>
					<form @submit.prevent="handleSumbitComments()">
						<div class="flex items-center justify-center gap-2">
							<textarea v-model="comment" placeholder="Leave an message" ref="editable" class="w-full resize-none p-4 bg-gray-100 rounded-xl outline-none appearance-none h-[3.5rem] focus:border focus:border-black"></textarea>
							<button class="flex items-center justify-center p-[0.85rem] text-sm text-white bg-[#756145]/90 rounded-xl">
								<Icon name="ri:send-plane-fill" size="1.5rem" />
							</button>
						</div>
					</form>
				</div>
			</pane>
		</splitpanes>
	</div>
</template>

<script setup>
	import { Splitpanes, Pane } from "splitpanes";
	import "splitpanes/dist/splitpanes.css";


	useHead({
		htmlAttrs: {
			lang: "en",
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

	const editableDiv = templateRef("editable");

	const focusEditable = () => {
		editableDiv.value.focus();
	};

	const comment = ref();
	const handleSumbitComments = () => {
		comment.value = null;
	};

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

	const { PWAInstalled } = inject("PWA");

	const { setGroupData, getGroupData, updateGroupData, removeData, removeItemByMetaId } = useGroupStore();

	const { updateGroupValue } = inject("group");
	const group_id = useRoute().params.group_id;
	const image_id = useRoute().params.image_id;
	const content = ref();

	const group = getGroupData(group_id);

	
	const { makeRequest, data, error } = useRetryableFetch();

	await makeRequest(`/api/moments/${group_id}/${image_id}`)
	if(error.value) removeItemByMetaId(group_id, image_id);

	if(data.value) {
		content.value = data.value.data;
		updateGroupValue(data.value.meta.name);
	}

	/*
	 ************************************************************************************
	 */

	const page = ref(1);
	const total = ref();
	const list = ref();
	const name = ref();

	const deleteData = async () => createDeleteFunction();

	/*
	 ************************************************************************************
	 */

	const webSocket = inject("WebSocket")

	watch(webSocket.data, (payload => {

		const data = JSON.parse(payload)

		if (data.image_id === image_id && data.group_id === group_id) {
			content.value.likes.count = data.likes.count
		}
	}))

	const { updateItemByMetaId } = useGroupStore();

	const likeImage = async () => {
		const group_id = useRoute().params.group_id;

		await $fetch(`/api/moments/${group_id}/${content.value.id}`, { method: "PATCH" }).then((response) => {
			content.value.likes.count = response.data.likes.count;
			content.value.has_liked = response.data.has_liked;

			webSocket.send(JSON.stringify({
				group_id, image_id: content.value.id, 
				likes: {
					count: content.value.likes.count
				}
			}))


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
			type: "negative:post",
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

		setTimeout(() => navigateTo(`/moments/${group_id}`), 500);
	};

	const handleError = async ({ error, actions }) => {
		setTimeout(() => navigateTo(`/moments/${group_id}`), 500);
	};

	/*
	 ************************************************************************************
	 */

	const isMobile = ref(window.innerWidth < 768);
	const paneLeft = ref(60);
	const paneRight = ref(60);

	const updateScreenSize = () => {
		isMobile.value = window.innerWidth < 768;
	};

	window.addEventListener("resize", updateScreenSize);

	onUnmounted(() => {
		window.removeEventListener("resize", updateScreenSize);
	});

	const panes = JSON.parse(sessionStorage.getItem(`panes_size`));

	if (panes) {
		paneLeft.value = panes[0].size;
		paneRight.value = panes[1].size;
	}

	const savePaneSize = (event) => {
		sessionStorage.setItem(`panes_size`, JSON.stringify(event.panes));
		paneLeft.value = event.panes[0].size;
		paneRight.value = event.panes[1].size;
	};
</script>

<style>
	.splitpanes--vertical > .splitpanes__splitter {
		@apply w-1 h-[82.5vh] rounded-full mr-3 bg-gray-200 hover:bg-gray-300;
	}
</style>
