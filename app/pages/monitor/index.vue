<template>
	<div :class="PWAInstalled ? 'mb-32 md:mb-20' : 'mb-20'" class="p-2 mx-auto -mt-4 select-none">
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
								<div class="w-full h-4 overflow-hidden bg-gray-200 rounded">
									<div class="h-4 bg-[#756145] rounded animate" :style="{ width: ((monitor.server.memory.rss / monitor.server.totalMemory) * 100).toFixed(1) + '%' }"></div>
								</div>
							</div>
							<div>
								<div class="text-xs text-gray-500">Heap Total</div>
								<div class="flex items-center gap-2">
									<span class="font-bold">{{ monitor.server.memory.heapTotal }} MB</span>
								</div>
								<div class="w-full h-4 overflow-hidden bg-gray-200 rounded">
									<div class="h-4 bg-[#756145] rounded animate" :style="{ width: ((monitor.server.memory.heapTotal / monitor.server.totalMemory) * 100).toFixed(1) + '%' }"></div>
								</div>
							</div>
							<div>
								<div class="text-xs text-gray-500">Heap Used</div>
								<div class="flex items-center gap-2">
									<span class="font-bold">{{ monitor.server.memory.heapUsed }} MB</span>
								</div>
								<div class="w-full h-4 overflow-hidden bg-gray-200 rounded">
									<div class="h-4 bg-[#756145] rounded animate" :style="{ width: ((monitor.server.memory.heapUsed / monitor.server.totalMemory) * 100).toFixed(1) + '%' }"></div>
								</div>
							</div>
							<div>
								<div class="text-xs text-gray-500">External</div>
								<div class="flex items-center gap-2">
									<span class="font-bold">{{ monitor.server.memory.external }} MB</span>
								</div>
								<div class="w-full h-4 overflow-hidden bg-gray-200 rounded">
									<div class="h-4 bg-[#756145] rounded animate" :style="{ width: ((monitor.server.memory.external / monitor.server.totalMemory) * 100).toFixed(1) + '%' }"></div>
								</div>
							</div>
							<div>
								<div class="text-xs text-gray-500 ">Array Buffers</div>
								<div class="flex items-center gap-2 overflow-hidden">
									<span class="font-bold">{{ monitor.server.memory.arrayBuffers }} MB</span>
								</div>
								<div class="w-full h-4 overflow-hidden bg-gray-200 rounded">
									<div class="h-4 bg-[#756145] rounded animate" :style="{ width: ((monitor.server.memory.arrayBuffers / monitor.server.totalMemory) * 100).toFixed(1) + '%' }"></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="hidden p-4 shadow rounded-xl md:block">
					<div class="mb-4">
						<div class="text-2xl font-bold">Monthly active users</div>
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
						<div class="w-full h-4 overflow-hidden bg-gray-200 rounded">
							<div class="h-4 bg-[#756145] animate rounded" :style="{ width: monitor.server.cpu + '%' }"></div>
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
						<div class="flex items-center justify-center gap-2">
							<span class="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{{ monitor.supabase.bucket.id }}</span>
							<button @click="openDetails" class="text-xs text-white bg-[#756145] px-2 py-0.5 rounded-full">expand</button>
						</div>
					</div>

					<div class="flex items-center gap-2">
						<span class="text-3xl font-extrabold">{{ monitor.supabase.bucket.size }} MB</span>

						<span class="text-xl font-semibold text-gray-400">/</span>
						<span class="text-xl font-semibold text-gray-400">{{ monitor.supabase.bucket.max }} MB</span>
					</div>

					<div class="w-full h-4 overflow-hidden bg-gray-200 rounded">
						<div class="h-4 bg-[#756145] rounded animate" :style="{ width: ((monitor.supabase.bucket.size / monitor.supabase.bucket.max) * 100).toFixed(1) + '%' }"></div>
					</div>

					<div v-if="open">
						<div class="flex items-center justify-between mb-2">
							<span class="font-semibold text-gray-600">Disks</span>
						</div>

						<div class="grid grid-cols-1 gap-4">
							<div v-for="group in monitor.supabase.bucket.groups" :key="group.group_id">
								<div class="text-xs text-gray-500">{{ group.group_id }}</div>
								<div class="flex items-center gap-2 py-1">
									<span class="font-bold">{{ group.total_size_megabyte }} MB</span>
									<span class="text-xs text-gray-400">/</span>
									<span class="text-xs text-gray-400">{{ monitor.supabase.bucket.size }} MB</span>
								</div>
								<div class="w-full h-4 overflow-hidden bg-gray-200 rounded">
									<div class="h-4 bg-[#756145] rounded animate" :style="{ width: ((group.total_size_megabyte / monitor.supabase.bucket.size) * 100).toFixed(1) + '%' }"></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="p-4 shadow rounded-xl md:hidden">
					<div class="mb-4">
						<div class="text-2xl font-bold">Monthly active users</div>
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
						<div class="flex items-center justify-center gap-2">
							<span class="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{{ monitor.supabase.bucket.id }}</span>
							
						</div>
					</div>

					<div class="flex items-center gap-2">
						<span class="text-3xl font-extrabold">{{ monitor.supabase.bucket.size }} MB</span>

						<span class="text-xl font-semibold text-gray-400">/</span>
						<span class="text-xl font-semibold text-gray-400">{{ monitor.supabase.bucket.max }} MB</span>
					</div>

					<div class="w-full h-4 overflow-hidden bg-gray-200 rounded">
						<div class="h-4 bg-[#756145] rounded animate" :style="{ width: ((monitor.supabase.bucket.size / monitor.supabase.bucket.max) * 100).toFixed(1) + '%' }"></div>
					</div>

					<div>
						<div class="flex items-center justify-between mb-2">
							<span class="font-semibold text-gray-600">Disks</span>
						</div>

						<div class="grid grid-cols-1 gap-4 max-h-[20vh] overflow-auto">
							<div v-for="group in monitor.supabase.bucket.groups" :key="group.group_id">
								<div class="text-xs text-gray-500">{{ group.group_id }}</div>
								<div class="flex items-center gap-2 py-1">
									<span class="font-bold">{{ group.total_size_megabyte }} MB</span>
									<span class="text-xs text-gray-400">/</span>
									<span class="text-xs text-gray-400">{{ monitor.supabase.bucket.size }} MB</span>
								</div>
								<div class="w-full h-4 overflow-hidden bg-gray-200 rounded">
									<div class="h-4 bg-[#756145] rounded animate" :style="{ width: ((group.total_size_megabyte / monitor.supabase.bucket.size) * 100).toFixed(1) + '%' }"></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="flex-col hidden gap-4 p-4 bg-white shadow md:flex rounded-xl">
					<div class="flex items-center justify-between">
						<span class="font-semibold text-gray-600">Endpoints</span>
					</div>

					<div class="flex items-center gap-2">
						<span class="text-3xl font-extrabold">{{ getFormatetTotalCount(monitor.requests) }}</span>
						<span class="text-xl font-semibold text-gray-400">Requests</span>
					</div>

					<div class="grid grid-cols-1 gap-4 max-h-[25vh] overflow-auto">
						<div v-for="request in monitor.requests" :key="request.path">
							<div class="flex items-center gap-2 py-1">
								<span class="font-bold">{{ request.method }}</span>
								<span class="text-xs text-gray-400">{{ request.path }} </span>
							</div>
							<div class="w-full h-4 overflow-hidden bg-gray-200 rounded">
								<div class="h-4 bg-[#756145] rounded animate" :style="{ width: ((request.count / getTotalCount(monitor.requests) ) * 100).toFixed(1) + '%' }"></div>
							</div>
						</div>
					</div>
				</div>

				<div class="flex flex-col gap-4 p-4 bg-white shadow md:hidden rounded-xl">
					<div class="flex items-center justify-between">
						<span class="font-semibold text-gray-600">Endpoints</span>
						<button @click="openRequestsDetails" class="text-xs text-white bg-[#756145] px-2 py-0.5 rounded-full">expand</button>
					</div>

					<div class="flex items-center gap-2">
						<span class="text-3xl font-extrabold">{{ getFormatetTotalCount(monitor.requests) }}</span>
						<span class="text-xl font-semibold text-gray-400">Requests</span>
					</div>

					<div v-if="openRequests" class="grid grid-cols-1 gap-4">
						<div v-for="request in monitor.requests" :key="request.path">
							<div class="flex flex-col items-start pb-3">
								<span class="font-bold">{{ request.method }}</span>
								<span class="text-[0.65rem] text-gray-400 ">{{ request.path }} </span>
							</div>
							<div class="w-full h-4 overflow-hidden bg-gray-200 rounded">
								<div class="h-4 bg-[#756145] rounded animate" :style="{ width: ((request.count / getTotalCount(monitor.requests) ) * 100).toFixed(1) + '%' }"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


<script setup lang="ts">

	useHead({
		htmlAttrs: {
			lang: "en",
		},
	});

	useSeoMeta({
		title: "Lumora - Monitor",
		description: "Monitor server activity, system events, in real time from the admin dashboard.",
		ogTitle: "Lumora - Server Monitoring Dashboard",
		ogDescription: "Stay informed with real-time insights into system health, user activity.",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "/",
		twitterTitle: "Lumora - Monitor",
		twitterDescription: "Track system performance directly from the central admin interface.",
		twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary",
	})

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

	const open = ref(false);
	const openRequests = ref(false)

	const openDetails = () => (open.value = !open.value);
	const openRequestsDetails = () => (openRequests.value = !openRequests.value);

	const formatUptime = (seconds: number) => {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = seconds % 60;
		return `${h}h ${m}m ${s}s`;
	};

	const getTotalCount = (data: { count: number }[]) => {
		return data.reduce((sum, item) => sum + item.count, 0);
	};

	const getFormatetTotalCount = (data: { count: number }[]): string => {
		const total = getTotalCount(data)

		if (total >= 1_000_000) {
			return (total / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
		} else if (total >= 1_000) {
			return (total / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
		}

		return total.toString();
	};



</script>

<style scoped>
	.animate {
		transition: width 0.2s ease-in-out;
	}
</style>
