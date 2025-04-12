<template>
	<div class="flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-500">
		<div class="w-full max-w-md overflow-hidden bg-white rounded-xl">
			<div v-if="loading" class="flex flex-col items-center p-8">
				<icon class="text-gray-500 animate-spin" name="ri:loader-2-line" size="8em" />
				<h2 class="mt-6 text-xl font-semibold text-center">Verifying invitation...</h2>
				<p class="mt-2 text-center text-gray-500">Please wait while we verify your invitation link.</p>
			</div>

			<div v-else>
				<div v-if="success" class="p-8">
					<div class="flex flex-col items-center mb-6">
						<icon class="text-gray-500" name="rivet-icons:happy" size="5em" />
						<h2 class="mt-4 text-2xl font-bold text-center">Invitation Valid!</h2>
						<p class="mt-2 text-center text-gray-500">You're invited to join this group.</p>
					</div>

					<div class="mb-6 space-y-4">
						<div class="p-4 rounded-lg bg-gray-50">
							<p class="text-sm text-gray-500">Group Name</p>
							<p class="text-lg font-semibold">{{ result.data.details.name }}</p>
						</div>

						<div class="p-4 rounded-lg bg-gray-50">
							<p class="text-sm text-gray-500">Members</p>
							<p class="text-lg font-semibold">{{ result.data.details.members }}</p>
						</div>
					</div>

					<div class="flex gap-2">
						<button @click="router.back()" class="flex items-center justify-center gap-2 p-2 px-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100">
							<Icon name="material-symbols:arrow-back-ios-new-rounded" class="w-4 h-4" />
						</button>
						<button @click="join" class="w-full py-2 text-white bg-[#756145]/80 hover:bg-[#756145] rounded-md">Join group</button>
					</div>
				</div>

				<div v-if="error" class="p-8">
					<div class="flex flex-col items-center mb-6">
						<icon class="text-gray-500" name="rivet-icons:sad" size="5em" />
						<h2 class="mt-4 text-2xl font-bold text-center">Invitation Invalid</h2>
						<p class="mt-2 text-center text-gray-500">The invitation has expired or isn't valid</p>
					</div>

					<div class="space-y-4">
						<button @click="router.back()" class="flex items-center justify-center w-full gap-2 p-2 px-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100">
							<Icon name="material-symbols:arrow-back-ios-new-rounded" class="w-4 h-4" />
							Take me back
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	definePageMeta({
		middleware: "invite-redirecter",
		layout: false,
	});

	const verifyInvite = async (id, token) => {
		await new Promise((resolve) => setTimeout(resolve, 2000));

		await $fetch(`/api/invitations/${id}/${token}`)
			.then((response) => {
				sessionStorage.removeItem(`${response.status.redirect.split("/")[2]}_List`);
				sessionStorage.removeItem(`${response.status.redirect.split("/")[2]}_Scroll`);

				result.value = response;
				success.value = true;
			})
			.catch((error) => (error.value = true))
			.finally(() =>{

                if (result.value.status.joined) {
					if (result.value.status.redirect) navigateTo(result.value.status.redirect);
				} else loading.value = false;
					
			});
	};

	const router = useRouter();
	const route = useRoute();

	const loading = ref(true);
	const success = ref(false);
	const error = ref(false);

	const result = ref();

	const id = route.params.id;
	const token = route.query.token || "";

	onMounted(async () => {
		await verifyInvite(id, token);
	});

	const join = async () => {
		await $fetch(`/api/invitations/accept/${id}/${token}`).then((response) => {
			setTimeout(() => {
				if (response.status.redirect) navigateTo(response.status.redirect);
			}, 500);
		}).catch(() => navigateTo("/moments"))
	};
</script>

