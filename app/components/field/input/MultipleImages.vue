<template>
	<field :name="name" v-slot="{ field, meta }: any">
		<div class="space-y-2">
			<div :class="[meta.validated && !meta.valid ? 'btn-Input-Error-without-bg mb-2' : 'btn-Input', 'flex items-center justify-center overflow-hidden bg-gray-50 border border-dashed rounded-xl w-full p-2 h-80 lg:h-96 relative']" @dragover.prevent="onDragOver" @dragenter="onDragEnter" @dragleave="onDragLeave" @drop.prevent="handleDrop">
				<input id="images" multiple accept="image/png, image/jpeg" type="file" class="hidden" @change="fileSelected($event)" ref="fileInput" />

				<div v-if="isDragging && files.length < 1" class="absolute flex items-center justify-center inset-0 z-0 border-2 border-[#756145] pointer-events-none rounded-xl">
					<icon class="text-gray-500 cursor-pointer" name="ri:image-fill" size="4.6rem" aria-label="upload" />
				</div>

				<icon v-if="files.length < 1 && !isDragging" @click="triggerFileUpload" class="text-gray-500 cursor-pointer" name="ri:image-fill" size="4.6rem" aria-label="Afbeelding uploaden" />

				<div v-else class="relative w-full h-full overflow-hidden rounded-xl">
					<div class="flex w-full h-full transition-transform duration-500 ease-in-out rounded-xl" :style="{ transform: `translateX(-${currentSlide * 100}%)` }" tabindex="0">
						<div v-for="(thumb, index) in files" :key="index" class="relative h-full min-w-full group">
							<img :src="thumb.dataUrl" :alt="thumb.name" class="object-cover w-full h-full transition-transform duration-200 rounded-xl" />

							<div class="absolute flex items-center gap-1 bottom-1 left-1">
								<div class="p-2 text-xs text-white rounded-xl w-fit backdrop-blur-sm bg-black/60">{{ thumb.name }} ({{ formatBytes(thumb.size) }})</div>
								<div class="flex items-center justify-center p-2 text-xs text-white rounded-xl w-fit backdrop-blur-sm bg-black/60">
									<icon class="text-white" @click="clearPreviews" name="ri:delete-bin-2-line" size="1.1rem" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<label class="text-sm font-medium text-gray-700" for="description">
				<transition name="fade">
					<span v-if="meta.validated && !meta.valid" class="text-red-700" role="alert">
						{{ meta.errors[0] || "There is a problem with this field." }}
					</span>
				</transition>
			</label>

			<div class="flex items-center gap-2 md:justify-center">
				<div v-for="i in 4" :key="i" :class="['flex items-center justify-center overflow-hidden bg-gray-100 hover:bg-gray-200 border cursor-pointer group max-w-24 md:max-w-32 max-h-24 md:max-h-32 w-full h-full aspect-square rounded-xl transition-all', currentSlide === i - 1 && files.length > 0 ? 'scale-105 border-2' : '']" @click="i <= files.length ? (currentSlide = i - 1) : triggerFileUpload()">
					<img v-if="files[i - 1]" :src="files[i - 1]?.dataUrl" :alt="files[i - 1]?.name" class="object-cover w-full h-full" />
					<icon v-else name="ri:camera-ai-fill" size="1.5rem" class="text-gray-500 group-hover:text-gray-700" />
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

	const files = ref<{ dataUrl: string; name: string; size: number }[]>([]);
	const currentSlide = ref(0);
	const isDragging = ref(false);
	const dragEnterCounter = ref(0);

	const { value } = useField<File[]>(name);
	const fileInput = ref<HTMLInputElement | null>(null);

	const onDragOver = (event: DragEvent) => event.preventDefault();

	const onDragEnter = () => {
		dragEnterCounter.value++;
		isDragging.value = true;
	};

	const onDragLeave = () => {
		dragEnterCounter.value--;
		if (dragEnterCounter.value === 0) {
			isDragging.value = false;
		}
	};

	const handleDrop = async (event: DragEvent) => {
		dragEnterCounter.value = 0;
		isDragging.value = false;

		if (!event.dataTransfer?.files) return;
		await processFiles(Array.from(event.dataTransfer.files));
	};

	const fileSelected = async (event: Event) => {
		const newFiles = (event.target as HTMLInputElement).files;
		if (!newFiles) return;
		await processFiles(Array.from(newFiles));
	};

	const processFiles = async (selectedFiles: File[]) => {
		const remainingSlots = 4 - files.value.length;
		const validFiles = selectedFiles.slice(0, remainingSlots);

		for (const file of validFiles) {
			await displayPreview(file);
		}

		value.value = [...(value.value || []), ...validFiles];
	};

	const displayPreview = async (file: File) => {
		return new Promise<void>((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				files.value.push({
					dataUrl: reader.result as string,
					name: file.name,
					size: file.size,
				});
				resolve();
			};
			reader.onerror = reject;
		});
	};

	const clearPreviews = () => {
		if (files.value.length > 0) {
			files.value.splice(currentSlide.value, 1);
			value.value.splice(currentSlide.value, 1);
		}

		if (files.value.length === 0) currentSlide.value = 0;
		else if (currentSlide.value >= files.value.length) currentSlide.value = files.value.length - 1;
	};

	const triggerFileUpload = () => fileInput.value?.click();

	const formatBytes = (bytes: number, decimals = 2): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
	};
</script>
