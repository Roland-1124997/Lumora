<template>
    <NuxtLink external target="_parent" download :href="url" class="md:flex hidden w-full items-center justify-center gap-2 p-2 px-4 text-sm border border-[#756145] rounded-xl">Download</NuxtLink>
    <NuxtLink external v-if="PWAInstalled" target="_parent" :href="url" class="flex md:hidden w-full items-center justify-center gap-2 p-2 px-4 text-sm border border-[#756145] rounded-xl">Download</NuxtLink>
    <NuxtLink external v-else target="_parent" download :href="url" class="flex md:hidden w-full items-center justify-center gap-2 p-2 px-4 text-sm border border-[#756145] rounded-xl">Download</NuxtLink>
</template>

<script setup lang="ts">

const { PWAInstalled } = inject<any>("PWA");

    defineProps({
        url: { type: String, default: "/" },
    });

</script>