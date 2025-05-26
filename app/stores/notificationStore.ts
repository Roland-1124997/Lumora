export const useNotificationStore = defineStore("notification", () => {
    const notifications = ref<any[]>([]);

    const randomId = ref(Math.random().toString(36).substring(2, 15));
    const { data } = useEventSource(`/events/notifications/${randomId}`);
    $fetch('/api/notifications').then((response: any) => notifications.value = response.data);

    watch(data, async () => await fetchNotifications());

    const fetchNotifications = async () => {
        const response = await $fetch("/api/notifications");
        notifications.value = response.data;
    };

    const getAllNotifications = computed(() => notifications.value);
    const getUnreadNotifications = computed(() => notifications.value.filter((n: any) => !n.is_read));
    const unreadNotificationsCount = computed(() => getUnreadNotifications.value.length);

    const markNotificationAsRead = (id: number) => {
        notifications.value = notifications.value.map((n: any) =>
            n.id === id ? { ...n, is_read: true } : n
        );

        $fetch(`/api/notifications/${id}`, { method: "PATCH" }).catch();
    };

    const markAllNotificationsAsRead = () => {
        notifications.value = notifications.value.map((n: any) => ({ ...n, is_read: true }));

        $fetch("/api/notifications", { method: "PATCH" }).catch();

    };

    return {
        getAllNotifications,
        getUnreadNotifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        fetchNotifications,
    };
});