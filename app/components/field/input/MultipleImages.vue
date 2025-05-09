<template>
	<field :name="name" v-slot="{ field, meta }: any">
		<div class="space-y-2">
			<div :class="[meta.validated && !meta.valid ? 'btn-Input-Error-without-bg mb-2' : 'btn-Input', 'flex items-center justify-center overflow-hidden border rounded-xl w-full p-2 h-80 lg:h-96']">
				<input id="images" multiple accept="image/png, image/jpeg" type="file" class="hidden" @change="fileSelected($event)" ref="fileInput" />
				<icon @click="triggerFileUpload" v-if="files.length < 1" class="text-gray-500" name="ri:camera-ai-fill" size="2.6rem" />

				<div v-else class="relative w-full h-full overflow-hidden">
					<div class="flex w-full h-full transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
						<div v-for="(thumb, index) in files" :key="index" class="h-full min-w-full">
							<img @click="clearPreviews()" :src="thumb" :alt="`Image-${index}`" class="object-cover w-full h-full rounded-xl" />
						</div>
					</div>
					<div v-if="currentSlide > 0" @click="prevSlide" class="absolute left-0 flex items-center justify-center p-2 py-4 text-white transform -translate-y-1/2 bg-black bg-opacity-50 cursor-pointer top-1/2">
						<icon name="material-symbols:arrow-back-ios-new-rounded" size="1rem"></icon>
					</div>
					<div v-if="currentSlide < files.length - 1" @click="nextSlide" class="absolute right-0 flex items-center justify-center p-2 py-4 text-white transform -translate-y-1/2 bg-black bg-opacity-50 cursor-pointer top-1/2">
						<icon name="material-symbols:arrow-back-ios-new-rounded" class="rotate-180" size="1rem"></icon>
					</div>
				</div>
			</div>
			<label class="text-sm font-medium text-gray-700" for="description">
				<transition name="fade">
					<span v-if="meta.validated && !meta.valid" class="text-red-700">{{ meta.errors[0] || "Er is een probleem met dit veld" }}</span>
				</transition>
			</label>
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
	const currentSlide = ref(0);

	const { value }: any = useField<string>(name);
	const fileInput = ref<HTMLInputElement | null>(null);

	const fileSelected = (event: Event) => {
		const newFiles = (event.target as HTMLInputElement).files;
		if (!newFiles) return;

		const remainingSlots = 4 - files.value.length;
		const selectedFiles = Array.from(newFiles).slice(0, remainingSlots);

		selectedFiles.forEach(async (file: File) => {
			await displayPreview(file);
		});

		value.value = selectedFiles;
	};

	const clearPreviews = () => {
		if (files.value.length > 0) {
			files.value.splice(currentSlide.value, 1);
			value.value.splice(currentSlide.value, 1);
		}

		if (files.value.length === 0) currentSlide.value = 0;
		else if (currentSlide.value >= files.value.length) currentSlide.value = files.value.length - 1;
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

	const prevSlide = () => {
		if (currentSlide.value > 0) {
			currentSlide.value--;
		}
	};

	const nextSlide = () => {
		if (currentSlide.value < files.value.length - 1) {
			currentSlide.value++;
		}
	};
</script>
