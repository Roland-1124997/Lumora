<template>
	<FieldFormBaseLayer :requestUrl :onSuccess :onError :method :schema label="Verify">
		<div class="space-y-4 md:pt-12">
			<field name="code" v-slot="{ field, meta }: any">
				<div class="space-y-2">
					<label class="text-sm font-medium text-gray-700" for="count">
						<div class="relative ">
							<input v-bind="field" autocomplete="one-time-code" id="count" placeholder="000000" type="text" maxlength="6" :class="meta.validated && !meta.valid ? ' btn-Input-Error' : 'btn-Input'" class="z-10 w-full px-4 py-3 text-2xl tracking-widest text-center transition-colors duration-300 border border-gray-500 appearance-none placeholder:text-gray-400 rounded-xl" />
							<span class="absolute text-sm text-gray-400 -translate-y-1/2 right-3 top-1/2">
								{{ countdown }}s
							</span>
						</div>
					</label>
				</div>
			</field>
		</div>
	</FieldFormBaseLayer>
</template>

<script setup lang="ts">
	const { requestUrl, onSuccess, onError, method } = defineProps({
		requestUrl: { type: String, required: true },
		onSuccess: { type: Function, required: true },
		onError: { type: Function, required: true },
		method: { type: String, default: "POST" },
		schema: { type: Object, required: true },
	});

	const countdown = ref(30);

	onMounted(() => {
		setInterval(() => {
			countdown.value = countdown.value > 0 ? countdown.value - 1 : 30;
		}, 1000);
	});
</script>

<style scoped>
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.3s ease;
	}
	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
</style>
