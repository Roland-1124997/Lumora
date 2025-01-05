<template>
	<Form class="space-y-6" :validation-schema="schema" v-slot="{ meta }: any" @submit="handleSubmit">
		<div class="space-y-4">
			<FieldInputEmail name="email" placeholder="Enter your email" :required="true" :initalvalue />
			<FieldInputPassword name="wachtwoord" placeholder="Enter your password" :required="true" :enableToggle="true" />
		</div>

		<div class="flex justify-between">
			<FieldInputCheckBox name="remember" label="Remember me" :initalvalue />
			<NuxtLink class="text-sm font-medium text-[#817a70] hover:text-[#6e675d]" to="/"> Forgot Password? </NuxtLink>
		</div>

		<button type="submit" class="w-full border h-12 flex items-center justify-center text-base font-semibold text-white bg-[#817a70] hover:bg-[#6e675d] rounded-xl">
			<UtilsLoader :loading label="Login" :numberCount="3" />
		</button>
	</Form>
</template>

<script setup lang="ts">
	const { requestUrl, onSuccess, onError, method, type } = defineProps({
		requestUrl: { type: String, required: true },
		onSuccess: { type: Function, required: true },
		onError: { type: Function, required: true },
		method: { type: String, default: "POST" },
		schema: { type: Object, required: true },
		type: { type: String, required: true },
	});

	const remember = useLocalStorage("user-email", undefined) as Ref<string | undefined>;
	const initalvalue = computed(() => {
		return remember.value;
	});

	const loading = ref(false);

	// Handle form submission and validation using Vee-Validate
	const handleSubmit = async (values: Record<string, any>, actions: Record<string, any>) => {
		loading.value = true;
		remember.value = values.remember ? values.email : undefined;

		await $fetch(requestUrl, { method: method as "GET" | "POST" | "PUT" | "DELETE" | "PATCH", body: values })
			.then((response) => onSuccess({ response, actions }))
			.catch((error) => onError({ error, actions }))
			.finally(() => (loading.value = false));
	};
</script>
