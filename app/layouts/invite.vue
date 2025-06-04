<template>
	<div class="min-h-screen">
		<header :class=" PWAInstalled ? 'top-11 md:top-0': 'top-0'" class="fixed z-50 w-full bg-white ">
			<div class="flex items-center justify-between max-w-5xl px-4 py-4 mx-auto border-b lg:px-0">
				<button @click="handleBack()" class="flex items-center justify-center gap-2">
					<icon name="material-symbols:arrow-back-ios-new-rounded" size="1.2rem"></icon>
					<h1 class="text-xl font-semibold truncate md:max-w-none max-w-60 md:w-fit">
						<span>Invitations</span>
					</h1>
				</button>
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

		<main class="fixed mt-[4.5rem] w-full h-full px-4 py-3 mx-auto overflow-y-auto flow-x-hidden over sm:px-6 lg:px-24">
			<div class="container max-w-5xl mx-auto mt-4">
				<slot></slot>
			</div>
		</main>

	</div>
</template>

<script setup>

	const { PWAInstalled } = useCheckPwa()

	const name = ref()
	const avatar = ref()
	const errorValue = ref(false)
	const part_of_team = ref(false)

	const notificationStore = useNotificationStore();
	const unreadNotificationsCount = computed(() => notificationStore.unreadNotificationsCount);

	await $fetch("/api/user").then((response) => {
		name.value = response.data.name
		avatar.value = response.data.avatar
		part_of_team.value = response.data.team || false
	}).catch(() => (errorValue.value = true));

	const router = useRouter();

	const handleBack = () => {
        router.back(); 
	};

</script>

<style scoped>
	.router-link-active {
		@apply font-bold opacity-100 bg-white;
	}
</style>
