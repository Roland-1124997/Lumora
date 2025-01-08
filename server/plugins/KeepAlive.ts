import { useScheduler } from "#scheduler"

const { ServerUrl }: any = useRuntimeConfig()
export default defineNitroPlugin(() => {
    const scheduler = useScheduler();
    scheduler.run(() => {
        setTimeout(async () => await fetch(`${ServerUrl}/api/status`).catch(err => console.error(err)))
    }).everyMinutes(2)
})



