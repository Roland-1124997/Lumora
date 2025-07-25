<template>
	<FieldFormBaseLayer class="mb-5" :callback :url :onSuccess :onError :method :resize :schema label=" Post comment">
		<template v-slot="{ errors }">
			<div class="py-3 mt-5 border-y h-fit">
				<p class="text-gray-600 -mt-7">Share your thoughts with the community! Your comment will be visible to everyone.</p>

				<div class="mb-6">
					<div v-if="details?.content?.text" class="z-10 w-full p-2 px-3 mt-4 overflow-auto text-gray-500 transition-colors duration-300 bg-gray-100 border border-gray-300 appearance-none max-h-36 min-h-12 rounded-xl">
						<div class="flex items-center gap-2 mb-1 rounded-lg">
							<img v-if="details.author.url" :src="details.author.url" :alt="details.author.name" class="z-10 object-cover w-6 h-6 border border-gray-200 rounded-full" />
							<span class="gap-1 text-sm font-semibold text-gray-800 text-balance">
								{{ details?.author.name }}
								<span v-if="details?.author.owns_post" class="text-orange-500">OP</span>
							</span>
							<span class="text-xs text-gray-500">
								<UtilsTime :date="details?.created_at" />
							</span>
						</div>

						<p class="text-sm">
							{{ details.content.text }}
						</p>
					</div>
				</div>

				<field name="comment" v-slot="{ field, meta }: any">
					<div class="-mt-4 space-y-2">
						<label class="text-sm font-medium text-gray-700" for="comment">
							Message <span class="text-red-700">{{ "*" }}</span>
							<transition name="fade">
								<span v-if="meta.validated && !meta.valid" class="text-red-700">({{ meta.errors[0] || "There is an issue with this field" }})</span>
							</transition>
						</label>
						<div class="flex gap-2">
							<textarea v-bind="field" placeholder="" id="comment" type="text" :class="meta.validated && !meta.valid ? ' btn-Input-Error' : 'btn-Input'" class="z-10 w-full p-2 px-3 transition-colors duration-300 border border-gray-400 appearance-none max-h-36 min-h-36 rounded-xl"></textarea>
						</div>
					</div>
				</field>
				<p class="mt-2 text-red-700">
					{{ errors.message }}
				</p>
			</div>
		</template>
	</FieldFormBaseLayer>
</template>

<script setup lang="ts">
	import { toTypedSchema } from "@vee-validate/zod";
	import * as zod from "zod";

	const { url, onSuccess, onError, method, details } = defineProps({
		callback: { type: Function, required: false },
		url: { type: String, required: true },
		onSuccess: { type: Function, required: true },
		onError: { type: Function, required: true },
		method: { type: String, default: "POST" },
		resize: { type: Boolean, default: false },
		details: { type: Object, required: false, default: () => ({}) },
	});

	const schema = toTypedSchema(
		zod.object({
			comment: zod.string({ message: "This field is required" }).min(1, "This field is required").max(500, "Message must be less than 500 characters"),
			parent_id: zod
				.string()
				.default(details.id || null)
				.nullable()
				.optional(),
		})
	);
</script>
