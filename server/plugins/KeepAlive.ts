import { useScheduler } from "#scheduler"

const { ServerUrl } = useRuntimeConfig()
export default defineNitroPlugin(() => {
    const scheduler = useScheduler();
    scheduler.run(async () => {
        await fetch(`${ServerUrl}/api/status`).catch(err => console.error(err))
    }).everyMinutes(2)
})



