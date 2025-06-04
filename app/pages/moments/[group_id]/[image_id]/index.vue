<template>
	<div>
		<div class="hidden md:flex">
			<splitpanes :horizontal="isMobile" class="w-full h-full" @resize="savePaneSize">
				<pane :size="paneLeft" class="pl-3 -mt-4 border-l md:pr-3" min-size="50" max-size="70">
					<div class="hidden w-full gap-2 mb-4 md:flex">
						<button v-if="content?.has_interactions && !content.author?.is_owner" @click="likeImage" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
							<Icon :class="isAnimating ? 'animate-like' : ''" :name="content.has_interactions.has_liked ? 'ri:heart-fill' : 'ri:heart-line'" size="1.2rem" />
							<UtilsCounter :count="likes_count" />
						</button>
						<button v-if="content?.permision?.can_delete_message" @click="createDeleteFunction" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
							<Icon name="ri:close-circle-line" size="1.2rem" />
						</button>
						<UtilsButtonDownload :url="content?.media?.url" />
						<button v-if="content?.has_interactions" @click="focusEditable" class="flex items-center justify-center gap-2 p-2 px-4 text-sm border border-[#756145] rounded-xl">Comment</button>
					</div>
					<CardImageThumbnail :loaded :content="content || []" ref="thumbnail" />
				</pane>

				<pane :size="paneRight" class="pl-3 overflow-hidden border-l mb-36 md:mb-auto">
					<div class="md:h-[82.5vh] overflow-scroll">
						<div class="flex w-full gap-2 mt-4 mb-2 md:hidden">
							<button v-if="content?.has_interactions && !content.author?.is_owner" @click="likeImage" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
								<Icon :class="isAnimating ? 'animate-like' : ''" :name="content.has_interactions.has_liked ? 'ri:heart-fill' : 'ri:heart-line'" size="1.2rem" />
								<UtilsCounter :count="likes_count" />
							</button>
							<button v-if="content?.permision?.can_delete_message" @click="createDeleteFunction" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
								<Icon name="ri:close-circle-line" size="1.2rem" />
							</button>
							<UtilsButtonDownload :url="content?.media?.url" />
							<button v-if="content?.has_interactions" @click="focusEditable" class="flex items-center justify-center w-full gap-2 p-2 px-4 text-sm border border-[#756145] rounded-xl">Comment</button>
						</div>

						<hr class="mt-4 mb-2 md:hidden" />

						<CardImageGallery :content="content?.related || []" :loaded :id="group_id" :pane="paneRight" />

						<div v-if="content?.has_interactions">
							<hr class="my-2 mt-4" />
							<CardCommentsForm :loading :count="comments_count" :isAnimating :reload="fetchComments" :onSubmit="handleSubmitComments" ref="mobileCommentForm" />
							<div class="flex flex-col gap-3 -mt-3">
								<CardComments v-for="comment in comments" :key="comment.id" :content="comment" :permisions="content?.permision" :onDelete="createDeleteCommentFunction" :onEdit="handleEdit" :onReply="handleReply" />
							</div>
						</div>
					</div>
				</pane>
			</splitpanes>
		</div>

		<div class="md:hidden">
			<div class="w-full h-full">
				<div class="pl-3 -mt-4 border-l md:pr-3">
					<CardImageThumbnail :loaded :content="content || []" ref="thumbnail" />
					<div class="flex w-full gap-2 mt-4 mb-2">
						<button v-if="content?.has_interactions && !content.author?.is_owner" @click="likeImage" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
							<Icon :class="isAnimating ? 'animate-like' : ''" :name="content.has_interactions.has_liked ? 'ri:heart-fill' : 'ri:heart-line'" size="1.2rem" />
							<UtilsCounter :count="likes_count" />
						</button>
						<button v-if="content?.permision?.can_delete_message" @click="createDeleteFunction" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
							<Icon name="ri:close-circle-line" size="1.2rem" />
						</button>
						<UtilsButtonDownload :url="content?.media?.url" />
						<button v-if="content?.has_interactions" @click="focusEditable" class="flex items-center justify-center w-full gap-2 p-2 px-4 text-sm border border-[#756145] rounded-xl">Comment</button>
					</div>

					<hr class="mt-4 mb-2 md:hidden" />
					<CardImageGallery :content="content?.related || []" :loaded :id="group_id" :pane="paneRight" />

					<div class="mb-36" v-if="content?.has_interactions">
						<hr class="my-2 mt-4" />
						<CardCommentsForm :loading :count="comments_count" :isAnimating :reload="fetchComments" :onSubmit="handleSubmitComments" ref="commentForm" />
						<div class="flex flex-col gap-3 -mt-3">
							<CardComments v-for="comment in comments" :key="comment.id" :content="comment" :permisions="content?.permision" :onDelete="createDeleteCommentFunction" :onEdit="handleEdit" :onReply="handleReply" />
						</div>
					</div>
					<div class="mb-36" v-else></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	// @ts-ignore
	import { Splitpanes, Pane } from "splitpanes";
	import "splitpanes/dist/splitpanes.css";

	useHead({
		htmlAttrs: { lang: "en" },
	});

	useSeoMeta({
		title: "Lumora - Photo View",
		description: "Enjoy this photo shared in a Lumora group. Like, comment, and explore more moments.",
		ogTitle: "Lumora - A Shared Moment",
		ogDescription: "See the full photo and join the conversation in this Lumora group.",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "/",
		twitterTitle: "Lumora - Photo View",
		twitterDescription: "Check out this moment captured in a Lumora group. Get inspired and connect.",
		twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary",
	});

	definePageMeta({
		middleware: "unauthorized",
	});

	/*
	 ************************************************************************************
	 */

	const mobileCommentForm = ref<any>(null);
	const commentForm = ref<any>(null);
	const thumbnail = ref<any>(null);
	const comment_id = ref();
	const type = ref("");

	const focusEditable = () => {
		commentForm.value?.editable?.focus();
		mobileCommentForm.value?.editable?.focus();
		comment_id.value = null;
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

	const { setGroupData, getGroupData, updateGroupData, removeData, removeItemByMetaId, updateItemByMetaId } = useGroupStore();
	const { makeRequest, data, error } = useRetryableFetch<ApiResponse<PostUserDetails>>();
	const { makeRequest: makeCommentRequest, data: commentsList, error: commentError } = useRetryableFetch<ApiResponse<ApiUserComments>>();

	const { updateGroupValue } = inject<any>("group");

	const group_id: any = useRoute().params.group_id;
	const image_id: any = useRoute().params.image_id;

	const handleReply = (comment: UserComments) => {
		focusEditable();

		comment_id.value = comment.id;
	};

	const handleEdit = (comment: UserComments) => {
		type.value = "Update";

		focusEditable();

		commentForm.value.editable.value = comment.content.text;
		mobileCommentForm.value.editable.value = comment.content.text;

		comment_id.value = comment.id;
	};

	const content = ref<PostUserDetails | null>(null);
	const group: any = getGroupData(group_id);

	await makeRequest(`/api/moments/${group_id}/${image_id}`);
	if (error.value) removeItemByMetaId(group_id, image_id);

	if (data.value) {
		content.value = data.value.data;
		updateGroupValue(data.value.meta?.name);
	}

	const comments = ref<UserComments[]>([]);
	const total_comment_count = ref(0);
	const comments_count = computed(() => total_comment_count.value);
	const likes_count = computed(() => content.value?.has_interactions?.likes.count || 0);

	const sendWebSocketUpdate = () => {
		webSocket.send(
			JSON.stringify({
				type: "update",
				group_id,
				image_id: content.value?.id,
				likes: { count: likes_count.value },
				comments: { count: comments_count.value },
			})
		);
	};

	const updateStoreInteractions = () => {
		if (!content.value) return;

		updateItemByMetaId(group_id, content.value.id, {
			has_interactions: {
				has_liked: content.value.has_interactions.has_liked,
				likes: { count: likes_count.value },
				comments: { count: comments_count.value },
			},
		});
	};

	const loading = ref(false);

	const abortController = new AbortController();

	const fetchComments = async () => {
		loading.value = true;
		await makeCommentRequest(`/api/moments/comments/${group_id}/${content.value?.id}`, { signal: abortController.signal });
		if (commentsList.value) {
			comments.value = commentsList.value.data.comments;
			total_comment_count.value = commentsList.value.data.count;
		}

		setTimeout(() => (loading.value = false), 500);
	};

	/*
	 ************************************************************************************
	 */

	onUnmounted(() => {
		abortController.abort();
	});

	watch([likes_count, comments_count], () => {
		sendWebSocketUpdate();
		updateStoreInteractions();
	});

	setTimeout(async () => {
		if (content.value?.has_interactions) await fetchComments();
	}, 2500);

	/*
	 ************************************************************************************
	 */

	const handleSubmitComments = async (comment: UserComments) => {
		if (type.value == "Update")
			await $fetch(`/api/moments/comments/${group_id}/${content.value?.id}/${comment_id.value}`, { method: "PATCH", body: { comment } }).then(async (response) => {
				await fetchComments();
				comment_id.value = null;
			});
		else if (comment_id.value)
			await $fetch(`/api/moments/comments/${group_id}/${content.value?.id}`, { method: "POST", body: { comment, parent_id: comment_id.value } }).then(async (response) => {
				await fetchComments();
				comment_id.value = null;
			});
		else
			await $fetch(`/api/moments/comments/${group_id}/${content.value?.id}`, { method: "POST", body: { comment } }).then(async (response) => {
				await fetchComments();
			});
	};

	/*
	 ************************************************************************************
	 */

	const page = ref(1);
	const total = ref();
	const list = ref<PostUserDetails[]>([]);
	const name = ref();

	/*
	 ************************************************************************************
	 */

	const webSocket = inject<any>("WebSocket");

	watch(webSocket.data, (payload) => {
		const data = JSON.parse(payload);

		if (data.image_id === image_id && data.group_id === group_id && content.value) {
			content.value.has_interactions.likes.count = data.likes.count;
			updateStoreInteractions();
			fetchComments();
		}
	});

	/*
	 ************************************************************************************
	 */

	const isAnimating = ref(false);

	const likeImage = async () => {
		const group_id = useRoute().params.group_id;
		isAnimating.value = true;
		setTimeout(() => (isAnimating.value = false), 300);

		const response = await $fetch<ApiResponse<Interactions>>(`/api/moments/${group_id}/${content.value?.id}`, { method: "PATCH" });

		if (content.value) {
			content.value.has_interactions.likes.count = response.data.likes.count;
			content.value.has_interactions.has_liked = response.data.has_liked;
		}
	};

	/*
	 ************************************************************************************
	 */

	const { open } = useModal()
	const { addToast } = useToast();

	const createDeleteFunction = () => {

		const { onSuccess } = open({
			open: true,
			type: "negative:post",
			name: "Alert",
			requestUrl: `/api/moments/${group_id}/${image_id}`,
		})

		onSuccess(async () => {
			removeItemByMetaId(group_id, image_id);
			list.value = [];

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

			setTimeout(() => {
				const router = useRouter();
				router.replace(`/moments/${group_id}`);

				addToast({
					message: `post has been deleted`,
					type: "success",
					duration: 5000,
				})

			}, 500);
		})
	};

	/*
	 ************************************************************************************
	 */

	const createDeleteCommentFunction = (comment: UserComments) => {

		const { onSuccess } = open({
			open: true,
			type: "negative:comment",
			name: "Alert",
			requestUrl: `/api/moments/comments/${group_id}/${content.value?.id}/${comment.id}`,
		})

		onSuccess( async () => {
			await fetchComments()

			addToast({
				message: `comment has been deleted`,
				type: "success",
				duration: 5000,
			})
		})
	
	};

	/*
	 ************************************************************************************
	 */

	const isMobile = ref(window.innerWidth < 768);
	const paneLeft = ref(60);
	const paneRight = ref(60);

	onMounted(() => {
		if (isMobile.value) thumbnail.value?.focus.scrollIntoView({ behavior: "auto" });
	});

	const updateScreenSize = () => (isMobile.value = window.innerWidth < 768);

	window.addEventListener("resize", updateScreenSize);
	onUnmounted(() => window.removeEventListener("resize", updateScreenSize));

	const raw = sessionStorage.getItem("panes_size");
	const panes = raw ? JSON.parse(raw) : null;

	if (panes) {
		paneLeft.value = panes[0].size;
		paneRight.value = panes[1].size;
	}

	const savePaneSize = (event: any) => {
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
