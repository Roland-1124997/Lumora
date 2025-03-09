<template>
	<div ref="target" class="border-b">
		<div class="w-full h-40 overflow-hidden bg-gray-200 md:h-52 rounded-xl">
			<div class="relative z-40 flex items-center justify-between p-2">
				<button :disabled="content.author.is_owner" @click="likeImage" class="relative z-50 w-11 flex items-center justify-between p-[0.30rem] text-black bg-white border rounded-lg">
					<icon :class="liked ? ' bg-red-600' : ''" :name="liked ? 'ri:heart-fill' : 'ri:heart-line'" size="1.1em" />
					<span class="text-xs font-medium">{{ hearts }}</span>
				</button>
			</div>

			<NuxtLink v-if="loaded && targetIsVisible" :to="`${$route.path}/${content.id}`">
				<img :src="content.media.url" :alt="content.author.id" class="object-cover w-full h-full -mt-[2.83rem] md:-mt-[2.75rem]" />
			</NuxtLink>
			<div class="flex items-center justify-center w-full h-full -mt-[2.83rem] md:-mt-[2.75rem]" v-else>
				<icon class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="2em" />
			</div>
		</div>

		<div class="py-2">
			<p class="text-sm text-gray-500">
				By <span class="font-semibold">{{ content.author.name }}</span>
			</p>
			<p class="text-sm text-gray-500">{{ useTimeAgo(content.created_at).value }}</p>
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

		const group_id: any = useRoute().params.group_id

		await $fetch<any>(`/api/moments/${group_id}/${content.id}`, { method: "PATCH" }).then((response: any) => {
			hearts.value = response.data.likes.count
			liked.value = response.data.has_liked

			updateItemByMetaId(group_id, content.id, {
				has_liked: liked.value,
				likes: { count:hearts.value }
			});
		})
	};
</script>
