<template>
	<div class="fixed z-50 flex flex-col gap-2 right-6 bottom-8 md:right-[13rem]">
		<TransitionGroup name="toast">
			<div v-for="toast in toasts" :key="toast.id" class=" w-[88vw] md:w-[30vw] flex items-center gap-4 p-2 px-3 rounded-xl shadow-lg border transition-all bg-white " :class="toastStyles(toast.type)" role="alert">
				<Icon :name="iconMap[toast.type]" class="text-4xl" />
				<div class="flex-1">
					<p class="text-sm font-medium text-black">{{ toast.message }}</p>
				</div>
				<button @click="toast.id !== undefined && removeToast(toast.id)" class="text-gray-800 hover:text-gray-900">
					<Icon name="pajamas:close-xs" size="1.5rem" />
				</button>
			</div>
		</TransitionGroup>
	</div>
</template>

<script setup lang="ts">
	const { toasts, removeToast } = useToast();

    const { PWAInstalled } = inject<any>("PWA")

	const iconMap = {
		info: "ri:information-2-fill",
		success: "ri:checkbox-circle-fill",
		error: "ri:close-circle-fill",
		warning: "ri:alert-fill",
	};

	const toastStyles = (type: string) => {
		return {
			"text-blue-500 ": type === "info",
			"text-green-500 ": type === "success",
			"text-red-500 ": type === "error",
			"text-yellow-500 ": type === "warning",
		};
	};
</script>

<style scoped>
	.toast-enter-active,
	.toast-leave-active {
		transition: opacity 0.1s ease, transform 0.1s ease;
	}
	.toast-enter-from,
	.toast-leave-to {
		opacity: 0;
		transform: translateY(10px);
	}
</style>
