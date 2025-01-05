<template>
	<div>
		<section></section>
	</div>
</template>

<script setup>

	definePageMeta({
		middleware: 'unauthorized',
	});

	const username = inject("username");
</script>
