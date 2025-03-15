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
			<button v-if="content?.permision?.delete" @click="deleteData" class="flex items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-black border border-black rounded-xl w-fit">delete</button>
		</div>

		<hr class="pb-3" />

		<div class="p-4 border rounded-xl">
			<h1 class="mb-3 font-bold">Group details</h1>
			<hr class="mb-2" />

			<field name="name" v-slot="{ field, meta }: any">
				<div class="space-y-2">
					<label class="text-sm font-medium text-gray-700" for="name"> Group name
						<transition name="fade">
							<span v-if="meta.validated && !meta.valid" class="text-red-700 ">({{ meta.errors[0] || "Er is een probleem met dit veld" }})</span>
						</transition>
					</label>
					
					<div class="flex gap-2">
						<input :disabled="!content?.permision?.delete" v-model="content.name" placeholder="Enter a unique and catchy name!" v-bind="field" id="name" type="text" :class="meta.validated && !meta.valid ? ' btn-Input-Error' : 'btn-Input'" class="z-10 w-full p-2 px-3 transition-colors duration-300 border appearance-none rounded-xl" />
					</div>
				</div>
			</field>

			
			<field name="description" v-slot="{ field, meta }: any">
				<div class="mt-1 space-y-2 ">
					<label class="text-sm font-medium text-gray-700" for="description">
						Description 
						<transition name="fade">
							<span v-if="meta.validated && !meta.valid" class="text-red-700">({{ meta.errors[0] || "Er is een probleem met dit veld" }})</span>
						</transition>
					</label>
					<div class="flex gap-2">
						<textarea :disabled="!content?.permision?.delete" v-model="content.description" v-bind="field" placeholder="Describe what your group is about!" id="description" type="text" :class="meta.validated && !meta.valid ? ' btn-Input-Error' : 'btn-Input'" class="z-10 w-full p-2 px-3 transition-colors duration-300 border appearance-none max-h-36 min-h-36 rounded-xl"></textarea>
					</div>
				</div>
			</field>

			<button v-if="content?.permision?.delete" class="flex items-center justify-center gap-2 p-2 px-8 mt-2 text-sm text-white bg-black border border-black rounded-xl w-fit">
				Edit
			</button>
			
		</div>
	</div>
</template>

<script setup lang="ts">
	const group_id = useRoute().params.group_id;
	const content = ref();

	await $fetch(`/api/moments/settings/${group_id}`)
		.then((response: ApiResponse<Group>) => (content.value = response.data))
		.catch((error) => {
			throw createError({
				statusCode: error.data.meta.code,
				message: error.data.meta.message,
				fatal: true,
			});
		});

	const activeTab = ref("General");

	const setActiveTab = async (tab: string) => {
		activeTab.value = tab;
	};

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
</script>
