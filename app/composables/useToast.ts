type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id?: number;
    message: string;
    type: ToastType;
    duration?: number;
}

const toasts = ref<Toast[]>([]);

export function useToast() {
    const addToast = ({ message, type = 'success', duration = 3000 }:Toast ): void => {
        const id = Date.now();

        toasts.value.push({ id, message, type });
        if (toasts.value.length > 6) toasts.value.shift();
        
        setTimeout(() => removeToast(id), duration);
    };

    const removeToast = (id: number): void => {
        toasts.value = toasts.value.filter((toast) => toast.id !== id);
    };

    return {
        toasts,
        addToast,
        removeToast,
    };
}