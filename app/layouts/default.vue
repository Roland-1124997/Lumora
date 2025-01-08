<template>
	<div class="min-h-screen">
		<header class="fixed top-0 z-50 w-full bg-white">
			<div class="flex items-center justify-between max-w-5xl px-4 py-4 mx-auto border-b lg:px-0">
				<div class="flex items-center justify-center gap-2">
					<icon v-if="!$route.name.includes('index')" name="material-symbols:arrow-back-ios-new-rounded" size="1.2rem" @click="$router.back()"></icon>
					<h1 class="text-xl font-semibold truncate md:max-w-none max-w-60 md:w-fit">
						<span v-if="$route.path == '/'">Lumora</span>
						<span v-else-if="$route.params.slug">{{ $route.params.slug.replaceAll("-", " ") }}</span>
						<span v-else>{{ $route.name.charAt(0).toUpperCase() + $route.name.slice(1) }} </span>
					</h1>
				</div>
				<div class="flex items-center gap-2">
					<UtilsButton to="/account" iconName="ri:account-circle-fill" :options="{ name: username }" />
					<UtilsButton to="/notifications" iconName="ri:notification-2-fill" :options="{ notificationCount }" />
				</div>
			</div>
			
			<nav v-if="$route.params.slug == null" class="container max-w-5xl mx-auto border-b ">
				<div class="flex items-center w-full h-10 gap-2 p-1 px-2 bg-gray-100 cursor-pointer md:rounded-lg justify-evenly">
					<NuxtLink to="/" class="flex items-center justify-center h-full gap-2 px-2 py-1 rounded-lg w-fit">
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

		<main :class="$route.params.slug == null ? 'mt-28' : 'mt-[4.5rem]'" class="fixed w-full h-full px-4 py-3 mx-auto overflow-y-auto flow-x-hidden over overflow-y-aut sm:px-6 lg:px-24">
			<div class="container max-w-5xl mx-auto mt-4 ">
				<slot></slot>
			</div>
		</main>
		
		
	</div>
</template>

<script setup>

	const store = useSessionsStore()
	const { data: user, error} = await store.getSession()

	const notificationCount = ref(10);
	const username = ref(user.name);

	provide("username", username.value);
	provide("notifications", notificationCount.value);

</script>

<style scoped>
	.router-link-active {
		@apply font-bold opacity-100 bg-white;
	}
</style>
