
export const usePush = () => {
    const isIosPwa = (): boolean => {
        const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
        const isStandalone = ('standalone' in window.navigator) && (window.navigator['standalone'] === true)
        return isIos && isStandalone
    }

    const { addToast } = useToast();

    const subscribe = async () => {

        const permission = await Notification.requestPermission()
        if (permission !== 'granted') return

        // if (isIosPwa()) return addToast({
        //     message: `An error occurred, iOS PWA push: native PushManager is not supported.`,
        //     type: "error",
        //     duration: 5000,
        // });
            
        try {
            const registration = await navigator.serviceWorker.ready
            const { vapidPublicKey } = useRuntimeConfig().public
            const vapidKey = vapidPublicKey?.trim().replace(/['",]/g, '')

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidKey)
            })

            await $fetch('/api/notifications', {
                method: 'POST',
                body: { subscription }
            })
        }

        catch(error) {

            addToast({
                message: `An error occurred, ${error}`,
                type: "error",
                duration: 5000,
            });

        }

        
    }

    return { subscribe }
}

const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}
