
import type { RealtimeChannel } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {

    const client: SupabaseClient = await serverSupabaseClient(event);
    const server: SupabaseClient = serverSupabaseServiceRole(event)

    const eventStream = createEventStream(event);

    server.channel("public:notifications").on("postgres_changes", { event: "*", schema: "public", table: "notifications" },  async (event: any) => {
        
        const { data } = await client.auth.getUser();

        if(!data.user) {
            eventStream.close()
            return
        }
        
        if(data.user.id !== event.new.target_id) return; 
        else eventStream.push(JSON.stringify(event.new.id));
    }).subscribe();

    return eventStream.send();
})
