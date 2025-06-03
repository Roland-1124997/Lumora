<template>
	<div>
		<div class="flex items-center justify-between w-full mb-3 -mt-4">
			<div class="flex items-center gap-2 justify-evenly p-1 border rounded-xl w-[10rem] overflow-hidden bg-gray-100">
				<button @click="setActiveTab('all')" :class="activeTab == 'all' ? 'bg-white font-bold' : ''" class="flex items-center justify-center w-full p-1 rounded-lg">
					<span class="text-sm">All</span>
				</button>
				<span class="text-sm text-gray-400">|</span>
				<button @click="setActiveTab('unread')" :class="activeTab == 'unread' ? 'bg-white font-bold' : ''" class="flex items-center justify-center w-full py-1 rounded-lg">
					<span class="text-sm">Unread</span>
				</button>
			</div>
			<button @click="notificationStore.markAllNotificationsAsRead()" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl w-fit">Mark all as read</button>
		</div>

		<hr class="pb-3" />

		<section v-if="notifications.length >= 1" class="h-[80vh] w-full overflow-scroll">
			<div class="mb-24 space-y-2">
				<div v-for="notification in notifications" :key="notification.id" class="flex items-start gap-3 p-4 transition bg-white border shadow-sm rounded-xl hover:bg-gray-50">
					<div class="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full">
						<icon :name="notification.icon || 'ri:notification-2-line'" class="text-[#756145]" size="1.5em" />
					</div>

					<div class="flex-1 min-w-0">
						<p class="text-base font-semibold">{{ notification.title }}</p>
						<p class="mr-10 text-sm text-gray-700 text-balance line-clamp-3">{{ notification.message }}</p>

						<div v-if="notification.reason" class="mt-2">
							<h2 class="block text-sm font-semibold text-gray-600">Reason:</h2>
							<div class="text-sm font-normal text-red-800 text-balance">{{ notification.reason }}</div>
						</div>

						<NuxtLink :to="notification.post?.url || notification.group.url" class="flex items-center gap-2 mt-2">
							<div v-if="notification.group || notification.post" class="text-sm flex items-center border p-1 px-2 rounded-md text-[#756145]">
								<icon name="ri:group-line" size="1em" class="inline-block mr-1" />
								<span>{{ notification.group.name }}</span>
							</div>
						</NuxtLink>

						<p class="mt-2 text-xs text-gray-400">
							<NuxtTime :datetime="notification.created_at" locale="en" relative />
						</p>
					</div>

					<button v-if="!notification.is_read" @click="notificationStore.markNotificationAsRead(notification.id)" class="p-2 ml-2 transition rounded-full hover:bg-gray-200" title="Mark as read">
						<icon name="ri:close-fill" size="1.3em" class="text-gray-400" />
					</button>
				</div>
			</div>
		</section>

		<section v-else class="h-[60vh] -mt-8 md:h-[65vh] flex items-start justify-center overflow-hidden">
			<div class="flex flex-col items-center justify-center w-full h-full gap-5">
				<icon class="text-gray-500" name="ri:notification-2-line" size="5em" />
				<h1 class="text-lg font-bold text-center text-balance">You are up to date!</h1>
				<p class="-mt-5 text-center text-balance">There are no unread notifications</p>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	useHead({
		htmlAttrs: {
			lang: "en",
		},
	});

	useSeoMeta({
		title: "Lumora - Notifications",
		description: "Stay updated with the latest activity, likes, and comments on your photos and groups.",
		ogTitle: "Lumora - Notifications",
		ogDescription: "Never miss a moment. Get notified when others interact with your photos or mention you in groups.",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "/",
		twitterTitle: "Lumora - Notifications",
		twitterDescription: "See what's new on Lumora. Stay in the loop with updates on your posts and group activity.",
		twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary",
	});

	definePageMeta({
		middleware: "unauthorized",
	});

	const activeTab = ref("all");

	const notificationStore = useNotificationStore();
	await notificationStore.fetchNotifications();

	const readNotifications = computed(() => notificationStore.getAllNotifications);
	const unreadNotifications = computed(() => notificationStore.getUnreadNotifications);
	const notifications = computed(() => (activeTab.value == "all" ? readNotifications.value : unreadNotifications.value));

	const setActiveTab = async (tab: string) => (activeTab.value = tab);
</script>

<style scoped>
	.fade-enter-active,
	.fade-leave-active {
		transition: all 0.5s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
</style>
