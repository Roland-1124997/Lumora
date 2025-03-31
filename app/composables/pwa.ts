export const useCheckPwa = () => {
    const PWAInstalled = ref(false); 
    const { $pwa } = useNuxtApp(); 
    
    onMounted(() => {
        if ($pwa && $pwa.isPWAInstalled) PWAInstalled.value = true;
    });
    
    return { PWAInstalled } 
};