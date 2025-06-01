<template>
	<div :class="PWAInstalled ? 'mb-32 md:mb-20' : 'mb-20'" class="p-2 mx-auto -mt-4">
		<div v-if="server" class="space-y-4">
			<div class="p-4 shadow rounded-xl">
				<div class="mb-4">
					<div class="text-2xl font-bold">Total Memory</div>
					<div class="text-sm text-gray-400">{{ server.totalMemory }} MB total system memory</div>
				</div>
				<div>
					<div class="mb-2 font-semibold">Memory Usage</div>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<div class="text-xs text-gray-500">RSS</div>
							<div class="flex items-center gap-2">
								<span class="font-bold">{{ server.memory.rss }} MB</span>
								<span class="text-xs text-gray-400">/</span>
								<span class="text-xs text-gray-400">{{ server.totalMemory }} MB</span>
							</div>
							<div class="w-full h-2 overflow-hidden bg-gray-200 rounded">
								<div class="h-2 bg-[#756145] rounded" :style="{ width: ((server.memory.rss / server.totalMemory) * 100).toFixed(1) + '%' }"></div>
							</div>
						</div>
						<div>
							<div class="text-xs text-gray-500">Heap Total</div>
							<div class="flex items-center gap-2">
								<span class="font-bold">{{ server.memory.heapTotal }} MB</span>
							</div>
							<div class="w-full h-2 overflow-hidden bg-gray-200 rounded">
								<div class="h-2 bg-[#756145] rounded" :style="{ width: ((server.memory.heapTotal / server.totalMemory) * 100).toFixed(1) + '%' }"></div>
							</div>
						</div>
						<div>
							<div class="text-xs text-gray-500">Heap Used</div>
							<div class="flex items-center gap-2">
								<span class="font-bold">{{ server.memory.heapUsed }} MB</span>
							</div>
							<div class="w-full h-2 overflow-hidden bg-gray-200 rounded">
								<div class="h-2 bg-[#756145] rounded" :style="{ width: ((server.memory.heapUsed / server.totalMemory) * 100).toFixed(1) + '%' }"></div>
							</div>
						</div>
						<div>
							<div class="text-xs text-gray-500">External</div>
							<div class="flex items-center gap-2">
								<span class="font-bold">{{ server.memory.external }} MB</span>
							</div>
							<div class="w-full h-2 overflow-hidden bg-gray-200 rounded">
								<div class="h-2 bg-[#756145] rounded" :style="{ width: ((server.memory.external / server.totalMemory) * 100).toFixed(1) + '%' }"></div>
							</div>
						</div>
						<div>
							<div class="overflow-hidden text-xs text-gray-500">Array Buffers</div>
							<div class="flex items-center gap-2">
								<span class="font-bold">{{ server.memory.arrayBuffers }} MB</span>
							</div>
							<div class="w-full h-2 bg-gray-200 rounded">
								<div class="h-2 bg-[#756145] rounded" :style="{ width: ((server.memory.arrayBuffers / server.totalMemory) * 100).toFixed(1) + '%' }"></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="flex flex-col gap-4 p-4 bg-white shadow rounded-xl">
					<div class="flex flex-col gap-2">
						<div class="flex items-center justify-between">
							<span class="font-semibold text-gray-600">CPU</span>
							<span class="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{{ server.cpu }}%</span>
						</div>
						<div class="text-3xl font-extrabold">{{ server.cpu }}%</div>
						<div class="w-full h-2 bg-gray-200 rounded">
							<div class="h-2 bg-[#756145] rounded" :style="{ width: server.cpu + '%' }"></div>
						</div>
						<div class="mt-1 text-xs text-gray-400">
							<div v-if="server.cpu < 40">Low usage - system running efficiently</div>
							<div v-else-if="server.cpu < 75">Moderate usage - system stable</div>
							<div v-else>High usage - consider investigating</div>
						</div>
					</div>

					<div>
						<span class="font-semibold text-gray-600">Uptime</span>
						<div class="text-2xl font-extrabold">{{ formatUptime(server.uptime) }}</div>
						<div class="text-xs text-gray-400">Since last restart</div>
					</div>
				</div>

				<div class="flex flex-col gap-4 p-4 bg-white shadow rounded-xl">
					<div>
						<span class="font-semibold text-gray-600">Platform</span>
						<div class="text-2xl font-extrabold">{{ server.platform }}</div>
						<div class="text-xs text-gray-400">({{ server.arch }})</div>
					</div>
					<div>
						<span class="font-semibold text-gray-600">Node</span>
						<div class="text-2xl font-extrabold">{{ server.node }}</div>
						<div class="text-xs text-gray-400">Latest LTS version</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: "monitor",
	});

	const { PWAInstalled } = useCheckPwa();

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
