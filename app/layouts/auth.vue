<template>
	<div :class="PWAInstalled ? 'fixed w-full h-full' : ''" class="px-4 py-8 md:px-6">
		<div class="w-full h-full max-w-lg mx-auto space-y-8">
			<header class="space-y-6">
				<div class="flex items-center space-x-2">
					<div class="p-2 bg-[#F3EEE7] rounded-lg">
						<NuxtImg src="/icons/Lumora-OP0.svg" class="h-8 mix-blend-luminosity"></NuxtImg>
					</div>
					<span class="text-2xl font-semibold">Lumora</span>
				</div>
			</header>
            <main class="w-full h-full max-w-lg mx-auto space-y-8">
                <slot></slot>
            </main>
		</div>
	</div>
</template>

<script setup>
	const { PWAInstalled } = useCheckPwa()
</script>
