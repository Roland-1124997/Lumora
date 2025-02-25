import { useScheduler } from "#scheduler";
import { consola } from "consola";
import chalk from 'chalk';

export default defineNitroPlugin(() => {

    const supabase = useSupaBaseServer();
    const scheduler = useScheduler();

    consola.ready("Scheduler initialized")
    scheduler.run(async () => {

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

    }).everyMinutes(30)
});