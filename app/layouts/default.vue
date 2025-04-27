<template>
	<div class="min-h-screen">
		<header :class=" PWAInstalled ? 'top-11 md:top-0': 'top-0'" class="fixed z-50 w-full bg-white ">
			<div class="flex items-center justify-between max-w-5xl px-4 py-4 mx-auto border-b lg:px-0">
				<button @click="$route.path !== '/moments' ? handleBack() : ''" class="flex items-center justify-center gap-2">
					<icon v-if="$route.path !== '/moments'" name="material-symbols:arrow-back-ios-new-rounded" size="1.2rem"></icon>
					<h1 class="text-xl font-semibold truncate md:max-w-none max-w-60 md:w-fit">
						<span v-if="$route.path == '/moments'">Lumora</span>
						<span v-else-if="$route.name?.includes('settings-group_id')">Settings</span>
						<span v-else-if="$route.name?.includes('invitations-id')">invitations</span>
						<span v-else-if="$route.name?.includes('-group_id')">{{ group }}</span>
						<span v-else>{{ $route.name?.charAt(0).toUpperCase() + $route.name?.slice(1) }} </span>
					</h1>
				</button>
				<div class="flex items-center gap-2">
					<UtilsButton to="/account" :options="{ name: username, url: avatar }" />
					<UtilsButton to="/moments" iconName="ri:archive-stack-fill"/>
					<UtilsButton to="/notifications" iconName="ri:notification-2-fill" :options="{ count: unreadNotificationsCount }" />
				</div>
			</div>
		</header>

		<main class="fixed mt-[4.5rem] w-full h-full px-4 py-3 mx-auto overflow-y-auto flow-x-hidden over sm:px-6 lg:px-24">
			<div class="container max-w-5xl mx-auto mt-4">
				<slot></slot>
			</div>
		</main>

		<UtilsToast/>
		
		<ModalBaselayer v-model="modal"> 

			<FieldFormCreateGroup v-if="modal.type == 'Create'" 
				:callback="closeModal"
				:requestUrl="modal.requestUrl" 
				:onError="modal.onError" 
				:onSuccess="modal.onSuccess" 
				/>
			<FieldFormDeleteGroup v-if="modal.type.includes('Group')"
				:callback="closeModal"
				:requestUrl="modal.requestUrl" 
				:onError="modal.onError" 
				:onSuccess="modal.onSuccess"  
				:type="modal.type"
			/>
			<FieldFormCreateImage v-if="modal.type == 'images'" 
				:callback="closeModal"
				:requestUrl="modal.requestUrl" 
				:onError="modal.onError" 
				:onSuccess="modal.onSuccess" 
				/>
			<FieldFormCreateLinks v-if="modal.type == 'links'"
				:callback="closeModal"
				:requestUrl="modal.requestUrl" 
				:onError="modal.onError" 
				:onSuccess="modal.onSuccess" 
			/>
			<FieldFormDeleteConfirm v-if="modal.type.includes('negative')"
				:callback="closeModal"
				:requestUrl="modal.requestUrl" 
				:onError="modal.onError" 
				:onSuccess="modal.onSuccess"  
				:type="modal.type"
			/>
			<FieldFormJoinLink v-if="modal.type == 'join'"
				:callback="closeModal"
				:requestUrl="modal.requestUrl" 
				:onError="modal.onError" 
				:onSuccess="modal.onSuccess"  
				:type="modal.type"
			/>
			<FieldFormJoinConfirm v-if="modal.type == 'join:group'"
				:callback="closeModal"
				:requestUrl="modal.requestUrl" 
				:onError="modal.onError" 
				:onSuccess="modal.onSuccess"  
				:type="modal.type"
			/>

			<FieldFormUpdateMember v-if="modal.type == 'update:member'"
				:callback="closeModal"
				:requestUrl="modal.requestUrl" 
				:onError="modal.onError" 
				:onSuccess="modal.onSuccess"  
				:type="modal.type"
			/>



		</ModalBaselayer>
	</div>
</template>

<script setup>

	const { PWAInstalled } = useCheckPwa()

	const store = useSessionsStore();
	const { data: user } = await store.getSession();
	const username = ref(user?.name);
	const avatar = ref(user?.avatar)

	const notificationStore = useNotificationStore();
	const unreadNotificationsCount = computed(() => notificationStore.unreadNotificationsCount);

	const group = ref()
	
	const modal = ref({
		open: false,
		type: "",
	});

	const router = useRouter();
	const route = useRoute();

	const { data, send, open, close } = useWebSocket(`wss://${location.host}/sockets`)
	const { removeData } = useGroupStore();

	watch(data, (value => {
		const payload = JSON.parse(value)
		
		if(payload.type == "kick" && payload.member_id == user.id && route.params.group_id == payload.group_id) {
			removeData(payload.group_id); open()
			return navigateTo("/moments")
		}

		if(payload.type == "delete" && route.params.group_id == payload.group_id) {
			removeData(payload.group_id); open()
			return navigateTo("/moments")
		}
		
	}))

	onUnmounted(() => {
		close()
	})

	const handleBack = () => {

		if(route.name === 'moments-group_id') return router.push('/moments'); 
		if(route.name === 'moments-group_id-image_id') return router.push(`/moments/${route.params.group_id}`);
		else router.back(); 
	};

	function updateGroupValue(option) {
		group.value = option
	}

	function updateModalValue(option) {
		modal.value = option;
	}

	function updateUsername(name) {
		username.value = name
	}

	const closeModal = () => (modal.value = false);

	provide("WebSocket", { data, send, close})
	provide("username", { username, updateUsername});
	provide("modal", { modal, updateModalValue});
	provide("group", { group, updateGroupValue })
	provide("PWA", { PWAInstalled })
	
</script>

<style scoped>
	.router-link-active {
		@apply font-bold opacity-100 bg-white;
	}
</style>
