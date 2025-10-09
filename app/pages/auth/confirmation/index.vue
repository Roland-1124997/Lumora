<template>
	<div class="relative w-full h-full max-w-lg mx-auto space-y-8">
		<div class="space-y-2">
			<h1 class="text-4xl font-bold tracking-tight">Just a moment...</h1>
			<p class="text-base text-gray-500">
				we are confirming your <span class="font-bold capitalize">{{ provider }}</span> identity
			</p>
		</div>

		<div class="relative flex items-center justify-center border-2 h-[55dvh] bg-gray-50 rounded-3xl border-gray-200">
			<div class="relative w-52 h-52 border-[12px] border-gray-200 border-t-[12px] border-t-[#756145] rounded-full animate-spin"></div>

			<div v-if="provider" class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
				<icon :name="`devicon:${provider}`" size="2.5rem" class="text-gray-300 animate-none" />
			</div>
		</div>

		<p class="z-50 w-full py-4 text-sm text-center text-gray-500 md:text-left bottom-10">Wait wat am I doing here? <NuxtLink class="font-bold text-[#817a70] hover:text-[#6e675d]" to="/">take me back</NuxtLink></p>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		layout: "auth",
	});

	const { query } = useRoute();
	const provider = query.type || null;
</script>
