import { useScheduler } from "#scheduler"
import { consola } from "consola";

const { ServerUrl } = useRuntimeConfig()
export default defineNitroPlugin(async () => {
    const scheduler = useScheduler();
    
    consola.ready("Heartbeat initialized")
    scheduler.run(async () => {
        await fetch(`${ServerUrl}/api/status`).catch(err => console.error(err))
    }).everyMinutes(2)
})

