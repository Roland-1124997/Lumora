import { useScheduler } from "#scheduler";
import { consola } from "consola";

export default defineNitroPlugin(async () => {

    const scheduler = useScheduler();

    consola.ready("monitor initialized")
    scheduler.run(async () => {
        
        await useRenderMemory()
        await useSupabaseUsage()
        await useRequestLogs()

    }).everyMinutes(10)
});


