
export const usePush = () => {


    const subscribe = async () => {
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
