<template>
	<div ref="target" class="border-b select-text">
		<div class="w-full h-40 overflow-hidden bg-gray-200 border md:h-52 rounded-xl">
			<div v-if="content.has_been_accepted" class="relative z-40 flex items-center justify-start gap-2 p-2">
				<button :disabled="content.author.is_owner" @click="likeImage" class="relative z-50 flex gap-1 items-center justify-between p-[0.30rem] disabled:opacity-70 text-black bg-white border rounded-lg">
					<icon :class="[liked ? 'text-red-600' : '', isAnimating ? 'animate-like' : '']" :name="liked ? 'ri:heart-fill' : 'ri:heart-line'" size="1.2em" />
					<UtilsCounter :count="hearts" />
				</button>
				<button :disabled="content.author.is_owner" class="relative gap-1 z-50 flex items-center justify-between p-[0.30rem] disabled:opacity-70 text-black bg-white border rounded-lg">
					<icon name="ri:message-3-line" size="1.2em" />
					<UtilsCounter :count="comments" />
				</button>
			</div>
			<div v-else-if="methods" class="relative z-40 flex items-center justify-start gap-2 p-2">
				<button @click="pinImage" class="relative z-50 flex gap-1 items-center justify-between p-[0.30rem] disabled:opacity-70 text-black bg-white border rounded-lg">
					<icon :name="pinned ? 'ri:unpin-line' : 'ri:pushpin-line'" size="1.2em" />
				</button>
				<button @click="methods[0]" class="relative z-50 flex gap-1 items-center justify-between p-[0.30rem] disabled:opacity-70 text-black bg-white border rounded-lg">
					<icon name="ri:check-line" size="1.2em" />
				</button>
				<button @click="methods[1]" class="relative z-50 flex gap-1 items-center justify-between p-[0.30rem] disabled:opacity-70 text-black bg-white border rounded-lg">
					<icon name="ri:close-line" size="1.2em" />
				</button>
			</div>

			<NuxtLink v-if="content.has_been_accepted && loaded && targetIsVisible" :to="content.url ? content.url : `${$route.path}/${content.id}`">
				<img :src="content.media.url" :alt="content.id" class="object-cover aspect-square w-full h-full -mt-[2.86rem] md:-mt-[2.88rem]" />
			</NuxtLink>
			<div v-else-if="!content.has_been_accepted && loaded && targetIsVisible">
				<img :src="content.media.url" :alt="content.id" class="object-cover aspect-square w-full h-full -mt-[2.86rem] md:-mt-[2.88rem]" />
			</div>
			<div class="flex items-center justify-center w-full h-full -mt-[2.83rem] md:-mt-[2.75rem]" v-else>
				<icon class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="2em" />
			</div>
		</div>

		<div class="py-2">
			<div class="flex items-center gap-2">
				<div class="flex items-center justify-center overflow-hidden bg-gray-200 rounded-full w-7 h-7">
					<img v-if="loaded && targetIsVisible" :src="content.author.url" :alt="content.id" class="object-cover w-full h-full" />
					<icon v-else class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="1em" />
				</div>

				<div class="">
					<p class="text-sm font-semibold text-gray-800 truncate">
						{{ content.author.name }}
					</p>
					<div class="flex w-full items-center gap-2 -mt-[0.15rem]">
						<p v-if="content.group" class="text-xs font-medium text-gray-500 truncate max-w-16 md:max-w-fit md:text-sm">
							{{ content.group.name }}
						</p>
						<p class="text-xs text-gray-600 truncate md:text-sm">
							{{ useTimeAgo(content.accepted_at).value }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const target = ref(null);
	const targetIsVisible = useElementVisibility(target);

	const hearts = ref(0);
	const liked = ref(false);
	const loaded = ref(false);

	const { content, methods } = defineProps({
		content: { type: Object, required: true },
		methods: { type: Array, required: false },
	});

	hearts.value = content.likes.count;
	liked.value = content.has_liked;
	const isAnimating = ref(false);

	const comments = ref(0);

	watch(targetIsVisible, (value) => {
		if (value) {
			setTimeout(() => {
				loaded.value = true;
			}, 500);
		}
	});

	const group_id: any = useRoute().params.group_id;

	const { addToast } = useToast();
	const { updateItemByMetaId } = useGroupStore();
	const { setPinned, getPinned } = usePinStore();

	const pinned = ref(false);
	pinned.value = getPinned(group_id, { id: content.id }) ? true : false;

	const webSocket = inject<any>("WebSocket");

	watch(webSocket.data, (payload) => {
		const data = JSON.parse(payload);

		if (data.image_id === content.id && data.group_id === group_id) {
			hearts.value = data.likes.count;
		}
	});

	const pinImage = async () => {
		pinned.value = !pinned.value;
		setPinned(group_id, { ...content, id: content.id });
	};

	const likeImage = async () => {
		isAnimating.value = true;
		setTimeout(() => (isAnimating.value = false), 300);

		await $fetch<any>(`/api/moments/${group_id}/${content.id}`, { method: "PATCH" })
			.then((response: any) => {
				hearts.value = response.data.likes.count;
				liked.value = response.data.has_liked;

				webSocket.send(
					JSON.stringify({
						type: "update",
						group_id,
						image_id: content.id,
						likes: {
							count: hearts.value,
						},
					})
				);

				updateItemByMetaId(group_id, content.id, {
					has_liked: liked.value,
					likes: { count: hearts.value },
				});
			})
			.catch(() => {
				addToast({
					message: `Unable to like this image at the moment.`,
					type: "error",
					duration: 5000,
				});
			});
	};
</script>
