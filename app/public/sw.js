import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

self.addEventListener("push", async (event) => {
    
    const { title, message, icon } = await event.data.json();

    event.waitUntil(
        self.registration.showNotification(title, {
            body: message,
            icon,
        })
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    event.waitUntil(clients.matchAll({ type: "window"  }).then((clientList) => {
        for (const client of clientList) {
            if (client.url === "/" && "focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow("/");
    }));
});