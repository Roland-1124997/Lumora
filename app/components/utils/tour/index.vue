<template>
	<GlowTourDefault class="terminal-tour" :tour="storage.tour" />
</template>

<script setup lang="ts">
	import "@glowhop/styles-tour/default.css";
	import { GlowTourDefault } from "@glowhop/vue-tour";

	const storage = useTourStorage();

	onMounted(() => {
		watchEffect(() => {
			if (storage.workflow) {
				storage.tour.run(storage.workflow);
			}
		});
	});
</script>

<style>
	.terminal-tour {
		--glow-tour-color-accent: #756145;
		--glow-tour-color-accent-hover: #54442e;
		--glow-tour-color-accent-active: #3c2e1f;
	}
</style>
