<template>
	<div>
		<div class="sticky z-50 pt-3 -mt-5 bg-white -top-4">
			<div class="flex items-center justify-between w-full gap-2 mb-3 md:justify-end">
				<button :disabled="disabled || loading" @click="clickButton" class="flex items-center justify-center w-full gap-2 p-2 md:px-4 px-1 text-[#756145] border border-[#756145] hover:bg-gray-100 disabled:hover:bg-white disabled:opacity-50 rounded-xl md:w-fit">
					<icon v-if="loading" class="animate-spin" size="1.50rem" name="ri:refresh-line" />
					<span class="flex items-center justify-center gap-2" v-else>
						<icon size="1.2rem" name="ri:user-fill" />
						Update
					</span>
				</button>
				<button :disabled="disabled || loading_password" @click="clickPasswordButton" class="flex items-center justify-center w-full gap-2 p-2 md:px-4 px-1 text-[#756145] border border-[#756145] hover:bg-gray-100 disabled:hover:bg-white disabled:opacity-50 rounded-xl md:w-fit">
					<icon v-if="loading_password" class="animate-spin" size="1.50rem" name="ri:refresh-line" />
					<span class="flex items-center justify-center gap-2" v-else>
						<icon size="1.2rem" name="ri:lock-password-fill" />
						Update
					</span>
				</button>
				<button @click="logout" class="flex w-full md:w-32 items-center justify-center gap-2 p-2 px-4 text-sm text-white bg-[#756145] border border-[#756145] rounded-xl">Logout</button>
			</div>
			<hr class="pb-3 mt-3" />
		</div>
		<div :class="PWAInstalled ? 'pb-32' : 'pb-20'" class="flex flex-col gap-4 overflow-scroll">
			<div class="p-4 border rounded-xl">
				<Form :validation-schema="schema" v-slot="{ meta, errors }: any" @submit="handleSubmit">
					<div class="flex items-center justify-between mb-1">
						<h1 class="font-bold">Profile</h1>
						<button ref="hidden" class="sr-only"></button>
					</div>
					<p class="text-sm text-red-700" v-if="disabled"> Disabled you are signed in with {{ user.data.provider }}</p>
					<p class="mb-3 text-sm text-gray-500">Update your account information and profile picture.</p>
					<hr class="mb-2" />
					<div class="flex flex-col w-full gap-2">
						<FieldInput :disabled="disabled || loading" name="username" label="Display name" :required="!disabled" :initialValue="username" />
						<FieldInputEmail :disabled="disabled || loading" name="email" label="Email" :required="!disabled" :initialValue="email" />
					</div>
				</Form>
			</div>
			<div class="p-4 border rounded-xl">
				<Form :validation-schema="schema_password" v-slot="{ meta, errors }: any" @submit="handlePasswordSubmit">
					<div class="flex items-center justify-between mb-1">
						<h1 class="font-bold">Password</h1>
						<button ref="hidden-password" class="sr-only"></button>
					</div>
					<p class="text-sm text-red-700" v-if="disabled"> Disabled you are signed in with {{ user.data.provider }}</p>
					<p class="mb-3 text-sm text-gray-500">Change your password to keep your account secure.</p>
					<hr class="mb-2" />
					<div>
						<div class="flex flex-col w-full gap-2">
							<FieldInputPassword :disabled="disabled || loading_password" name="New_password" label="New Password" :required="!disabled" rerender enableToggle />
							<FieldInputPassword :disabled="disabled || loading_password" name="Confirm_password" label="Confirm Password" :required="!disabled" rerender enableToggle />
						</div>
					</div>
				</Form>
			</div>
			<div class="p-4 border rounded-xl">
				<div>
					<div class="flex items-center justify-between mb-1">
					<h1 class="font-bold">Security</h1>
					</div>
					<p class="mb-3 text-sm text-gray-500">Enhance the security of your account.</p>
					<hr class="mb-2" />
					<button class="flex items-center justify-between w-full p-3 text-left border-2 border-dashed rounded-md ">
						<div>
							<div class="font-bold">Enable Multi-Factor</div>
							<div class="text-xs opacity-70">Add an extra layer of security</div>
						</div>
						<label for="mfa" class="cursor-pointer">
							<input type="checkbox" name="mfa" id="mfa" aria-labelledby="mfa" v-model="mfa_active" class="sr-only" />
							<div class="w-12 h-6 p-1 transition duration-300 bg-gray-200 rounded-full" :class="{ ' bg-yellow-800': mfa_active, 'bg-gray-300 ':  !mfa_active, }">
								<div class="w-4 h-4 mt-[0.020rem] transition duration-300 transform bg-white rounded-full shadow-md" :class="{ 'translate-x-6': mfa_active }"></div>
							</div>
						</label>
					</button>
				</div>
			</div>

			<div class="p-4 border rounded-xl">
				<div>
					<div class="flex items-center justify-between mb-1">
						<h1 class="font-bold">Danger zone</h1>
					</div>
					<p class="mb-3 text-sm text-gray-500">Irreversible and destructive actions.</p>
					<hr class="mb-2" />
					<button @click="createDeleteFunction" class="w-full p-3 text-left text-red-700 border-2 border-red-300 border-dashed rounded-md bg-red-50">
						<div class="font-bold">Delete Account</div>
						<div class="text-xs opacity-70">Permanently delete your account and all of your data. This action cannot be undone.</div>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { toTypedSchema } from "@vee-validate/zod";
	import * as zod from "zod";

	useHead({
		htmlAttrs: {
			lang: "en",
		},
	});

	useSeoMeta({
		title: "Lumora - Account",
		description: "Manage your Lumora account, update your profile, and access your shared moments.",
		ogTitle: "Lumora - Account",
		ogDescription: "Access and manage your Lumora account, update your profile, and view your shared photos and memories.",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "/",
		twitterTitle: "Lumora - Account",
		twitterDescription: "Manage your Lumora account, update your settings, and access your shared moments.",
		twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary",
	});

	definePageMeta({
		middleware: "unauthorized",
	});

	/*
	 ************************************************************************************
	 */

	const { PWAInstalled } = inject<any>("PWA");
	const { updateUsername } = inject<any>("username");
	const { addToast } = useToast();

	const store = useSessionsStore();

	const button = templateRef("hidden");
	const password_button = templateRef("hidden-password");

	const clickButton = () => button.value.click();
	const clickPasswordButton = () => password_button.value.click();

	/*
	 ************************************************************************************
	 */

	const user = await store.getSession();

	const mfa_active = ref(user.data.factors)
	const username = ref(user.data.name);
	const email = ref(user.data.email);
	const disabled = ref(user.data.provider !== "email");

	/*
	 ************************************************************************************
	 */

	const schema = toTypedSchema(
		zod.object({
			username: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).min(6, { message: "Must be at least be 6 chars long" }).max(16, { message: "Must be at most 16 chars long" }),
			email: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).email({ message: "Must be a valid email" }),
		})
	);

	const schema_password = toTypedSchema(
		zod.object({
			New_password: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).min(8, { message: "Must be at least 8 characters long" }),
			Confirm_password: zod.string({ message: "This field is required" }),
		})
		.refine((data) => data.New_password === data.Confirm_password, {
			message: "Passwords do not match",
			path: ["Confirm_password"],
		})
	);

	/*
	 ************************************************************************************
	 */

	const loading = ref(false);
	const handleSubmit = async (values: Record<string, any>, actions: Record<string, any>) => {
		loading.value = true;

		await new Promise((resolve) => setTimeout(resolve, 2000));
		await $fetch("/api/user", { method: "patch", body: values })
			.then(async (response) => {
				updateUsername(response.data.name);
				addToast({
					message: `User profile have been updated`,
					type: "success",
					duration: 5000,
				});
			})
			.catch((error) => {
				if (error.data.error?.type == "fields") actions.setErrors(error.data.error.details);
				addToast({
					message: `Something went wrong updating the user profile`,
					type: "error",
					duration: 5000,
				});
			})
			.finally(() => (loading.value = false));
	};

	/*
	 ************************************************************************************
	 */
	const loading_password = ref(false);
	const handlePasswordSubmit = async (values: Record<string, any>, actions: Record<string, any>) => {
		loading_password.value = true;

		await new Promise((resolve) => setTimeout(resolve, 2000));
		await $fetch("/api/user", { method: "put", body: values })
			.then(async (response) => {
				setTimeout(() => navigateTo(response.status.redirect), 500);
				addToast({
					message: `Password has been updated`,
					type: "success",
					duration: 5000,
				});
			})
			.catch((error) => {
				if (error.data.error?.type == "fields") actions.setErrors(error.data.error.details);
				addToast({
					message: `Something went wrong updating the password`,
					type: "error",
					duration: 5000,
				});
			})
			.finally(() => {
				loading_password.value = false;
			});
	};

	/*
	 ************************************************************************************
	 */

	const { updateModalValue } = inject<any>("modal");

	const createDeleteFunction = () => {
		updateModalValue({
			open: true,
			type: "negative:account",
			name: "Alert",
			requestUrl: `/api/auth`,
			onSuccess: handleSuccess,
			onError: handleError,
		});
	};

	const handleSuccess = async ({ response }: SuccessResponse<null>) => {
		if (response.status.redirect) {
			setTimeout(() => navigateTo(response.status.redirect), 500);

			setTimeout(() => {
				addToast({
					message: `Your account has been deleted`,
					type: "success",
					duration: 5000,
				});
			}, 800);
		}
	};

	const handleError = async ({ error, actions }: ErrorResponse) => {
		actions.setErrors({ message: ["An error occurred, unable to delete the group! Please try again later."] });
	};

	/*
	 ************************************************************************************
	 */



	
	watch(mfa_active, async (value) => {
		if(value) {
			updateModalValue({
				open: true,
				type: "create:totp",
				name: "Authentication",
				requestUrl: ``,
				onSuccess: () => {},
				onError: () => {},
			});
		} else {
			updateModalValue({
				open: true,
				type: "negative:totp",
				name: "Authentication",
				requestUrl: `/api/auth/totp`,
				onSuccess: handleDeleteMFASuccess,
				onError: handleDeleteMFAError,
			});
		}
	})

	const handleDeleteMFASuccess = async () => {
		setTimeout(() => {
			addToast({
				message: `MFA disabled successfully.`,
				type: "success",
				duration: 5000,
			});
		}, 800);
	};

	const handleDeleteMFAError = async ({ error, actions }: ErrorResponse) => {
		actions.setErrors({ message: ["An error occurred, unable to delete the group! Please try again later."] });
	};

	/*
	 ************************************************************************************
	 */

	const logout = () => {
		$fetch("/api/auth/logout", { method: "POST" }).then((response) => {
			store.clearSession();
			navigateTo(response.status.redirect);
		});
	};
</script>
