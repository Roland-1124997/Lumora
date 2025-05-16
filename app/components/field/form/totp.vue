<template>
	<FieldFormBaseLayer :requestUrl :onSuccess :onError :method :onReturn :schema label="Confirm">
		<div class="space-y-4 md:pt-12">
			<field name="code" v-slot="{ field, meta }: any">
				<div class="space-y-2">
					<label class="text-sm font-medium text-gray-700" for="count">
						<input autocomplete="one-time-code" id="count" placeholder="000000" inputmode="numeric" pattern="[0-9]*" maxlength="6" :value="field.value" @input="field.onChange(($event.target as HTMLInputElement).value.replace(/\D/g, ''))" :class="meta.validated && !meta.valid ? 'btn-Input-Error ' : 'btn-Input placeholder:text-gray-400 '" class="z-10 w-full px-4 py-3 text-2xl tracking-widest text-center transition-colors duration-300 border border-gray-500 appearance-none rounded-xl" />
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

	const store = useSessionsStore();

	const onReturn = () => {
		$fetch("/api/auth/logout", { method: "POST" }).then((response) => {
			store.clearSession();
			navigateTo(response.status.redirect);
		});
	}
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
