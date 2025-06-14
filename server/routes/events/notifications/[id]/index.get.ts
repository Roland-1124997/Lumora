
import type { RealtimeChannel } from "@supabase/supabase-js";
import webpush from 'web-push'

const config = useRuntimeConfig()

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
        else {

            webpush.setVapidDetails(
                'mailto:example@yourdomain.org',
                config.vapidPublicKey,
                config.vapidPrivateKey
            );

            const { data }: any = await server.from("push_subscriptions").select("*").eq("user_id", event.new.target_id).single()

            const payload = JSON.stringify({
                title: 'Hey!',
                body: 'Je hebt een push notificatie ontvangen!',
                icon: '/icon-192.png',
                url: 'https://jouwsite.nl'
            })

            webpush.sendNotification(data.subscription, payload)
                .then(() => console.log('Notificatie verzonden'))
                .catch(err => console.error('Fout bij verzenden:', err))

            eventStream.push(JSON.stringify(event.new.id));
        }
    }).subscribe();

    return eventStream.send();
})
