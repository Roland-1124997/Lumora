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
            const total = data.length;
            
            const updateProgressBar = (done: number, total: number) => {
                const percentage = Math.floor((done / total) * 100);
                const progress = Math.floor((percentage / 100) * 20);
                const bar = '█'.repeat(progress) + '-'.repeat(20 - progress);
                process.stdout.write(`\r[${bar}] ${percentage}%`);
            };

            for (const queue of data) {
                done++;
                await supabase.storage.from("images").remove([queue.thumbnail]);
                await supabase.from("deletion_queue").delete().eq('thumbnail', queue.thumbnail);
                updateProgressBar(done, total);
            }

            process.stdout.write('\n'); 
        } 

        console.log(`  ${chalk[done > 0 ? 'green' : 'red']('> Task:')} ${done} action${done !== 1 ? 's' : ''} completed successfully.`);
        console.log(`  ${chalk.bold('> Time elapsed:')} ${Date.now() - startTime} ms.`);

    }).everyMinutes(1)
});