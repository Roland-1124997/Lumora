export default defineNuxtPlugin(() => {
    if (import.meta.server) return;

    const token = useCookie<string | undefined>("csrf-token");
    if (!token.value) $fetch("/api/security/csrf-token")
    
});
