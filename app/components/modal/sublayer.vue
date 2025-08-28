<template>
	<div class="select-none">
		<div class="flex items-center gap-4 pb-6 mb-3 -mt-8 border-b">
			<img :src="user.avatar" alt="Avatar" class="object-cover w-16 h-16 border border-gray-300 rounded-full" />
			<div>
				<h2 class="text-xl font-bold">{{ user.name }}</h2>
				<p class="text-sm text-gray-500 select-text">@{{ user.id }}</p>
			</div>
		</div>

		<div class="pb-5 space-y-3 border-b">
			<div class="pb-1">
				<h2 class="text-base font-semibold text-gray-900">Most Recent Posts</h2>
				<p class="-mt-1 text-sm text-gray-700">
					Latest posts from this user in shared groups
				</p>
			</div>

			<div class="grid grid-cols-3 gap-2 mt-4 sm:h-[18rem] md:h-[15rem] xl:h-[19rem]">
				<div v-for="post in posts" :key="post.id" class="relative flex-shrink-0 w-full h-full overflow-hidden bg-gray-200 border rounded-md aspect-square snap-start">
					<button @click="navigate(`/moments/${post.group_id}/${post.id}`)" class="">
						<img :src="post.media.url" :alt="post.id" class="z-40 object-cover w-full h-full transition duration-300 aspect-square hover:scale-105" />
					</button>
					<div class=" absolute bottom-1 left-1 flex items-center justify-between p-[0.30rem] px-2 text-black bg-white text-xs border rounded-lg">
						{{ post.name }}
					</div>
				</div>
				<div v-for="n in 6 - posts.length" :key="'loader-' + n" class="flex items-center justify-center flex-shrink-0 w-full h-full overflow-hidden bg-gray-200 border rounded-md aspect-square snap-start">
					<icon class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="2em" />
				</div>
			</div>
		</div>

		<div class="pb-3 space-y-3 lg:pb-0">
			<div class="pt-2 pb-1">
				<h2 class="font-semibold text-base-gray-900 text">Shared Groups</h2>
				<p class="-mt-1 text-sm text-gray-700">You and this user share {{ groups.length }} group{{ groups.length > 1 ? "s" : "" }}</p>
			</div>

			<div class="space-y-2 overflow-scroll h-fit max-h-36">
				<div @click="group_id != group.id ? navigate(`/moments/${group.id}`) : ''" v-for="group in groups" :key="group.name" :class="group_id == group.id ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 cursor-pointer'" class="flex items-center gap-3 p-3 transition-all rounded-lg hover:bg-gray-200">
					<div class="flex items-center justify-center overflow-hidden rounded-lg w-11 h-11">
						<img :src="group.media.url" :alt="group.name" class="object-cover w-full h-full" />
					</div>
					<div class="flex-1 min-w-0">
						<p class="font-medium text-gray-900">
							{{ group.name }}
						</p>
						<p class="-mt-1 text-sm text-gray-500 truncate">
							{{ group.description }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const modal: any = defineModel();

	const group_id = useRoute().params.group_id as string;

	const { details } = defineProps({
		details: { type: Object, required: true },
	});

	const user = ref();
	const groups = ref();
	const posts = ref();

	user.value = details.user;
	posts.value = details.posts;
	groups.value = details.groups.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
		if (a.id === group_id) return -1;
		if (b.id === group_id) return 1;
		return 0;
	});

	const navigate = (to: string) => {
		modal.value = false;
		navigateTo(to);
	};

</script>
