<template>
	<div>
		<div class="flex items-center justify-between w-full gap-3 mb-3 -mt-4">
			<div class="flex items-center gap-2 justify-evenly p-1 border rounded-xl w-full md:w-[20rem] overflow-hidden bg-gray-100">
				<button @click="setActiveTab('General')" :class="activeTab == 'General' ? 'bg-white font-bold' : ''" class="flex items-center justify-center w-full p-1 rounded-lg">
					<span class="text-sm">General</span>
				</button>
				<span class="text-sm text-gray-400">|</span>
				<button @click="setActiveTab('Members')" :class="activeTab == 'Members' ? 'bg-white font-bold' : ''" class="flex items-center justify-center w-full py-1 rounded-lg">
					<span class="text-sm">Members</span>
				</button>
				<span class="text-sm text-gray-400">|</span>
				<button @click="setActiveTab('Invite')" :class="activeTab == 'Invite' ? 'bg-white font-bold' : ''" class="flex items-center justify-center w-full py-1 rounded-lg">
					<span class="text-sm">Invites</span>
				</button>
			</div>
			<button v-if="content?.permision?.delete" @click="deleteData" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-black border border-black rounded-xl w-fit">Delete</button>
			<button v-else class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-black border border-black rounded-xl w-fit">Leave<span class="hidden md:flex">group</span></button>
		</div>

		<hr class="pb-3" />

		<div class="grid h-[70vh] gap-4 md:grid-cols-2">
			<div class="p-4 border rounded-xl">
				<Form :validation-schema="schema" v-slot="{ meta, errors }: any" @submit="handleSubmit">
					<div class="flex items-center justify-between mb-3">
						<h1 class="font-bold">Group details</h1>

						<button :disabled="loading" v-if="content?.permision?.delete" class="flex w-32 md:w-28 items-center justify-center gap-2 p-[0.35rem] px-3 text-sm text-white bg-black border border-black rounded-xl">
							<icon v-if="loading" class="animate-spin" size="1.2rem" name="ri:refresh-line" />
							<span v-else> Save changes </span>
						</button>
					</div>

					<hr class="mb-2" />

					<field name="name" v-slot="{ field, meta }: any" v-model="name">
						<div class="space-y-2">
							<label class="text-sm font-medium text-gray-700" for="name">
								Group name
								<transition name="fade">
									<span v-if="meta.validated && !meta.valid" class="text-red-700">({{ meta.errors[0] || "Er is een probleem met dit veld" }})</span>
								</transition>
							</label>

							<div class="flex gap-2">
								<input :disabled="!content?.permision?.delete || loading" placeholder="Enter a unique and catchy name!" v-bind="field" id="name" :value="name" type="text" ref="nameData" :class="meta.validated && !meta.valid ? ' btn-Input-Error' : 'btn-Input'" class="z-10 w-full p-2 px-3 transition-colors duration-300 border appearance-none rounded-xl" />
							</div>
						</div>
					</field>

					<field name="description" v-slot="{ field, meta }: any" v-model="description">
						<div class="mt-1 space-y-2">
							<label class="text-sm font-medium text-gray-700" for="description">
								Description
								<transition name="fade">
									<span v-if="meta.validated && !meta.valid" class="text-red-700"> ({{ meta.errors[0] || "Er is een probleem met dit veld" }}) </span>
								</transition>
							</label>
							<div class="flex gap-2">
								<textarea :disabled="!content?.permision?.delete || loading" v-bind="field" placeholder="Describe what your group is about!" id="description" :value="description" type="text" :class="meta.validated && !meta.valid ? ' btn-Input-Error' : 'btn-Input'" class="z-10 w-full p-2 px-3 transition-colors duration-300 border appearance-none resize-none max-h-24 min-h-24 rounded-xl"></textarea>
							</div>
						</div>
					</field>
				</Form>
			</div>

			<div class="p-4 border bg-gray-50 rounded-xl">
				<div v-for="(section, index) in config.sections" :key="index">
					<h1 class="mb-3 font-bold" :class="{ 'mt-4': index > 0 }">{{ section.title }}</h1>
					<hr class="my-3" />
					<div class="grid items-center gap-2">
						<div v-for="option in section.options" :key="option.key" class="flex items-center justify-between">
							<p>{{ option.label }}</p>
							<label class="cursor-pointer">
								<input :disabled="!content?.permision?.delete" type="checkbox" v-model="option.value" class="sr-only" />
								<div class="w-12 h-6 p-1 transition duration-300 bg-gray-200 rounded-full" :class="{ 'bg-gray-900': option.value && content?.permision?.delete, 'bg-gray-300 cursor-not-allowed': !content?.permision?.delete, 'bg-gray-600 cursor-not-allowed': option.value && !content?.permision?.delete }">
									<div class="w-4 h-4 mt-[0.020rem] transition duration-300 transform bg-white rounded-full shadow-md" :class="{ 'translate-x-6': option.value }"></div>
								</div>
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { toTypedSchema } from "@vee-validate/zod";
	import * as zod from "zod";

	const group_id = useRoute().params.group_id;
	const content = ref();

	const config = ref();

	/*
	 ************************************************************************************
	 */

	const { value: name }: any = useField<string>("name");
	const { value: description }: any = useField<string>("description");

	const activeTab = ref("General");
	const setActiveTab = async (tab: string) => (activeTab.value = tab);

	/*
	 ************************************************************************************
	 */

	await $fetch(`/api/moments/settings/${group_id}`)
		.then((response: any) => {
			content.value = response.data;
			name.value = response.data.name;
			config.value = response.data.configuration
			description.value = response.data.description;
		})
		.catch((error) => {
			throw createError({
				statusCode: error.data.meta.code,
				message: error.data.meta.message,
				fatal: true,
			});
		});

	/*
	 ************************************************************************************
	 */

	const deleteData = async () => {
		createDeleteFunction();
	};

	const { updateModalValue } = inject<any>("modal");

	const createDeleteFunction = () => {
		updateModalValue({
			open: true,
			type: "negative:groep",
			name: "Alert",
			requestUrl: `/api/moments/${group_id}`,
			onSuccess: handleSuccess,
			onError: handleError,
		});
	};

	const handleSuccess = async ({ response }: SuccessResponse<null>) => {
		if (response.status.redirect) setTimeout(() => navigateTo(response.status.redirect), 500);
	};

	const handleError = async ({ error, actions }: ErrorResponse) => {
		setTimeout(() => navigateTo(`/moments`), 500);
	};

	/*
	 ************************************************************************************
	 */

	const loading = ref(false);

	const schema = toTypedSchema(
		zod.object({
			name: zod.string({ message: "Dit is een verplicht veld" }).nonempty({ message: "Dit is een verplicht veld" }),
			description: zod.string({ message: "Dit is een verplicht veld" }).nonempty({ message: "Dit is een verplicht veld" }),
		})
	);

	const handleSubmit = async (values: Record<string, any>, actions: Record<string, any>) => {
		loading.value = true;

		console.log(values);

		await new Promise((resolve) => setTimeout(resolve, 2000));

		await $fetch(`/api/moments/${content.value.id}`, { method: "PATCH", body: values })
			.then(async (response) => {
				if (response.data.meta.refresh)
					await $fetch(`/api/moments/settings/${group_id}`)
						.then((response) => {
							content.value = response.data;
							name.value = response.data.name;
							config.value = response.data.configuration
							description.value = response.data.description;
						})
						.catch((error) => {
							throw createError({
								statusCode: error.data.meta.code,
								message: error.data.meta.message,
								fatal: true,
							});
						});
			})
			.catch(async (error) => {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				if (error.data.error?.type == "fields") actions.setErrors(error.data.error.details);
			})
			.finally(() => (loading.value = false));
	};
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
