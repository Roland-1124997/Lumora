<template>
	<FieldFormBaseLayer class="mb-5" :callback :url :onSuccess :onError :method :resize :schema :label="type.split(':')[2] == 'approve' ? 'Approve images' : 'Reject images'">
		<template v-slot="{ errors }">
			<div class="py-3 mt-5 border-y h-fit">
				<div class="flex flex-col items-center justify-center w-full h-full gap-5 my-6">
					<icon class="text-[#756145]" :name="type.split(':')[2] == 'approve' ? 'ri:information-2-line' : 'ri:alert-line'" size="8em" />
					<h1 v-if="type.split(':')[2] == 'approve'" class="text-lg font-bold text-center text-balance">Approve selected images?</h1>

					<h1 v-else class="text-lg font-bold text-center text-balance">Reject selected images?</h1>

					<p v-if="type.split(':')[2] == 'approve'" class="-mt-5 text-center text-balance">Are you sure you want to approve the selected images?</p>
					<p v-else class="-mt-5 text-center text-balance">Are you sure you want to reject the selected images?</p>

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

	const { url, onSuccess, onError, method, type } = defineProps({
		callback: { type: Function, required: false },
		url: { type: String, required: true },
		onSuccess: { type: Function, required: true },
		onError: { type: Function, required: true },
		method: { type: String, default: "PATCH" },
		type: { type: String, required: true },
		resize: { type: Boolean, default: false },
	});

	const { getPinnedList } = usePinStore();

	const group_id = useRoute().params.group_id as string;

	const pinned = computed(() => getPinnedList(group_id));

	const schema = toTypedSchema(
		zod.object(
			pinned.value.ids.reduce((acc: Record<string, any>, item: string) => {
				acc[item] = zod.boolean().default(type.split(":")[2] === "approve");
				return acc;
			}, {})
		)
	);
</script>
