<template>
	<Form class="w-full space-y-6" :validation-schema="schema" v-slot="{ meta, errors }: any" @submit="handleSubmit">
		<slot :errors="errors"></slot>
		<div class="flex items-center justify-between w-full gap-2">
			<div v-if="resize" :class="!loading ? 'opacity-50' : ''" @click="hanleMinimizeModal" class="flex items-center justify-center w-fit px-2 h-12 text-base font-semibold text-[#756145] border border-[#756145]/80 rounded-xl hover:border-[#756145]">
				<Icon name="ri:expand-diagonal-2-line" size="2em"></Icon>
			</div>

			<div v-if="onReturn" @click="onReturn()" class="flex items-center h-12 gap-2 px-4 py-2 font-medium text-gray-700 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
				<Icon name="material-symbols:arrow-back-ios-new-rounded" class="w-4 h-4" />
			</div>
			
			<button v-if="label" :disabled="loading" class="flex items-center justify-center w-full h-12 text-base font-semibold text-white border bg-[#756145]/80 rounded-xl hover:bg-[#756145]">
				<UtilsLoader :loading :label :numberCount="3" />
			</button>
		</div>
	</Form>
</template>
<script setup lang="ts">
	const { requestUrl, onSuccess, onError, method, callback, resize } = defineProps({
		requestUrl: { type: String, required: true },
		callback: { type: Function, required: false },
		onSuccess: { type: Function, required: true },
		onError: { type: Function, required: true },
		onReturn: { type: Function, required: false },
		method: { type: String, default: "POST" },
		schema: { type: Object, required: true },
		label: { type: String, required: false },
		resize: { type: Boolean, default: false },
	});

	const modalStatus: any = defineModel();

	const loading = ref(false);

	const abortController: AbortController | null | any = ref(modalStatus.value?.controller);

	const hanleMinimizeModal = () => {
		if (!loading.value) return;
		modalStatus.value.minimized = !modalStatus.value.minimized;
	};

	watch(loading, (value) => {
		try {
			modalStatus.value.loading = value;
		} catch {}
	});

	const { addToast } = useToast();

	// Handle form submission and validation using Vee-Validate
	const handleSubmit = async (values: Record<string, any>, actions: Record<string, any>) => {
		loading.value = true;

		if (method == "DELETE") await new Promise((resolve) => setTimeout(resolve, 2000));

		if (method == "GET") {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			if (callback) callback();

			await new Promise((resolve) => setTimeout(resolve, 600));
			return navigateTo(`/${requestUrl.split("/")[2]}/${values.invite_link}`);
		}

		if(values.remember) {
			const remember = useLocalStorage("user-email", undefined) as Ref<string | undefined>;
			remember.value = values.remember ? values.email : undefined;
		}

		if (values.thumbnail || values.images) {
			const formData = new FormData();

			for (const key in values) {
				if (key === "images") {
					values[key].forEach((file: File, index: number) => {
						const blob = new Blob([file], { type: file.type });
						formData.append(`file:images[${index}]`, blob, file.name);
					});
				} else if (key === "thumbnail") {
					const blob = new Blob([values[key]], { type: values[key]?.type });
					formData.append(`file:thumbnail`, blob, values[key]?.name);
				} else {
					formData.append(key, values[key]);
				}
			}

			values = formData;
		}

		$fetch(requestUrl, {
			method: method as "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
			body: values,
			signal: abortController.value?.signal,
		})
			.then((response) => {
				onSuccess({ response, actions });
				if (callback) callback();
			})
			.catch((error) => {
				if (error.message.includes("aborted")) {
					setTimeout(() => {
						addToast({
							message: "The request has been canceled.",
							type: "error",
							duration: 5000,
						});
					}, 1000);
				} else onError({ error, actions });
			})
			.finally(() => {
				loading.value = false;
				abortController.value = new AbortController();
			});
	};
</script>
