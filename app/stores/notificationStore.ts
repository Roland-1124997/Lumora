export const useNotificationStore = defineStore("notification", () => {
    const notifications = ref([
        { id: 1, title: "Nieuwe Reactie", message: "Je hebt een nieuwe reactie op je post.", time: "2 uur geleden", isRead: false },
        { id: 2, title: "Nieuwe Volger", message: "Je hebt een nieuwe volger.", time: "3 uur geleden", isRead: false },
        { id: 3, title: "Bericht Gelezen", message: "Je bericht is gelezen door de ontvanger.", time: "4 uur geleden", isRead: true },
        { id: 4, title: "Nieuwe Like", message: "Je post is geliked door iemand.", time: "5 uur geleden", isRead: false },
        { id: 5, title: "Nieuwe Reactie", message: "Je hebt een nieuwe reactie op je post.", time: "6 uur geleden", isRead: false },
        { id: 6, title: "Nieuwe Volger", message: "Je hebt een nieuwe volger.", time: "7 uur geleden", isRead: false },
        { id: 7, title: "Bericht Gelezen", message: "Je bericht is gelezen door de ontvanger.", time: "8 uur geleden", isRead: true },
        { id: 8, title: "Nieuwe Like", message: "Je post is geliked door iemand.", time: "9 uur geleden", isRead: false },
        { id: 9, title: "Nieuwe Reactie", message: "Je hebt een nieuwe reactie op je post.", time: "10 uur geleden", isRead: false },
        { id: 10, title: "Nieuwe Volger", message: "Je hebt een nieuwe volger.", time: "11 uur geleden", isRead: false },
        { id: 11, title: "Bericht Gelezen", message: "Je bericht is gelezen door de ontvanger.", time: "12 uur geleden", isRead: true },
        { id: 12, title: "Nieuwe Like", message: "Je post is geliked door iemand.", time: "13 uur geleden", isRead: false },
        { id: 13, title: "Nieuwe Reactie", message: "Je hebt een nieuwe reactie op je post.", time: "14 uur geleden", isRead: false },
        { id: 14, title: "Nieuwe Volger", message: "Je hebt een nieuwe volger.", time: "15 uur geleden", isRead: false },
        { id: 15, title: "Bericht Gelezen", message: "Je bericht is gelezen door de ontvanger.", time: "16 uur geleden", isRead: true },
        { id: 16, title: "Nieuwe Like", message: "Je post is geliked door iemand.", time: "17 uur geleden", isRead: false },
    ]);

    const getAllNotifications = computed(() => notifications.value);
    const getUnreadNotifications = computed(() => notifications.value.filter(n => !n.isRead));
    const unreadNotificationsCount = computed(() => getUnreadNotifications.value.length);

    const markNotificationAsRead = (id: number) => {
        notifications.value = notifications.value.map(n =>
            n.id === id ? { ...n, isRead: true } : n
        );
    };

    const markAllNotificationsAsRead = () => {
        notifications.value = notifications.value.map(n => ({ ...n, isRead: true }));
    };

    return {
        getAllNotifications,
        getUnreadNotifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
    };
});
