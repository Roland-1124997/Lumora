import { useScheduler } from "#scheduler";

export default defineNitroPlugin(() => {

    const supabase = useSupaBaseServer()

    const scheduler = useScheduler();
    scheduler.run(async () => {
        const { data, error } = await supabase.from("deletion_queue").select("*");

        if (!error) data.forEach((queue) => supabase.storage.from("images").remove([queue.thumbnail])
            .then(() => supabase.from("deletion_queue").delete().eq('thumbnail', queue.thumbnail))
            .then(() => console.log("Deleted successfully:", queue.thumbnail))
            .catch((err) => console.error("Error deleting thumbnail:", queue.thumbnail, err))
        )

        else console.error("Error fetching deletion queue:", error);
    }).everyHours(1);
});

