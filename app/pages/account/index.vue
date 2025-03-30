<template>
	<div>
		<div :class="PWAInstalled ? 'pb-32' : 'pb-20'" class="flex flex-col gap-4 overflow-scroll">
			<div class="p-4 border rounded-xl">
				<Form :validation-schema="schema" v-slot="{ meta, errors }: any" @submit="handleSubmit">
					<div class="flex items-center justify-between mb-3">
						<h1 class="font-bold">Profile</h1>
						<button @click="logout" class="flex items-center justify-center gap-2 p-[0.35rem] px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
							<span class="">Logout</span>
						</button>
					</div>

					<hr class="mb-2" />

					<div  class="flex items-center space-x-3">
						<FieldInputImage label="thumbnail" name="thumbnail" />
						<div class="flex-1 w-full pl-3 space-y-2 border-l">
							<field name="name" v-slot="{ field, meta }: any" v-model="username">
								<input v-bind="field" placeholder="Enter a unique and catchy name!" :value="username" id="name" type="text" :class="meta.validated && !meta.valid ? ' btn-Input-Error' : 'btn-Input'" class="z-10 w-full p-2 px-3 transition-colors duration-300 border appearance-none rounded-xl" />
							</field>
						</div>
					</div>

					
					
					<field name="email" v-slot="{ field, meta }: any" v-model="email" >
						<div class="mt-2 space-y-2">
							<label class="text-sm font-medium text-gray-700" for="email">
								Email
								<transition name="fade">
									<span v-if="meta.validated && !meta.valid" class="text-red-700">({{ meta.errors[0] || "Er is een probleem met dit veld" }})</span>
								</transition>
							</label>

							<div class="flex gap-2">
								<input v-bind="field" id="email" :value="email" type="email" :class="meta.validated && !meta.valid ? ' btn-Input-Error' : 'btn-Input'" class="z-10 w-full p-2 px-3 transition-colors duration-300 border appearance-none disabled:bg-gray-50 rounded-xl" />
							</div>
						</div>
					</field>

					<button class="flex mt-3 items-center justify-center gap-2 p-[0.35rem] px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">
						Save changes
					</button>

					

				</Form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

	import { toTypedSchema } from "@vee-validate/zod";
	import * as zod from "zod";

	
	useHead({
		htmlAttrs: {
			lang: "nl",
		},
	});

	useSeoMeta({
		title: "Lumora - Account",
		description: "Bekijk de nieuwste en populairste posts op Lumora!",
		ogTitle: "Lumora",
		ogDescription: "Bekijk de nieuwste en populairste posts op Lumora!",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "/",
		twitterTitle: "Lumora",
		twitterDescription: "Bekijk de nieuwste en populairste posts op Lumora!",
		twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary",
	});

	definePageMeta({
		middleware: "unauthorized",
	});

	const { PWAInstalled } = inject<any>("PWA");
	const store = useSessionsStore();
	const { addToast } = useToast();


	const user = await store.getSession()

	const username = ref(user.data.name)
	const email = ref(user.data.email)

	const schema = toTypedSchema(
		zod.object({
			// name: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }),
			// description: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }),
		})
	);

	const handleSubmit = async (values: Record<string, any>, actions: Record<string, any>) => {
		addToast({
			message: `User settings have been updated`,
			type: "success",
			duration: 5000,
		});
	};
	

	const logout = () => {
		$fetch("/api/auth/logout", { method: "POST" }).then((response) => {
			store.clearSession();
			navigateTo(response.status.redirect);
		});
	};
</script>
