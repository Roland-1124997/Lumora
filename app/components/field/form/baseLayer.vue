<template>
	<Form class="w-full space-y-6" :validation-schema="schema" v-slot="{ meta, errors }: any" @submit="handleSubmit">
		<slot :errors="errors"></slot>
		<button :disabled="loading" class="flex items-center justify-center w-full h-12 text-base font-semibold text-white border bg-[#756145]/80 rounded-xl hover:bg-[#756145]">
			<UtilsLoader :loading :label :numberCount="3" />
		</button>
	</Form>
</template>

<script setup lang="ts">
	const { requestUrl, onSuccess, onError, method, callback } = defineProps({
		requestUrl: { type: String, required: true },
		callback: { type: Function, required: false },
		onSuccess: { type: Function, required: true },
		onError: { type: Function, required: true },
		method: { type: String, default: "POST" },
		schema: { type: Object, required: true },
		label: { type: String, required: true },
		
	});

	const loading = ref(false);
	
	// Handle form submission and validation using Vee-Validate
	const handleSubmit = async (values: Record<string, any>, actions: Record<string, any>) => {
		loading.value = true;
		
		if(method == "DELETE") await new Promise((resolve) => setTimeout(resolve, 2000));

		if(method == "GET") {

			await new Promise((resolve) => setTimeout(resolve, 1000));
			if (callback) callback()

			await new Promise((resolve) => setTimeout(resolve, 600));
			return navigateTo(`/${requestUrl.split("/")[2]}/${values.invite_link}`)

		}

		if (values.remember) {
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

		await $fetch(requestUrl, { method: method as "GET" | "POST" | "PUT" | "DELETE" | "PATCH", body: values })
			.then((response) => {
				onSuccess({ response, actions })
				if (callback) callback()
			})
			.catch((error) => onError({ error, actions }))
			.finally(() => loading.value = false);
	};
</script>
