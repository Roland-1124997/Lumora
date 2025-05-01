export default defineNuxtPlugin((nuxtApp) => {
    const originalFetch = $fetch;

    const fetch = async (url: Parameters<typeof $fetch>[0], options: Parameters<typeof $fetch>[1] & { sessions?: boolean } = {}) => {

        if (typeof url === 'string' && (!url.startsWith('/api/auth') || url === '/api/auth/logout') && 
        (options.sessions || ['POST', 'PATCH', 'PUT', 'DELETE'].includes(options.method || ''))) {
            await originalFetch('/api/user');
        }
        
        return originalFetch(url, options).then(async (response) => response).catch((error) => {
            throw error;
        });
    };

    nuxtApp.provide('fetch', fetch);
    fetch.raw = originalFetch.raw;
    fetch.create = originalFetch.create;

    Object.assign(fetch, originalFetch);
    globalThis.$fetch = fetch as typeof $fetch;
});