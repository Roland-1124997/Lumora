<template>
	<div class="min-h-screen">
		<header :class="PWAInstalled ? 'top-11 lg:top-6 xl:top-0' : 'top-0'" class="fixed z-50 w-full bg-white">
			<div class="flex items-center justify-between max-w-5xl px-4 py-4 mx-auto border-b lg:px-0">
				<button @click="$route.path !== '/moments' ? handleBack() : ''" class="flex items-center justify-center gap-2">
					<icon v-if="$route.path !== '/moments'" name="material-symbols:arrow-back-ios-new-rounded" size="1.2rem"></icon>
					<h1 class="text-xl font-semibold truncate md:max-w-none max-w-52 md:w-fit">
						<span v-if="$route.path == '/moments'">Lumora</span>
						<span v-else-if="$route.name?.includes('settings-group_id')">{{ group }}/<span class="text-sm text-gray-600">Settings</span></span>
						<span v-else-if="$route.name?.includes('pending-queue-group_id')">{{ group }}/<span class="text-sm text-gray-600">Queue</span></span>
						<span v-else-if="$route.name?.includes('logbook-group_id')"> {{ group }}/<span class="text-sm text-gray-600">Logbook</span></span>
						<span v-else-if="$route.name?.includes('-group_id')">{{ group }}</span>
						<span v-else>{{ $route.name?.charAt(0).toUpperCase() + $route.name?.slice(1) }} </span>
					</h1>
				</button>
				<div class="flex items-center gap-2">
					<UtilsButton to="/account" :options="{ name: username, url: avatar }" />
					<UtilsButton to="/moments" iconName="ri:archive-stack-fill" />
					<UtilsButton v-if="part_of_team" to="/monitor" iconName="ri:database-2-fill" />
					<UtilsButton to="/notifications" iconName="ri:notification-2-fill" :options="{ count: unreadNotificationsCount }" />
				</div>
			</div>
			<div>
				<div v-show="isLoading" class="absolute z-50 w-full h-full xl:top-0">
					<div class="">
						<div class="h-1 animate bg-[#756145]" :style="{ width: progress + '%' }"></div>
					</div>
				</div>
			</div>
		</header>

		<main class="fixed mt-[4.5rem] w-full h-full px-4 py-3 mx-auto overflow-y-auto flow-x-hidden over sm:px-6 lg:px-24">
			<div class="container max-w-5xl mx-auto mt-4">
				<slot></slot>
			</div>
		</main>

		<UtilsToast />

		<ModalBaselayer v-model="modal">

			<ModalSublayer v-if="modal.type == 'details'" v-model="modal" :details="modal.details"/>


			<FieldFormCreateGroup v-if="modal.type == 'Create'" :callback="closeModal" :url="modal.url" :onError="modal.onError" :onSuccess="modal.onSuccess" :resize="modal.resize" v-model="modal" />

			<FieldFormDeleteGroup v-if="modal.type.includes('Group')" :callback="closeModal" :url="modal.url" :onError="modal.onError" :onSuccess="modal.onSuccess" :type="modal.type" :resize="modal.resize" v-model="modal" />
			<FieldFormCreateImage v-if="modal.type == 'images'" :callback="closeModal" :url="modal.url" :onError="modal.onError" :onSuccess="modal.onSuccess" :resize="modal.resize" v-model="modal" />

			<FieldFormCreateLinks v-if="modal.type == 'links'" :callback="closeModal" :url="modal.url" :onError="modal.onError" :onSuccess="modal.onSuccess" :resize="modal.resize" v-model="modal" />

			<FieldFormDeleteConfirm v-if="modal.type.includes('negative')" :callback="closeModal" :url="modal.url" :onError="modal.onError" :onSuccess="modal.onSuccess" :type="modal.type" :resize="modal.resize" v-model="modal" />

			<FieldFormJoinLink v-if="modal.type == 'join'" :callback="closeModal" :url="modal.url" :onError="modal.onError" :onSuccess="modal.onSuccess" :resize="modal.resize" v-model="modal" />

			<FieldFormJoinConfirm v-if="modal.type == 'join:group'" :callback="closeModal" :url="modal.url" :onError="modal.onError" :onSuccess="modal.onSuccess" :type="modal.type" :resize="modal.resize" v-model="modal" />

			<FieldFormUpdateMember v-if="modal.type == 'update:member'" :callback="closeModal" :url="modal.url" :onError="modal.onError" :onSuccess="modal.onSuccess" :resize="modal.resize" v-model="modal" />

			<FieldFormUpdateConfirm v-if="modal.type.includes('image:')" :callback="closeModal" :url="modal.url" :onError="modal.onError" :onSuccess="modal.onSuccess" :type="modal.type" :resize="modal.resize" v-model="modal" />

			<FieldFormUpdateMultipleConfirm v-if="modal.type.includes('images:multiple')" :callback="closeModal" :url="modal.url" :onError="modal.onError" :onSuccess="modal.onSuccess" :type="modal.type" :resize="modal.resize" v-model="modal" />

			<FieldFormCreateTotp v-if="modal.type.includes('create:totp')" :callback="closeModal" :url="modal.url" :onError="modal.onError" :onSuccess="modal.onSuccess" :type="modal.type" :resize="modal.resize" v-model="modal" />
		</ModalBaselayer>
	</div>
</template>

<script setup>
	const nuxtApp = useNuxtApp();

	const { progress, isLoading, start, finish } = useLoadingIndicator({
		duration: 2000,
		throttle: 200,
		estimatedProgress: (duration, elapsed) => (2 / Math.PI) * 100 * Math.atan(((elapsed / duration) * 100) / 50),
	});

	addRouteMiddleware("global-loader", (to, from) => start(), { global: true });

	nuxtApp.hook("page:finish", () => finish());

	const { PWAInstalled } = useCheckPwa();

	const store = useSessionsStore();
	const { data: user } = await store.getSession();
	const username = ref(user?.name);
	const avatar = ref(user?.avatar);
	const part_of_team = ref(user?.team || false);

	const notificationStore = useNotificationStore();
	await notificationStore.fetchNotifications();

	const unreadNotificationsCount = computed(() => notificationStore.unreadNotificationsCount);

	const group = ref();

	const modal = ref({
		open: false,
		isMinimized: false,
		type: "",
	});

	const router = useRouter();
	const route = useRoute();

	const config = useRuntimeConfig();
	const secure = config.public.build ? "wss" : "ws";

	const { data, send, open, close } = useWebSocket(`${secure}://${location?.host || ""}/sockets`);
	const { removeData } = useGroupStore();

	watch(data, (value) => {
		const payload = JSON.parse(value);

		if (payload.type == "kick" && payload.member_id == user.id && route.params.group_id == payload.group_id) {
			removeData(payload.group_id);
			open();
			return navigateTo("/moments");
		}

		if (payload.type == "delete" && route.params.group_id == payload.group_id) {
			removeData(payload.group_id);
			open();
			return navigateTo("/moments");
		}
	});

	onUnmounted(() => {
		close();
	});

	const handleBack = () => {
		return router.back();
	};

	function updateGroupValue(option) {
		group.value = option;
	}

	function updateModalValue(option) {
		modal.value = { ...option, controller: new AbortController() };
	}

	function updateUsername(name) {
		username.value = name;
	}

	const closeModal = () => (modal.value = false);

	provide("WebSocket", { data, send, close });
	provide("username", { username, updateUsername });
	provide("modal", { modal, updateModalValue });
	provide("group", { group, updateGroupValue });
	provide("PWA", { PWAInstalled });
</script>

<style scoped>
	.router-link-active {
		@apply font-bold opacity-100 bg-white;
	}

	.animate {
		transition: width 0.2s ease-in-out;
	}
</style>
