<template>
	<div class="min-h-screen">
		<header :class="PWAInstalled ? 'top-11 md:top-0' : 'top-0'" class="fixed z-50 w-full bg-white">
			<div class="flex items-center justify-between max-w-5xl px-4 py-4 mx-auto border-b lg:px-0">
				<div @click="handleError('/back')" class="flex items-center justify-center gap-2">
					<icon name="material-symbols:arrow-back-ios-new-rounded" size="1.2rem"></icon>
					<h1 class="text-xl font-semibold truncate md:max-w-none max-w-60 md:w-fit">
						<span>Lumora</span>
					</h1>
				</div>
				<ClientOnly>
					<div v-if="!errorValue" class="flex items-center gap-2">
						<UtilsButton to="/account" iconName="ri:account-circle-fill" :options="{ name, url: avatar }" />
						<UtilsButton to="/moments" iconName="ri:archive-stack-fill"/>
						<UtilsButton v-if="part_of_team" to="/monitor" iconName="ri:database-2-fill" />
						<UtilsButton to="/notifications" iconName="ri:notification-2-fill" :options="{ count: unreadNotificationsCount }" />
					</div>
					<div v-else class="flex items-center gap-2">
						<UtilsButton to="/auth" iconName="ri:lock-fill" :options="{ name: 'Login', always: true }" />
					</div>
				</ClientOnly>
			</div>
		</header>

		<main class="fixed w-full h-full px-4 py-3 mx-auto overflow-y-ahidden flow-x-hidden over sm:px-6 lg:px-24">
			<div class="container max-w-5xl mx-auto mt-4">
				<div class="flex flex-col items-center justify-center flex-1 h-screen p-4">
					<div class="w-full max-w-md space-y-10 text-center">
						<div class="relative">
							<h1 class="lf:text-[11.25em] text-[#756145] text-[10.55em] font-bold leading-none tracking-tighter">{{ status }}</h1>
							<div class="absolute inset-0 flex items-center justify-center opacity-15">
								<div class="w-64 h-64 bg-black rounded-full rounde"></div>
							</div>
						</div>
						
						<div v-if="statusInfo" class="pt-16 space-y-4 lg:pt-8">
							<h2 class="text-2xl text-[#756145] font-semibold">{{ statusInfo.message }}</h2>
							<p class="text-gray-600 text-balance">{{status == 500 ? error : statusInfo.statusMessage }}</p>
						</div>

						<div class="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
							<button @click="handleError('/moments')" class="flex items-center gap-2 px-4 py-2 font-medium text-white rounded-lg bg-[#756145]/80 hover:bg-[#756145] btn-primary">
								<Icon name="ri:home-2-fill" class="w-4 h-4" />
								Back to Home
							</button>

							<button @click="handleError('/back')" class="flex items-center gap-2 px-4 py-2 font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100">
								<Icon name="material-symbols:arrow-back-ios-new-rounded" class="w-4 h-4" />
								Previous
							</button>
						</div>
					</div>
				</div>
			</div>
		</main>
		<UtilsToast/>
	</div>
</template>

<script lang="ts" setup>

const { PWAInstalled } = useCheckPwa()

	const error = useError();
	const status = ref(error.value?.statusCode || 500);

	const errorValue = ref(false);

	const statusCode = computed(() => error.value?.statusCode || 500);
	const statusInfo = computed(() => useStatusCodes[statusCode.value]);

	const name = ref()
	const avatar = ref()
	const part_of_team = ref(false)

	const notificationStore = useNotificationStore();
	const unreadNotificationsCount = computed(() => notificationStore.unreadNotificationsCount);

	await $fetch<ApiResponse<User>>("/api/user").then((response) => {
		name.value = response.data.name
		avatar.value = response.data.avatar
		part_of_team.value = response.data.team || false
	}).catch(() => (errorValue.value = true));

	const handleError = (to: string) => {
		if (to == "/back") return useRouter().back();
		return clearError({ redirect: to });
	};
</script>

<style scoped>
	.router-link-active {
		@apply font-bold opacity-100 bg-white;
	}
</style>
