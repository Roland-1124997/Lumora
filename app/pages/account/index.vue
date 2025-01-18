<template>
	<div>
		<button @click="logout" class="flex items-center justify-center gap-2 p-2 px-2 font-medium text-white bg-black border border-black rounded-xl w-fit">
			<icon name="ri:door-lock-line" size="1.4em" />
			<span class="pr-2 " >Logout</span>
		</button>
		<!-- <button @click="logout">Logout</button> -->
	</div>
</template>

<script setup>
	const store = useSessionsStore();

	useHead({
		htmlAttrs: {
			lang: "nl",
		},
	});

	useSeoMeta({
		title: "Lumora - Account",
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

	const logout = () => {
		$fetch("/api/sessions", { method: "DELETE" }).then((response) => {
			store.clearSession();
			navigateTo(response.redirect);
		});
	};
</script>
