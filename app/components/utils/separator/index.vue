<template>
	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<div class="w-full border-t border-gray-200"></div>
		</div>
		<div class="relative flex justify-center text-sm">
			<span v-if="!line" class="px-4 text-gray-500 bg-white">Or</span>
            <span v-else class="px-4 text-white">-</span>
		</div>
	</div>
</template>

<script setup lang="ts">

    defineProps({
        line: { type: Boolean, default: false }
    });

</script>
