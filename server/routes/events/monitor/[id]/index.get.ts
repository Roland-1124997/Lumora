import os from "os";

export default defineEventHandler(async (event) => {
    
    const client: SupabaseClient = await serverSupabaseClient(event);

    const { data } = await client.auth.getUser();
    if (!data.user || data.user.app_metadata.plan !== "team") return;

    const { build } = useRuntimeConfig()

    const memory = await UseRenderMemory()

    const eventStream = createEventStream(event);

    function getCpuUsagePercent() {
        const cpus = os.cpus();
        let idle = 0, total = 0;
        for (const cpu of cpus) {
            for (const type in cpu.times) {
                total += cpu.times[type as keyof typeof cpu.times];
            }
            idle += cpu.times.idle;
        }
        const idleAvg = idle / cpus.length;
        const totalAvg = total / cpus.length;
        return { idle: idleAvg, total: totalAvg };
    }

    let lastCpu = getCpuUsagePercent();

    const getServerStats = () => {
        const currentCpu = getCpuUsagePercent();
        const idleDiff = currentCpu.idle - lastCpu.idle;
        const totalDiff = currentCpu.total - lastCpu.total;
        const cpuPercent = totalDiff > 0 ? Math.round(100 - (100 * idleDiff / totalDiff)) : 0;
        lastCpu = currentCpu;

        return {
            totalMemory: build ? memory : Math.round(os.totalmem() / 1024 / 1024),
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
        };
    }

    const interval = setInterval(async () => {
        eventStream.push(JSON.stringify(getServerStats()));
    }, 1000);

    eventStream.onClosed(() => clearInterval(interval));

    return eventStream.send();
});