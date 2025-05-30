<template>
	<FieldFormBaseLayer class="mb-5" :callback :requestUrl :onSuccess :onError :method :resize :schema label="Create group">
		<template v-slot="{ errors }">
			<div class="py-3 mt-5 border-y h-fit">
				<div :class="errors.thumbnail || errors.name ? ' mb-1' :' '" class="flex items-center space-x-3">
					<FieldInputImage label="thumbnail" name="thumbnail" />
					<div class="flex-1 w-full pl-3 space-y-2 border-l">
						<field name="name" v-slot="{ field, meta }: any">
							<input v-bind="field" placeholder="Enter a unique and catchy name!" id="name" type="text" :class="meta.validated && !meta.valid ? ' btn-Input-Error' : 'btn-Input'" class="z-10 w-full p-2 px-3 transition-colors duration-300 border appearance-none rounded-xl" />
						</field>
					</div>
				</div>
				<label class="text-sm font-medium text-gray-700 " for="description">
					<transition name="fade">
						<span v-if="errors.thumbnail || errors.name" class="text-red-700">{{ errors.thumbnail || errors.name }}</span>
					</transition>
				</label>
			</div>

			<div class="-mb-2">
				<field name="description" v-slot="{ field, meta }: any">
					<div class="-mt-4 space-y-2">
						<label class="text-sm font-medium text-gray-700" for="description">
							Description <span class="text-red-700">{{ "*" }}</span>
							<transition name="fade">
								<span v-if="meta.validated && !meta.valid" class="text-red-700">({{ meta.errors[0] || "There is an issue with this field" }})</span>
							</transition>
						</label>
						<div class="flex gap-2">
							<textarea v-bind="field" placeholder="Describe what your group is about!" id="description" type="text" :class="meta.validated && !meta.valid ? ' btn-Input-Error' : 'btn-Input'" class="z-10 w-full p-2 px-3 transition-colors duration-300 border appearance-none max-h-36 min-h-36 rounded-xl"></textarea>
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

	
	const { requestUrl, onSuccess, onError, method } = defineProps({
		callback: { type: Function, required: false },
		requestUrl: { type: String, required: true },
		onSuccess: { type: Function, required: true },
		onError: { type: Function, required: true },
		method: { type: String, default: "POST" },
		resize: { type: Boolean, default: false },
	});

	const schema = toTypedSchema(
		zod.object({	
			name: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).max(20, { message: "Name must be less than 20 characters" }),
			description: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).max(200, { message: "Description must be less than 200 characters" }),
			thumbnail: zod.instanceof(File, { message: "This field is required" }) 
			.refine((file) => file.size <= 5 * 1024 * 1024, {
				message: "File size must not exceed 5MB",
			})
			.refine((file) => ["image/png", "image/jpeg"].includes(file.type), {
				message: "Only PNG or JPEG files are allowed",
			}),
		})
	);
</script>
