<template>
	<div ref="target" class="pb-2 border-b h-fit md:h-16">
		<NuxtLink :to="`/moments/${content.id}`" class="flex items-center space-x-3">
			<div class="flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-200 rounded-full">
				<img v-if="loaded && targetIsVisible" :src="content.media.url" alt="image" class="object-cover w-full h-full" />
				<icon v-else class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="1.4em" />
			</div>
			<div class="flex-1 pl-3 border-l">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2 mb-1">
						<h3 class="text-lg font-semibold">{{ content.name }}</h3>
						<icon v-if="content.needs_attention" name="ri:error-warning-fill" size="1.6rem" class="text-red-600 " />
					</div>

					<p v-if="content.last_action != 'Pending'" class="text-sm text-gray-500">{{ useTimeAgo(content.last_active).value }}</p>
				</div>
				<p class="-mt-1 text-sm text-gray-500">
					<span v-if="content.last_action == 'Deleted'">
						<span
							>A photo has been removed by a:
							<span class="block md:inline-block">
								<span class="font-bold text-gray-500 truncate">moderator or admin</span>
							</span>
						</span>
					</span>
					<span v-else-if="content.last_action == 'Rejected'">
						<span
							>An photo has been rejected by a:
							<span class="block md:inline-block">
								<span class="font-bold text-gray-500 truncate">moderator or admin</span>
							</span>
						</span>
					</span>
					<span v-else-if="content.last_action == 'Created'">
						<span v-if="content.last_photo_posted_by.name"
							>Last photo posted by:
							<span class="block md:inline-block">
								<span class="font-bold text-gray-500 truncate">{{ content.last_photo_posted_by.name }}</span>
							</span>
						</span>
						<span v-else>No activity yet, check back later</span>
					</span>
					<span v-else-if="content.last_action == 'Approved'">
						<span>
							Approved an photo posted by:
							<span class="block md:inline-block">
								<span class="font-bold text-gray-500 truncate">{{ content.last_photo_posted_by.name }}</span>
							</span>
						</span>
					</span>
					<span v-else-if="content.last_action == 'Pending'">
						<span
							>Awaiting for membership approval by a:
							<span class="block md:inline-block">
								<span class="font-bold text-gray-500 truncate">moderator or admin</span>
							</span>
						</span>
					</span>
				</p>
			</div>
		</NuxtLink>
	</div>
</template>

<script setup lang="ts">
	const target = ref(null);
	const targetIsVisible = useElementVisibility(target);
	const loaded = ref(false);

	const { content } = defineProps({
		content: { type: Object, required: true },
	});

	watch(targetIsVisible, (value) => {
		if (value) {
			setTimeout(() => {
				const imageLoad = new Image();
				imageLoad.src = content.media.url;
				imageLoad.onload = () => (loaded.value = true);
			}, 500);
		}
	});
</script>
