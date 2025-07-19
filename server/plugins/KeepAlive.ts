import { consola } from "consola";
import chalk from 'chalk';

const { ServerUrl } = useRuntimeConfig()

export default defineNitroPlugin(async () => {

    consola.ready("Heartbeat initialized")

    setInterval(async () => {
        await fetch(`${ServerUrl}/api/status`).catch(err => console.error(err))
    }, 1000 * 60 * 2);

    /*
    ************************************************************************************
    */

    consola.ready("Monitor initialized")

    setInterval(async () => {
        await useRenderMemory()
        await useSupabaseUsage()
    }, 1000 * 60 * 10);

    /*
    ************************************************************************************
    */

    consola.ready("cleanup limiter initialized")

    setInterval(() => {
        rateLimits.forEach((data, key) => cleanupRateLimitForKey(key))
    }, 1000 * 60 * 5);

    /*
    ************************************************************************************
    */

    consola.ready("Queue deletion initialized")

    const supabase = useSupaBaseServer();

    setInterval(async () => {
        const startTime = Date.now();
        console.log(`\n${chalk.black('[Queue]')}\nRunning at: ${chalk.black(new Date().toLocaleString())}`);

        let done = 0;
        const { data, error } = await supabase.from("deletion_queue").select("*");

        if (data && data.length > 0 && !error) {
            for (const queue of data) {
                await supabase.storage.from("images").remove([queue.thumbnail]);
                await supabase.from("deletion_queue").delete().eq('thumbnail', queue.thumbnail);
                done++;
            }
        }

        console.log(`  ${chalk[done > 0 ? 'green' : 'red']('> Task:')} ${done} action${done !== 1 ? 's' : ''} completed successfully.`);
        console.log(`  ${chalk.bold('> Time elapsed:')} ${Date.now() - startTime} ms.`);

    }, 1000 * 60 * 30);

})

