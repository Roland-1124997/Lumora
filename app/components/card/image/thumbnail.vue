<template>
	<div ref="focus" :class="loaded ? 'bg-black' : ' bg-gray-200'" class="relative flex items-center justify-center w-full h-full min-h-[51vh] max-h-[78vh] lg:h-[75vh] xl:h-[78vh] overflow-hidden border rounded-lg">
		<img v-if="loaded" :src="content?.media?.url" :alt="content.id" class="object-contain w-full h-full" />
		<icon v-else class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="5em" />
	</div>
</template>


<script setup lang="ts">

defineProps({
    content: { type: Object, required: true },
    loaded: { type: Boolean, default: false },
});

const focus = ref(null);
defineExpose({ focus });


</script>