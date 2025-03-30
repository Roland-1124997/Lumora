export const useCheckPwa = () => {
    const PWAInstalled = ref(false); 
    const { $pwa } = useNuxtApp(); 

    onMounted(() => {
        if ($pwa && $pwa.isPWAInstalled) { 
            PWAInstalled.value = true;

            const installedCookie = useCookie("installed"); 
            installedCookie.value = "true"; 
        }
    });

    const installedCookie = useCookie("installed"); 
    if (installedCookie.value) console.log("The PWA is already installed.");
    else console.log("The PWA is not installed yet.");

    return { PWAInstalled: installedCookie.value } 
    
};