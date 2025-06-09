export const useNotificationStore = defineStore("notification", () => {
    const notifications = ref<any>([]);

    const store = useSessionsStore()
    const { makeRequest } = useRetryableFetch({ throwOnError: false })

    const fetchNotifications = async () => {
        const { data } = await makeRequest<Group[]>('/api/notifications')
        if (data.value) notifications.value = data.value.data;
    };

    onMounted(async () => {

        const user = await store.getSession()
        const { data: events } = useEventSource(`/events/notifications/${user.data?.id}`, [], {
            autoReconnect: true
        });

        watch(events, async () => await fetchNotifications());

        await fetchNotifications();
    });

    const getAllNotifications = computed(() => notifications.value);
    const getUnreadNotifications = computed(() => notifications.value.filter((n: any) => !n.is_read));
    const unreadNotificationsCount = computed(() => getUnreadNotifications.value.length);

    const markNotificationAsRead = (id: number) => {
        notifications.value = notifications.value.map((n: any) =>
            n.id === id ? { ...n, is_read: true } : n
        );

        makeRequest(`/api/notifications/${id}`, { method: "PATCH" })
    };

    const markAllNotificationsAsRead = () => {
        notifications.value = notifications.value.map((n: any) => ({ ...n, is_read: true }));

        makeRequest("/api/notifications", { method: "PATCH" })
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