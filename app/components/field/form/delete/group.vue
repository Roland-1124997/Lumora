<template>
	<FieldFormBaseLayer class="mb-5" :callback :requestUrl :onSuccess :onError :method :resize :schema label="Confirm">
		<template v-slot="{ errors }">
			<div class="py-3 mt-5 border-y h-fit">
				<div class="flex flex-col items-center justify-center w-full h-full gap-5 my-6">
					<icon class="text-[#756145]" name="ri:alert-line" size="8em" />
					<h1 class="text-lg font-bold text-center text-balance">
						<span v-if="type.split(':')[1] == 'leave'"> Cancel membership? </span>
						<span v-else-if="type.split(':')[1] == 'Reject'"> Reject join request?</span>
						<span v-else> Kick member? </span>
					</h1>
					<p v-if="type.split(':')[1] == 'leave'" class="-mt-5 text-center text-balance">You can always rejoin this group if you have a link.</p>
					<p v-else-if="type.split(':')[1] == 'Reject'" class="-mt-5 text-center text-balance">
						the member wont be part of the group but thay can try again with the same link
					</p>
					<p v-else class="-mt-5 text-center text-balance">The user will no longer be a member of this group unless they have a link.</p>
					<p class="text-center text-red-700">
						{{ errors.message }}
					</p>
				</div>
			</div>
		</template>
	</FieldFormBaseLayer>
</template>

<script setup lang="ts">
	import { toTypedSchema } from "@vee-validate/zod";
	import * as zod from "zod";

	const { requestUrl, onSuccess, onError, method } = defineProps({
		callback: { type: Function, required: false },
		requestUrl: { type: String, required: true },
		onSuccess: { type: Function, required: true },
		onError: { type: Function, required: true },
		method: { type: String, default: "DELETE" },
		type: { type: String, required: true },
		resize: { type: Boolean, default: false },
	});

	const schema = toTypedSchema(zod.object({}));
</script>
