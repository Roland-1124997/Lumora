<template>
	<div class="space-x-3">
		<div class="flex items-center justify-center w-full">
			<button class="flex items-center justify-center w-[360px] h-10 gap-3 text-base border border-gray-300 rounded-full hover:bg-gray-50">
				<ClientOnly>
					<div class="flex items-center justify-center w-full">
						<GoogleLogin :callback="handleGoogleSuccess" :buttonConfig="{ logo_alignment: 'center', width: '360', text: 'continue_with', shape: 'circle' }" />
					</div>
				</ClientOnly>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	const handleGoogleSuccess = async (response: SuccessResponse) => {
		await $fetch("/api/auth/google/identity", { method: "POST", body: response }).then((response) => {
			navigateTo(response.meta.redirect);
		});
	};
</script>
