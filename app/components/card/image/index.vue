<template>
	<div ref="target" class="border-b">
		<div class="w-full h-40 overflow-hidden bg-gray-200 border md:h-52 rounded-xl">
			<div class="relative z-40 flex items-center justify-start gap-2 p-2">
				<button :disabled="content.author.is_owner" @click="likeImage" class="relative z-50 flex gap-1 items-center justify-between p-[0.30rem] disabled:opacity-70 text-black bg-white border rounded-lg">
					<icon :class="liked ? ' bg-red-600' : ''" :name="liked ? 'ri:heart-fill' : 'ri:heart-line'" size="1.2em" />
					<UtilsCounter :count="hearts" />
				</button>
				<button :disabled="content.author.is_owner" class="relative gap-1 z-50 flex items-center justify-between p-[0.30rem] disabled:opacity-70 text-black bg-white border rounded-lg">
					<icon name="ri:message-3-line" size="1.2em" />
					<UtilsCounter :count="comments" />
				</button>
			</div>

			<NuxtLink v-if="loaded && targetIsVisible" :to=" content.url ? content.url : `${$route.path}/${content.id}`">
				<img :src="content.media.url" :alt="content.author.id" class="object-cover aspect-square w-full h-full -mt-[2.86rem] md:-mt-[2.88rem]" />
			</NuxtLink>
			<div class="flex items-center justify-center w-full h-full -mt-[2.83rem] md:-mt-[2.75rem]" v-else>
				<icon class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="2em" />
			</div>
		</div>

		<div class="py-2">
			<div class="flex items-center gap-2 ">

				<div class="flex items-center justify-center overflow-hidden bg-gray-200 rounded-full w-7 h-7">
					<img v-if="loaded && targetIsVisible" :src="content.author.url" alt="image" class="object-cover w-full h-full" />
					<icon v-else class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="1em" />
				</div>
				<div class="">
					<p class="text-sm font-semibold text-gray-800 truncate ">{{ content.author.name }}</p>
					<div class="flex w-full items-center gap-2 -mt-[0.15rem] ">
						<p v-if="content.group" class="text-xs font-medium text-gray-500 truncate max-w-16 md:max-w-fit md:text-sm ">{{ content.group.name }}</p>
						<p class="text-xs text-gray-400 truncate md:text-sm ">{{ useTimeAgo(content.created_at).value }}</p>
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

	const { content } = defineProps({
		content: { type: Object, required: true },
	});

	hearts.value = content.likes.count
	liked.value = content.has_liked
	const comments = ref(0)
	
	watch(targetIsVisible, (value) => {
		if (value) {
			setTimeout(() => {
				loaded.value = true
			}, 500);
		}
	});

	const group_id: any = useRoute().params.group_id 

	const { addToast } = useToast();
	const { updateItemByMetaId } = useGroupStore();

	const webSocket = inject<any>("WebSocket")

	watch(webSocket.data, (payload => {

		const data = JSON.parse(payload)

		if (data.image_id === content.id && data.group_id === group_id) {
			hearts.value = data.likes.count
		}
	}))

	const likeImage = async () => {

		await $fetch<any>(`/api/moments/${group_id}/${content.id}`, { method: "PATCH" }).then((response: any) => {
			hearts.value = response.data.likes.count
			liked.value = response.data.has_liked

			webSocket.send(JSON.stringify({
				group_id, image_id: content.id, 
				likes: {
					count: hearts.value
				}
			}))

			updateItemByMetaId(group_id, content.id, {
				has_liked: liked.value,
				likes: { count: hearts.value }
			});
		}).catch(() => {
			addToast({
				message: `Unable to like this image at the moment.`,
				type: "error",
				duration: 5000,
			});
		})
	};

	






</script>


