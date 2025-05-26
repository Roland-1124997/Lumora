<template>
	<div>
		{{ relativeTime }}
	</div>
</template>
<script setup lang="ts">
	const { date } = defineProps({
		date: { type: [String, Date], required: true },
	});

	const formatRelativeTime = (date: string | Date) => {
		const now = new Date();
		const then = new Date(date);
		let diff = Math.floor((now.getTime() - then.getTime()) / 1000);

		if (diff < 0) diff = 0; 

		if (diff < 60) return `${diff}s`;
		if (diff < 3600) return `${Math.floor(diff / 60)}m`;
		if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
		if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
		if (diff < 2592000) return `${Math.floor(diff / 604800)}w`;
		if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo`;
		return `${Math.floor(diff / 31536000)}y`;
	};

	const relativeTime = ref(formatRelativeTime(date));

	let intervalId: number | undefined;

	const updateTime = () => {
		relativeTime.value = formatRelativeTime(date);
	};

	onMounted(() => {
		intervalId = window.setInterval(updateTime, 1000);
	});

	onUnmounted(() => {
		if (intervalId) clearInterval(intervalId);
	});

	watch(() => date, updateTime);
</script>
