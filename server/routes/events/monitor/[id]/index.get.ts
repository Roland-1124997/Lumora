import os from "os";

export default defineSupabaseEventHandler(async (event, user) => {

    if (!user || user.app_metadata.plan !== "team") return;

    await useRenderMemory()
    await useSupabaseUsage()

    const { build } = useRuntimeConfig()

    const eventStream = createEventStream(event);

    let lastCpu = useGetCpuUsagePercent();

    const interval = setInterval(async () => {
        
        const currentCpu = useGetCpuUsagePercent();
        const idleDiff = currentCpu.idle - lastCpu.idle;
        const totalDiff = currentCpu.total - lastCpu.total;
        const cpuPercent = totalDiff > 0 ? Math.round(100 - (100 * idleDiff / totalDiff)) : 0;
        lastCpu = currentCpu;

        eventStream.push(JSON.stringify({
            server: {
                totalMemory: build ? TOTAL_MEMORY_MB : Math.round(os.totalmem() / 1024 / 1024),
                cpu: cpuPercent,
                node: process.version,
                platform: process.platform,
                arch: process.arch,
                memory: {
                    rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
                    heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                    heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                    external: Math.round(process.memoryUsage().external / 1024 / 1024),
                    arrayBuffers: Math.round(process.memoryUsage().arrayBuffers / 1024 / 1024)
                },
                uptime: Math.floor(process.uptime()),
            },
            supabase: {
                bucket: {
                    id: TOTAL_STORAGE.bucket_id,
                    size: TOTAL_STORAGE.total_size_megabyte,
                    max: MAX_STORAGE_SIZE,
                    groups: TOTAL_STORAGE.groups
                },
                monthly: TOTAL_MONTHLY_ACTIVE_USERS
            }
        }));
    }, 1000);

    eventStream.onClosed(() => clearInterval(interval));

    return eventStream.send();
});

