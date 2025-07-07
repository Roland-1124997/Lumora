<template>
	<FieldFormBaseLayer class="mb-5" :callback :url :onSuccess :onError :method :resize :schema label="Confirm">
		<template v-slot="{ errors }">
			<div class="py-3 mt-5 border-y h-fit">
				<field name="invite_link" v-slot="{ field, meta }: any" v-model="inputValue">
					<div class="relative mt-1 mb-4 space-y-2">
						<label class="text-sm font-medium text-gray-700" for="invite_link">
							Invite Link
							<transition name="fade">
								<span v-if="meta.validated && !meta.valid" class="text-red-700"> ({{ meta.errors[0] || "There is a problem with this field." }}) </span>
							</transition>
						</label>
						<div class="relative">
							<span class="absolute inset-y-0 left-0 flex items-center pl-3" :class="meta.validated && !meta.valid ? '' : ' text-gray-400'">
								<icon name="ri:attachment-2" size="1.4em"></icon>
							</span>
							<input v-bind="field" v-model="inputValue" @input="onInput" id="invite_link" type="url" :class="meta.validated && !meta.valid ? 'btn-Input-Error' : 'btn-Input'" class="z-10 w-full p-2 px-10 transition-colors duration-300 border appearance-none rounded-xl" placeholder="http://llumora/invitations/..." autocomplete="off" />
						</div>
					</div>
				</field>

				<div class="p-4 space-y-3 rounded-lg bg-gray-50">
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium text-gray-700">Quick Actions</span>
						<div class="p-1 px-3 text-sm bg-gray-200 rounded-xl">Optional</div>
					</div>
					<div @click="pasteFromClipboard" class="flex items-center justify-start w-full gap-2 pl-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 h-9">
						<icon name="ri:file-copy-line" size="1.2em"></icon>
						Paste from clipboard
					</div>
				</div>
				<div v-if="error" class="mt-1 text-sm font-medium text-gray-700">
					<transition name="fade">
						<span  class="text-red-700"> {{ message }} </span>
					</transition>
				</div>
			</div>
		</template>
	</FieldFormBaseLayer>
</template>

<script setup lang="ts">
	import { toTypedSchema } from "@vee-validate/zod";
	import * as zod from "zod";

	const inputValue = ref("");
	const link = ref("");

	const onInput = (event: any) => {
		const value = event.target.value;
		const match = value.match(/\/invitations\/([a-zA-Z0-9\-]+)/);
		link.value = match ? match[1] : "";
	};

	const error = ref(false)
	const message = ref()

	const pasteFromClipboard = async () => {
		try {
			
			const text = await navigator.clipboard.readText();
			if (text) {
				inputValue.value = text;
				onInput({ target: { value: text } });
			} else {
				error.value = true
				message.value = "Clipboard is empty. Please copy your invite link first."
			}
		} catch (e) {
			error.value = true
			message.value = "Automatic pasting is not supported on your device. Please long-press the field and choose 'Paste'."
		}
	};

	const { url, onSuccess, onError, method } = defineProps({
		callback: { type: Function, required: false },
		url: { type: String, required: true },
		onSuccess: { type: Function, required: true },
		onError: { type: Function, required: true },
		method: { type: String, default: "GET" },
		resize: { type: Boolean, default: false },
	});

	const schema = toTypedSchema(
		zod.object({
			invite_link: zod
				.string({ message: "This field is required" })
				.nonempty({ message: "This field is required" })
				.regex(/^https?:\/\/[^\s/]+\/invitations\/[a-fA-F0-9\-]+(\?token=[A-Za-z0-9]+)?$/, { message: "Please enter a valid invite link" }),
		})
	);
</script>
