<template>
	<div class="flex flex-col items-center justify-center flex-1 h-screen p-4">
		<div class="w-full max-w-md space-y-10 text-center">
			<div class="relative">
				<h1 class="lf:text-[11.25em] text-[#756145] text-[10.55em] font-bold leading-none tracking-tighter">501</h1>
				<div class="absolute inset-0 flex items-center justify-center opacity-15">
					<div class="w-64 h-64 bg-black rounded-full rounde"></div>
				</div>
			</div>

			<div class="pt-16 space-y-4 lg:pt-8">
				<h2 class="text-2xl text-[#756145] font-semibold">{{ useStatusCodes["501"].message }}</h2>
				<p class="text-gray-600 text-balance">{{ useStatusCodes["501"].statusMessage }}</p>
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
</template>

<script setup lang="ts">
	useHead({
		htmlAttrs: {
			lang: "en",
		},
	});

	useSeoMeta({
		title: "Lumora - Group audit logs",
		description: "View shared photos and stories in this Lumora group. Connect, comment, and be inspired.",
		ogTitle: "Lumora - Explore This Group",
		ogDescription: "Dive into the latest posts and moments shared in this Lumora group.",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "/",
		twitterTitle: "Lumora - Group audit logs",
		twitterDescription: "Discover photos and connect with members in this Lumora group.",
		twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary",
	});

	definePageMeta({
		middleware: "unauthorized",
	});

	/*
	 ************************************************************************************
	 */

	const { PWAInstalled } = inject<any>("PWA");

	const handleError = (to: string) => {
		if (to == "/back") return useRouter().back();
		return clearError({ redirect: to });
	};

	/*
	 ************************************************************************************
	 */
</script>
