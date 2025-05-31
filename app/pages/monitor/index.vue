<template>
	<div :class="PWAInstalled ? 'mb-32 md:mb-20' : 'mb-20'" class="p-2 mx-auto -mt-4 ">
		<h2 class="mb-4 text-2xl font-bold">Server Monitor</h2>
		<div v-if="server" class="space-y-4">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<span class="block font-semibold">CPU: </span>
					<span>{{ server.cpu }}%</span>
				</div>
				<div>
					<span class="block font-semibold">Platform: </span>
					<span>{{ server.platform }} ({{ server.arch }})</span>
				</div>
				<div>
					<span class="block font-semibold">Node: </span>
					<span>{{ server.node }}</span>
				</div>
				<div>
					<span class="block font-semibold">Uptime: </span>
					<span>{{ formatUptime(server.uptime) }}</span>
				</div>
				<div>
					<span class="block font-semibold">Total Memory: </span>
					<span>{{ server.totalMemory }} MB</span>
				</div>
			</div>
			<div>
				<h3 class="mb-2 font-semibold">Memory Usage</h3>
				<ul class="text-sm list-disc list-inside">
					<li><span class="font-semibold">RSS: </span> {{ server.memory.rss }} MB</li>
					<li><span class="font-semibold">Heap Total: </span> {{ server.memory.heapTotal }} MB</li>
					<li><span class="font-semibold">Heap Used: </span> {{ server.memory.heapUsed }} MB</li>
					<li><span class="font-semibold">External: </span> {{ server.memory.external }} MB</li>
					<li><span class="font-semibold">Array Buffers: </span> {{ server.memory.arrayBuffers }} MB</li>
				</ul>
			</div>
			<details class="p-2 rounded bg-gray-50">
				<summary class="font-semibold cursor-pointer">Node Versions</summary>
				<ul class="mt-2 text-sm list-disc list-inside">
					<li v-for="(ver, key) in server.versions" :key="key">
						<span class="font-semibold">{{ key }}:</span> {{ ver }}
					</li>
				</ul>
			</details>
		</div>
		<div v-else class="italic text-gray-400">Waiting for server data...</div>
	</div>
</template>

<script setup lang="ts">

	definePageMeta({
		middleware: "monitor",
	});

    const { PWAInstalled } = useCheckPwa()

	const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	const server = ref();

	const { data: events, close } = useEventSource(`/events/monitor/${id}`, [], {
		autoReconnect: true,
	});

	watch(events, async (event) => {
		server.value = JSON.parse(event);
	});

	onUnmounted(() => {
		close();
	});

	function formatUptime(seconds: number) {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = seconds % 60;
		return `${h}h ${m}m ${s}s`;
	}
</script>
