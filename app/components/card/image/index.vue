<template>
	<div ref="target" class="border-b">
		<div class="w-full h-40 overflow-hidden bg-gray-200 md:h-52 rounded-xl">
			<div class="relative z-40 flex items-center justify-between p-2">
				<button :disabled="content.author.is_owner" @click="likeImage" class="relative z-50 w-11 flex items-center justify-between p-[0.30rem] disabled:opacity-60 text-black bg-white border rounded-lg">
					<icon :class="liked ? ' bg-red-600' : ''" :name="liked ? 'ri:heart-fill' : 'ri:heart-line'" size="1.1em" />
					<span class="text-xs font-medium">{{ hearts }}</span>
				</button>
			</div>

			<NuxtLink v-if="loaded && targetIsVisible" :to=" content.url ? content.url : `${$route.path}/${content.id}`">
				<img :src="content.media.url" :alt="content.author.id" class="object-cover aspect-square w-full h-full -mt-[2.83rem] md:-mt-[2.75rem]" />
			</NuxtLink>
			<div class="flex items-center justify-center w-full h-full -mt-[2.83rem] md:-mt-[2.75rem]" v-else>
				<icon class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="2em" />
			</div>
		</div>

		<div class="py-2">
			<div class="flex items-start w-full gap-2 ">

				<div class="flex items-center justify-center w-6 h-6 overflow-hidden bg-gray-200 rounded-full">
					<img v-if="loaded && targetIsVisible" :src="content.author.url" alt="image" class="object-cover w-full h-full" />
					<icon v-else class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="1em" />
				</div>
				<div class="">
					<p class="text-sm font-semibold text-gray-800 truncate ">{{ content.author.name }}</p>
					<p v-if="content.group" class="-mt-1 text-sm font-medium text-gray-500 truncate ">{{ content.group.name }}</p>
					<p class="-mt-1 text-sm text-gray-400">{{ useTimeAgo(content.created_at).value }}</p>
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
	
	watch(targetIsVisible, (value) => {
		if (value) {
			setTimeout(() => {
				loaded.value = true
			}, 500);
		}
	});

	const { updateItemByMetaId } = useGroupStore();

	const likeImage = async () => {

		const group_id: any = useRoute().params.group_id || "trending"
		const base_url = content.url || `/moments/${group_id}/${content.id}`

		await $fetch<any>(`/api${base_url}`, { method: "PATCH" }).then((response: any) => {
			hearts.value = response.data.likes.count
			liked.value = response.data.has_liked

			updateItemByMetaId(group_id, content.id, {
				has_liked: liked.value,
				likes: { count: hearts.value }
			});
		})
	};
</script>
