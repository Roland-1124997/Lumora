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
				<div v-for="notification in notifications" :key="notification" class="flex items-center justify-between p-4 border bg-gray-50 rounded-xl">
					<div class="flex items-start justify-between w-full space-x-3">
						<div>
							<p class="text-lg font-semibold text-[#756145] underline underline-offset-1">{{ notification.title }}</p>
							<p class="text-sm text-gray-500 line-clamp-2">{{ notification.message }}</p>
							<p class="text-xs text-gray-400">{{ notification.time }}</p>
						</div>
						<icon v-if="!notification.isRead" @click="notificationStore.markNotificationAsRead(notification.id)" name="ri:close-fill" size="1.6rem" class="text-xl text-gray-500 cursor-pointer" />
					</div>
				</div>
			</div>
		</section>

		<section v-else class="h-[60vh] -mt-8 md:h-[65vh] flex items-start justify-center overflow-hidden">
			<div class="flex flex-col items-center justify-center w-full h-full gap-5">
				<icon class="text-gray-500" name="ri:notification-2-line" size="5em" />
				<h1 class="text-lg font-bold text-center text-balance">Je bent up to date!</h1>
				<p class="-mt-5 text-center text-balance">Er zijn geen ongelezen berichten</p>
			</div>
		</section>
	</div>
</template>

<script setup>
	useHead({
		htmlAttrs: {
			lang: "en",
		},
	});

	useSeoMeta({
		title: "Lumora - Notifications",
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

	const activeTab = ref("all");

	const notificationStore = useNotificationStore();
	const readNotifications = computed(() => notificationStore.getAllNotifications);
	const unreadNotifications = computed(() => notificationStore.getUnreadNotifications);

	const notifications = computed(() => (activeTab.value == "all" ? readNotifications.value : unreadNotifications.value));

	const setActiveTab = async (tab) => {
		activeTab.value = tab;
	};
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
