<template>
	<field :name="name" v-slot="{ handleChange, handleBlur, field, meta }: any">
		<div class="space-y-2">
			<div :class="[meta.validated && !meta.valid ? 'btn-Input-Error' : 'btn-Input', 'flex items-center justify-center overflow-hidden border rounded-full w-14 h-14']">
				<input id="thumbnail" accept="image/png, image/jpeg" type="file" class="hidden" @change="fileSelected(handleChange, $event)" ref="fileInput" @blur="handleBlur" />
				<icon @click="triggerFileUpload" v-if="files.length < 1" class="text-gray-500" name="ri:camera-ai-fill" size="1.6rem" />
				<div class="w-full h-full" v-else>
					<img v-for="(thumb, index) in files" :key="index" :src="thumb" :alt="`Image-${index}`" class="object-cover w-full h-full rounded-full" />
					<div @click="clearPreviews(field)" class="absolute flex items-center justify-center p-1 -mt-16 text-white bg-[#756145] rounded-full">
						<Icon name="ri:close-fill" size="1.1em"></Icon>
					</div>
				</div>
			</div>
		</div>
	</field>
</template>

<script setup lang="ts">

	const { name } = defineProps({
		name: { type: String, required: true },
		label: { type: String, default: "text" },
		placeholder: { type: String, default: "" },
		required: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
	});

	const files = ref<string[]>([]);

	const { value }: any = useField<string>(name);
	const fileInput = ref<HTMLInputElement | null>(null);

	const fileSelected = (handleChange: (event: Event) => void, event: Event) => {
		const files = (event.target as HTMLInputElement).files;
		if (files) {
			Array.from(files).forEach(async (file: File) => {
				await displayPreview(file);
			});
		}
		handleChange(event);
	};

	const clearPreviews = (field: Record<string, unknown>) => {
		files.value = [];
		field.value = null;
		value.value = null;
	};

	const triggerFileUpload = () => {
		fileInput.value?.click();
	};

	const displayPreview = async (file: File) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			const img = new Image();
			img.src = reader.result as string;
			img.onload = () => files.value.push(reader.result as string);
		};
	};
</script>
