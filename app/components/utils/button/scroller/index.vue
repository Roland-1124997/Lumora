<template>
    <div>
        <button v-if="totalPages > 1" :disabled="loading" id="toTop" title="toTop" @click="scrollToTop" class="fixed z-50 flex items-center justify-center p-3 text-white bg-[#756145] rounded-full shadow-lg bottom-4 right-[4.2rem] md:bottom-[0.60rem] md:right-[15rem]">
            <icon class="transition-all " name="ri:arrow-up-line" size="1.4em" />
        </button>
        <button v-if="totalPages > 1" :disabled="loading" id="toBottem" title="toBottem" @click="scrollToBottom" class="fixed z-50 flex items-center justify-center p-3 text-white bg-[#756145] rounded-full shadow-lg bottom-4 right-4 md:bottom-[0.60rem] md:right-[11.65rem]">
            <icon v-if="loading" class="animate-spin" name="ri:loader-2-line" size="1.4em" />
            <icon v-else  class="transition-all " name="ri:arrow-down-line" size="1.4em" />
        </button>
    </div>
</template>

<script setup lang="ts">

    defineProps({
        Page: { type: Number, required: true },
		totalPages: { type: Number, required: true },
        loading: { type: Boolean, required: true },
        scrollPercentage: { type: Number, required: true },
        scrollToTop: { type: Function as PropType<(payload: any) => void>, required: true },
        scrollToBottom: { type: Function as PropType<(payload: any) => void>, required: true },
    });

    

    
</script>

<style scoped>
    .router-link-active {
        @apply bg-gray-200 text-gray-500;
    }
</style>
