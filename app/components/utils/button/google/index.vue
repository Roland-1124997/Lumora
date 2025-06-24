<template>
	<ClientOnly>
		<div class="space-x-3">
			<div class="flex items-center justify-center w-full">
				<button class="flex items-center justify-center w-[360px] h-10 gap-3 text-base border border-gray-300 rounded-full hover:bg-gray-50">
					<div class="flex items-center justify-center w-full">
						<GoogleLogin :callback="handleGoogleSuccess" :buttonConfig="{ logo_alignment: 'center', width: '360', text: 'continue_with', shape: 'circle' }" />
					</div>
				</button>
			</div>
		</div>
	</ClientOnly>
</template>

<script setup lang="ts">
	const { makeRequest } = useRetryableFetch({ maxAttempts: 1, throwOnError: false });

	const handleGoogleSuccess = async (response: any) => {
		const { data } = await makeRequest("/api/auth/google/identity", {
			method: "POST",
			body: response,
		});

		if (data.value) navigateTo(data.value.status.redirect);
	};
</script>
