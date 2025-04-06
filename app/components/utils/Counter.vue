<template>
	<div class="flex space-x-1 overflow-hidden text-xs font-medium">
		<span v-for="(digit, index) in digits" :key="index" class="relative w-[1.5em] h-[1rem] overflow-hidden">
			<span class="absolute transition-transform duration-500 ease-out" :style="{ transform: `translateY(-${digit * 1}rem)` }">
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
			required: true,
		},
	});

	const digits = computed(() => {
		return props.count
			.toString()
			.split("")
			.map((d) => Number(d));
	});
</script>
