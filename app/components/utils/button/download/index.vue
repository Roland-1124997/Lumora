<template>
	
    <a target="_parent" download :href="url" class="md:flex hidden w-full items-center justify-center gap-2 p-2 px-4 text-sm border border-[#756145] rounded-xl">Download</a>
						
    
    
    <a v-if="!PWAInstalled" target="_parent" download :href="url" class="flex md:hidden w-full items-center justify-center gap-2 p-2 px-4 text-sm border border-[#756145] rounded-xl">Download</a>
	<div v-else class="relative w-full group md:hidden">
		<button disabled class="flex w-full items-center justify-center gap-2 p-2 px-4 text-sm border border-[#756145] disabled:opacity-50 rounded-xl">Download</button>
		<div class="absolute z-50 hidden px-4 py-1 text-xs text-center text-white transition duration-200 ease-in-out transform -translate-y-full bg-[#756145] rounded-md w-44 top-[6.35rem] group-hover:block">
			<p class="text-center p-[0.45em]">
				<span class="font-semibold text-balance"> Currently not supported on PWAs! </span>
			</p>
			<div class="absolute w-3 h-3 bg-[#756145] transform rotate-45 -top-[0.44em] left-5 -translate-x-1/2"></div>
		</div>
	</div>
</template>

<script setup lang="ts">

const { PWAInstalled } = inject<any>("PWA");

    defineProps({
        url: { type: String, required: true },
    });

</script>