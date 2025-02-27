<template>
	<div class="min-h-screen">
		<header :class=" PWAInstalled ? 'top-11 md:top-0': 'top-0'" class="fixed z-50 w-full bg-white ">
			<div class="flex items-center justify-between max-w-5xl px-4 py-4 mx-auto border-b lg:px-0">
				<div class="flex items-center justify-center gap-2">
					<icon v-if="$route.path != '/home'" name="material-symbols:arrow-back-ios-new-rounded" size="1.2rem" @click="$route.name.includes('-group_id') && !$route.name.includes('-image_id') ? $router.push('/moments') : $router.back()"></icon>
					<h1 class="text-xl font-semibold truncate md:max-w-none max-w-60 md:w-fit">
						<span v-if="$route.path == '/home'">Lumora</span>
						<span v-else-if="$route.name.includes('-group_id')">{{ group }}</span>
						<span v-else>{{ $route.name.charAt(0).toUpperCase() + $route.name.slice(1) }} </span>
					</h1>
				</div>
				<div class="flex items-center gap-2">
					<UtilsButton to="/account" iconName="ri:account-circle-fill" :options="{ name: username }" />
					<UtilsButton to="/notifications" iconName="ri:notification-2-fill" :options="{ notificationCount }" />
				</div>
			</div>

			<nav v-if="!$route.name.includes('-group_id')" class="container max-w-5xl mx-auto border-b">
				<div class="flex items-center w-full h-10 gap-2 p-1 px-2 bg-gray-100 cursor-pointer md:rounded-lg justify-evenly">
					<NuxtLink to="/home" class="flex items-center justify-center h-full gap-2 px-2 py-1 rounded-lg w-fit">
						<icon name="mdi:home" size="1.2rem"></icon>
					</NuxtLink>
					<span class="text-sm text-gray-400">|</span>
					<NuxtLink to="/timeline" class="flex items-center justify-center w-full h-full py-1 rounded-lg">
						<span class="text-sm">Timeline</span>
					</NuxtLink>
					<span class="text-sm text-gray-400">|</span>
					<NuxtLink to="/trending" class="flex items-center justify-center w-full h-full py-1 rounded-lg">
						<span class="text-sm"> Trending </span>
					</NuxtLink>
					<span class="text-sm text-gray-400">|</span>
					<NuxtLink to="/moments" class="flex items-center justify-center w-full h-full py-1 rounded-lg">
						<span class="text-sm">Moments</span>
					</NuxtLink>
				</div>
			</nav>
		</header>

		<main :class="!$route.name.includes('-group_id') ? 'mt-28' : 'mt-[4.5rem]'" class="fixed w-full h-full px-4 py-3 mx-auto overflow-y-auto flow-x-hidden over sm:px-6 lg:px-24">
			<div class="container max-w-5xl mx-auto mt-4">
				<slot></slot>
			</div>
		</main>
		<ModalBaselayer v-model="modal"> 
			<FieldFormCreateGroup v-if="modal.type == 'Create'" 
				:callback="closeModal"
				:requestUrl="modal.requestUrl" 
				:onError="modal.onError" 
				:onSuccess="modal.onSuccess" 
				/>
			<FieldFormCreateImage v-if="modal.type == 'images'" 
				:callback="closeModal"
				:requestUrl="modal.requestUrl" 
				:onError="modal.onError" 
				:onSuccess="modal.onSuccess" 
				/>
		</ModalBaselayer>
	</div>
</template>

<script setup>
	
	const PWAInstalled = ref(false)
	const { $pwa } = useNuxtApp();

	onMounted(() => {
		if ($pwa.isPWAInstalled ) PWAInstalled.value = true;
	});

	const store = useSessionsStore();
	const { data: user, error } = await store.getSession();

	const notifications = ref([
		{ id: 1, title: "Nieuwe Reactie", message: "Je hebt een nieuwe reactie op je post.", time: "2 uur geleden" },
		{ id: 2, title: "Nieuwe Volger", message: "Je hebt een nieuwe volger.", time: "3 uur geleden" },
		{ id: 3, title: "Bericht Gelezen", message: "Je bericht is gelezen door de ontvanger.", time: "4 uur geleden" },
		{ id: 4, title: "Nieuwe Like", message: "Je post is geliked door iemand.", time: "5 uur geleden" },
		{ id: 5, title: "Nieuwe Reactie", message: "Je hebt een nieuwe reactie op je post.", time: "6 uur geleden" },
		{ id: 6, title: "Nieuwe Volger", message: "Je hebt een nieuwe volger.", time: "7 uur geleden" },
		{ id: 7, title: "Bericht Gelezen", message: "Je bericht is gelezen door de ontvanger.", time: "8 uur geleden" },
		{ id: 8, title: "Nieuwe Like", message: "Je post is geliked door iemand.", time: "9 uur geleden" },
		{ id: 9, title: "Nieuwe Reactie", message: "Je hebt een nieuwe reactie op je post.", time: "10 uur geleden" },
		{ id: 10, title: "Nieuwe Volger", message: "Je hebt een nieuwe volger.", time: "11 uur geleden" },
		{ id: 11, title: "Bericht Gelezen", message: "Je bericht is gelezen door de ontvanger.", time: "12 uur geleden" },
		{ id: 12, title: "Nieuwe Like", message: "Je post is geliked door iemand.", time: "13 uur geleden" },
		{ id: 13, title: "Nieuwe Reactie", message: "Je hebt een nieuwe reactie op je post.", time: "14 uur geleden" },
		{ id: 14, title: "Nieuwe Volger", message: "Je hebt een nieuwe volger.", time: "15 uur geleden" },
		{ id: 15, title: "Bericht Gelezen", message: "Je bericht is gelezen door de ontvanger.", time: "16 uur geleden" },
		{ id: 16, title: "Nieuwe Like", message: "Je post is geliked door iemand.", time: "17 uur geleden" },
	]);
	
	const group = ref()
	const notificationCount = ref(notifications.value.length);
	const username = ref(user.name);

	const modal = ref({
		open: false,
		type: "",
	});

	function updateGroupValue(option) {
		group.value = option
	}

	function updateModalValue(option) {
		modal.value = option;
	}

	function updateNotification(options) {
        notifications.value = notifications.value.filter(notification => notification.id !== options.notification.id);
        notificationCount.value = notifications.value.length;
    }

	function updateUsername(name) {
		username.value = name
	}

	const closeModal = () => (modal.value = false);
	
	provide("notifications", { notifications, notificationCount, updateNotification});
	provide("username", {username, updateUsername});
	provide("modal", { modal, updateModalValue});
	provide("group", { group, updateGroupValue })
	provide("PWA", { PWAInstalled })
	
</script>

<style scoped>
	.router-link-active {
		@apply font-bold opacity-100 bg-white;
	}
</style>
