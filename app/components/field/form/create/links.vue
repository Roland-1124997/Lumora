<template>
	<FieldFormBaseLayer class="mb-5" :callback :url :onSuccess :onError :method :resize :schema label="Generate">
		<template v-slot="{ errors }">
			<div class="py-3 mt-5 border-y h-fit">
				<field name="LinkExpiry" v-slot="{ field, meta }: any" v-model="newLinkExpiry">
					<div class="relative mt-1 mb-4 space-y-2">
						<label class="text-sm font-medium text-gray-700" for="LinkExpiry">
							Link Expiration
							<transition name="fade">
								<span v-if="meta.validated && !meta.valid" class="text-red-700"> ({{ meta.errors[0] || "There is an issue with this field" }}) </span>
							</transition>
						</label>
						<div @click="isDropdownOpen = !isDropdownOpen" class="flex items-center justify-between w-full p-2 pl-3 bg-white border rounded-md cursor-pointer">
							{{ expiryOptions.find((o) => o.value === newLinkExpiry)?.label }}
							<icon :name="isDropdownOpen ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" size="1.4rem" />
						</div>
						<ul v-if="isDropdownOpen" class="absolute left-0 z-50 w-full mt-1 overflow-scroll bg-white border rounded-md shadow-md">
							<li
								v-for="option in expiryOptions"
								:key="option.value"
								@click="
									newLinkExpiry = option.value;
									isDropdownOpen = false;
								"
								class="p-2 border-b cursor-pointer hover:bg-gray-100"
							>
								{{ option.label }}
							</li>
						</ul>
					</div>
				</field>
				<field name="UsageLimit" v-slot="{ field, meta }: any" v-model="newLinkUsageLimit">
					<div class="relative mt-1 mb-4 space-y-2">
						<label class="text-sm font-medium text-gray-700" for="UsageLimit">
							Usage Limit
							<transition name="fade">
								<span v-if="meta.validated && !meta.valid" class="text-red-700"> ({{ meta.errors[0] || "There is an issue with this field" }}) </span>
							</transition>
						</label>
						<input />
						<div @click="isUsageDropdownOpen = !isUsageDropdownOpen" class="flex items-center justify-between w-full p-2 pl-3 bg-white border rounded-md cursor-pointer">
							{{ usageOptions.find((o) => o.value === newLinkUsageLimit)?.label }}
							<icon :name="isUsageDropdownOpen ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" size="1.4rem" />
						</div>
						<ul v-if="isUsageDropdownOpen" class="absolute left-0 z-50 w-full h-[5.25rem] mt-1 overflow-scroll bg-white border rounded-md shadow-md">
							<li
								v-for="option in usageOptions"
								:key="option.value"
								@click="
									newLinkUsageLimit = option.value;
									isUsageDropdownOpen = false;
								"
								class="p-2 border-b cursor-pointer hover:bg-gray-100"
							>
								{{ option.label }}
							</li>
						</ul>
					</div>
				</field>
				<p class="mt-1 text-red-700">
					{{ errors.message }}
				</p>
			</div>
		</template>
	</FieldFormBaseLayer>
</template>

<script setup lang="ts">
	import { toTypedSchema } from "@vee-validate/zod";
	import * as zod from "zod";

	const newLinkExpiry = ref("7days");
	const newLinkUsageLimit = ref("5");

	const isDropdownOpen = ref(false);
	const isUsageDropdownOpen = ref(false);

	watch(isDropdownOpen, (value) => {
		if (isUsageDropdownOpen.value) isUsageDropdownOpen.value = !value;
	});

	const expiryOptions = [
		{ label: "1 Day", value: "1day" },
		{ label: "7 Days", value: "7days" },
		{ label: "30 Days", value: "30days" },
		{ label: "Never Expires", value: "never" },
	];

	const usageOptions = [
		{ label: "1 Use", value: "1" },
		{ label: "5 Uses", value: "5" },
		{ label: "10 Uses", value: "10" },
		{ label: "25 Uses", value: "25" },
		{ label: "Unlimited", value: "unlimited" },
	];

	const { url, onSuccess, onError, method } = defineProps({
		callback: { type: Function, required: false },
		url: { type: String, required: true },
		onSuccess: { type: Function, required: true },
		onError: { type: Function, required: true },
		method: { type: String, default: "POST" },
		resize: { type: Boolean, default: false },
	});

	const schema = toTypedSchema(
		zod.object({
			LinkExpiry: zod.enum(["1day", "7days", "30days", "never"], {
				message: "Invalid value for Link Expiry",
			}),
			UsageLimit: zod.enum(["1", "5", "10", "25", "unlimited"], {
				message: "Invalid value for Usage Limit",
			}),
		})
	);
</script>
