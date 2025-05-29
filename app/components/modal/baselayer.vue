<template>
	<div>
		<Transition name="modal">
			<div v-if="status && modalStatus.minimized" class="fixed z-50 flex items-start justify-center transform bottom-5 right-[7.8rem] md:bottom-[0.85rem] md:right-[18.5rem] w-fit">
				<div tabindex="0">
					<Transition name="modalDelay">
						<div ref="modalDelay" v-if="DelayStatus">
							<div class="w-[15.55rem] px-3 p-1 bg-white shadow-xl border rounded-2xl">
								<div class="flex items-center justify-between gap-2">
									
									<div class="w-full h-5 overflow-hidden bg-gray-200 rounded-full">
										<div v-if="modalStatus.loading" class="h-full bg-[#756145]/80 loading-bar rounded-full"></div>
									</div>
									<button class="mt-1 " @click="closeModal">
										<Icon name="ri:close-circle-line" size="1.4em"></Icon>
									</button>
								</div>
							</div>
						</div>
					</Transition>
				</div>
			</div>

			<div v-else-if="status" class="fixed top-0 left-0 z-50 flex items-end justify-center w-screen h-full bg-black md:justify-center md:items-center bg-opacity-60 backdrop-blur-sm">
				<div tabindex="0" class="mx-6 outline-none md:mb-0 rounded-xl" ref="modal">
					<Transition name="modalDelay">
						<div ref="modalDelay" v-if="DelayStatus">
							<div class="w-screen max-w-2xl p-5 bg-white h-fit rounded-2xl">
								<div class="flex items-center justify-between mb-2">
									<h1 class="text-3xl font-bold">{{ modalStatus.name }}</h1>
									<button @click="closeModal">
										<Icon name="ri:close-fill" size="2em"></Icon>
									</button>
								</div>
								<slot></slot>
							</div>
						</div>
					</Transition>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script lang="ts" setup>
	const modalStatus: any = defineModel();
	const status = ref<boolean>(false);
	const DelayStatus = ref<boolean>(false);
	const modal = ref(null);

	watch(modalStatus, (value: any) => {
		if (value.open) {
			status.value = value;
			setTimeout(() => {
				DelayStatus.value = value;
			}, 300);
		} else if (value.reload) {
			DelayStatus.value = false;
			setTimeout(() => {
				DelayStatus.value = true;
			}, 500);
		} else {
			DelayStatus.value = value;
			setTimeout(() => {
				status.value = value;
			}, 100);
		}
	});

	onClickOutside(modal, () => closeModal());

	const closeModal = () => {
		modalStatus.value?.controller.abort()
		modalStatus.value = false
	};
</script>

<style scoped>
	.modal-enter-active,
	.modal-leave-active {
		transition: all 0.8s ease;
	}

	.modal-enter-from,
	.modal-leave-to {
		opacity: 0;
	}

	.modalDelay-enter-active,
	.modalDelay-leave-active {
		transition: all 1s ease;
	}

	.modalDelay-enter-from,
	.modalDelay-leave-to {
		opacity: 0;
		transform: translateY(12em);
	}

	@keyframes slide {
		0% {
			transform: translateX(-100%); 
		}
		100% {
			transform: translateX(100%);
		}
	}

	.loading-bar {
		width: 100%;
		animation: slide 4s infinite linear;
	}
</style>
