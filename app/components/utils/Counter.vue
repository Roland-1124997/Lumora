<template>
	<div class="flex overflow-hidden text-xs font-medium">
		<span v-for="(digit, index) in digits" :key="index" class="relative w-[0.7em] h-[1rem]">
			<span class="absolute -ml-1 transition-transform duration-500 ease-out" :style="{ transform: `translateY(-${digit * 1}rem)` }">
				<p v-for="n in 10" :key="n" class="h-[1rem] flex items-center justify-center">
					{{ n - 1 }}
				</p>
			</span>
		</span>
	</div>
</template>

<script setup>
	const props = defineProps({
		count: {
			type: Number,
			default: 0
		},
	});

	const digits = computed(() => {
		return props.count
			.toString()
			.split("")
			.map((d) => Number(d));
	});
</script>
