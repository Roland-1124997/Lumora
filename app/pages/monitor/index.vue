<template>
	<div :class="PWAInstalled ? 'mb-32 md:mb-20' : 'mb-20'" class="p-2 mx-auto -mt-4">
		<div v-if="monitor" class="space-y-4">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="p-4 shadow rounded-xl">
					<div class="mb-4">
						<div class="text-2xl font-bold">Total Memory</div>
						<div class="text-sm text-gray-400">{{ monitor.server.totalMemory }} MB total system memory</div>
					</div>
					<div>
						<div class="mb-2 font-semibold">Memory Usage</div>
						<div class="grid grid-cols-1 gap-4">
							<div>
								<div class="text-xs text-gray-500">RSS</div>
								<div class="flex items-center gap-2">
									<span class="font-bold">{{ monitor.server.memory.rss }} MB</span>
									<span class="text-xs text-gray-400">/</span>
									<span class="text-xs text-gray-400">{{ monitor.server.totalMemory }} MB</span>
								</div>
								<div class="w-full h-4 overflow-hidden bg-gray-200 rounded-lg">
									<div class="h-4 bg-[#756145] rounded-lg animate" :style="{ width: ((monitor.server.memory.rss / monitor.server.totalMemory) * 100).toFixed(1) + '%' }"></div>
								</div>
							</div>
							<div>
								<div class="text-xs text-gray-500">Heap Total</div>
								<div class="flex items-center gap-2">
									<span class="font-bold">{{ monitor.server.memory.heapTotal }} MB</span>
								</div>
								<div class="w-full h-4 overflow-hidden bg-gray-200 rounded-lg">
									<div class="h-4 bg-[#756145] rounded-lg animate" :style="{ width: ((monitor.server.memory.heapTotal / monitor.server.totalMemory) * 100).toFixed(1) + '%' }"></div>
								</div>
							</div>
							<div>
								<div class="text-xs text-gray-500">Heap Used</div>
								<div class="flex items-center gap-2">
									<span class="font-bold">{{ monitor.server.memory.heapUsed }} MB</span>
								</div>
								<div class="w-full h-4 overflow-hidden bg-gray-200 rounded-lg">
									<div class="h-4 bg-[#756145] rounded-lg animate" :style="{ width: ((monitor.server.memory.heapUsed / monitor.server.totalMemory) * 100).toFixed(1) + '%' }"></div>
								</div>
							</div>
							<div>
								<div class="text-xs text-gray-500">External</div>
								<div class="flex items-center gap-2">
									<span class="font-bold">{{ monitor.server.memory.external }} MB</span>
								</div>
								<div class="w-full h-4 overflow-hidden bg-gray-200 rounded-lg">
									<div class="h-4 bg-[#756145] rounded-lg animate" :style="{ width: ((monitor.server.memory.external / monitor.server.totalMemory) * 100).toFixed(1) + '%' }"></div>
								</div>
							</div>
							<div>
								<div class="overflow-hidden text-xs text-gray-500">Array Buffers</div>
								<div class="flex items-center gap-2">
									<span class="font-bold">{{ monitor.server.memory.arrayBuffers }} MB</span>
								</div>
								<div class="w-full h-4 bg-gray-200 rounded-lg">
									<div class="h-4 bg-[#756145] rounded-lg animate" :style="{ width: ((monitor.server.memory.arrayBuffers / monitor.server.totalMemory) * 100).toFixed(1) + '%' }"></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="hidden p-4 shadow rounded-xl md:block">
					<div class="mb-4">
						<div class="text-2xl font-bold">Monthly users</div>
						<div class="text-sm text-gray-400">The total amount of active users per month based on their last login</div>
					</div>
					<div>
						<UtilsChart :data="monitor.supabase.monthly" :height="400" />
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="flex flex-col gap-4 p-4 bg-white shadow rounded-xl">
					<div class="flex flex-col gap-2">
						<div class="flex items-center justify-between">
							<span class="font-semibold text-gray-600">CPU</span>
							<span class="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{{ monitor.server.cpu }}%</span>
						</div>
						<div class="text-3xl font-extrabold">{{ monitor.server.cpu }}%</div>
						<div class="w-full h-4 bg-gray-200 rounded-lg">
							<div class="h-4 bg-[#756145] animate rounded-lg" :style="{ width: monitor.server.cpu + '%' }"></div>
						</div>
						<div class="mt-1 text-xs text-gray-400">
							<div v-if="monitor.server.cpu < 40">Low usage - system running efficiently</div>
							<div v-else-if="monitor.server.cpu < 75">Moderate usage - system stable</div>
							<div v-else>High usage - consider investigating</div>
						</div>
					</div>

					<div>
						<span class="font-semibold text-gray-600">Uptime</span>
						<div class="text-2xl font-extrabold">{{ formatUptime(monitor.server.uptime) }}</div>
						<div class="text-xs text-gray-400">Since last restart</div>
					</div>
				</div>

				<div class="flex flex-col gap-4 p-4 bg-white shadow rounded-xl md:hidden">
					<div class="flex items-center justify-between">
						<span class="font-semibold text-gray-600">Storage</span>
						<span class="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{{ monitor.supabase.bucket.id }}</span>
					</div>

					<div>
						<span class="text-3xl font-extrabold">{{ monitor.supabase.bucket.size }} MB</span>

						<span class="text-xl font-semibold text-gray-400">/</span>
						<span class="text-xl font-semibold text-gray-400">{{ monitor.supabase.bucket.max }} MB</span>
					</div>

					<div class="w-full h-4 bg-gray-200 rounded-lg">
						<div class="h-4 bg-[#756145] rounded-lg animate" :style="{ width: ((monitor.supabase.bucket.size / monitor.supabase.bucket.max) * 100).toFixed(1) + '%' }"></div>
					</div>
				</div>

				<div class="p-4 shadow rounded-xl md:hidden">
					<div class="mb-4">
						<div class="text-2xl font-bold">Monthly active</div>
						<div class="text-sm text-gray-400">The total amount of active users per month based on their last login</div>
					</div>
					<div>
						<UtilsChart :data="monitor.supabase.monthly" :height="300" />
					</div>
				</div>

				<div class="flex flex-col gap-4 p-4 bg-white shadow rounded-xl">
					<div>
						<span class="font-semibold text-gray-600">Platform</span>
						<div class="text-2xl font-extrabold">{{ monitor.server.platform }}</div>
						<div class="text-xs text-gray-400">({{ monitor.server.arch }})</div>
					</div>
					<div>
						<span class="font-semibold text-gray-600">Node</span>
						<div class="text-2xl font-extrabold">{{ monitor.server.node }}</div>
						<div class="text-xs text-gray-400">Latest LTS version</div>
					</div>
				</div>

				<div class="flex-col hidden gap-4 p-4 bg-white shadow rounded-xl md:flex">
					<div class="flex items-center justify-between">
						<span class="font-semibold text-gray-600">Storage</span>
						<span class="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{{ monitor.supabase.bucket.id }}</span>
					</div>

					<div>
						<span class="text-3xl font-extrabold">{{ monitor.supabase.bucket.size }} MB</span>

						<span class="text-xl font-semibold text-gray-400">/</span>
						<span class="text-xl font-semibold text-gray-400">{{ monitor.supabase.bucket.max }} MB</span>
					</div>

					<div class="w-full h-4 bg-gray-200 rounded-lg">
						<div class="h-4 bg-[#756145] rounded-lg animate" :style="{ width: ((monitor.supabase.bucket.size / monitor.supabase.bucket.max) * 100).toFixed(1) + '%' }"></div>
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
	const monitor = ref();

	const { data: events, close } = useEventSource(`/events/monitor/${id}`, [], {
		autoReconnect: true,
	});

	watch(events, async (event) => {
		monitor.value = JSON.parse(event);
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

<style scoped>
	.animate {
		transition: width 0.2s ease-in-out;
	}
</style>
