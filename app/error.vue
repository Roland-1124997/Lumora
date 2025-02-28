<template>
	<div class="min-h-screen">
		<header :class="PWAInstalled ? 'top-11 md:top-0' : 'top-0'" class="fixed z-50 w-full bg-white">
			<div class="flex items-center justify-between max-w-5xl px-4 py-4 mx-auto border-b lg:px-0">
				<div class="flex items-center justify-center gap-2">
					<icon name="material-symbols:arrow-back-ios-new-rounded" size="1.2rem" @click="$router.back()"></icon>
					<h1 class="text-xl font-semibold truncate md:max-w-none max-w-60 md:w-fit">
						<span>Lumora</span>
					</h1>
				</div>

				<ClientOnly>
					<div v-if="!errorValue" class="flex items-center gap-2">
						<UtilsButton to="/account" iconName="ri:account-circle-fill" :options="{ name: userValue }" />
						<UtilsButton to="/notifications" iconName="ri:notification-2-fill" :options="{ count }" />
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
							<h1 class="lf:text-[11.25em] text-[10.55em] font-bold leading-none tracking-tighter">{{ status }}</h1>
							<div class="absolute inset-0 flex items-center justify-center opacity-15">
								<div class="w-64 h-64 bg-black rounded-full rounde"></div>
							</div>
						</div>

						<div class="pt-16 space-y-4 lg:pt-8">
							<h2 class="text-2xl font-semibold">{{ useStatusCodes[status].message }}</h2>
							<p class="text-gray-600 text-balance">{{ useStatusCodes[status].statusMessage }}</p>
						</div>

						<div class="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
							<button @click="handleError('/home')" class="flex items-center gap-2 px-4 py-2 font-medium text-white rounded-lg bg-black/80 hover:bg-black btn-primary">
								<Icon name="mdi:home" class="w-4 h-4" />
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
	</div>
</template>

<script setup>

	const error = useError();
	const status = ref(error.value.statusCode);

	const PWAInstalled = ref(false);
	const { $pwa } = useNuxtApp();

	onMounted(() => {
		if ($pwa.isPWAInstalled) PWAInstalled.value = true;
	});

	const userValue = ref();
	const errorValue = ref(false);
	const count = ref()

	const { getData } = useNotificationStore()
	
	await $fetch("/api/sessions").then((data) => {
		count.value = getData().count.value
		userValue.value = data.user.name
	}).catch(() => (errorValue.value = true));

	const handleError = (to) => {
		if (to == "/back") return useRouter().back();
		return clearError({ redirect: to });
	};
</script>

<style scoped>
	.router-link-active {
		@apply font-bold opacity-100 bg-white;
	}
</style>
