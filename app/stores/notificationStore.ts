


export const useNotificationStore = defineStore("Notification", () => {
    
    const data = ref([
        { id: 1, title: "Nieuwe Reactie", message: "Je hebt een nieuwe reactie op je post.", time: "2 uur geleden" },
        { id: 2, title: "Nieuwe Volger", message: "Je hebt een nieuwe volger.", time: "3 uur geleden" },
        { id: 3, title: "Bericht Gelezen", message: "Je bericht is gelezen door de ontvanger.", time: "4 uur geleden" },
        { id: 4, title: "Nieuwe Like", message: "Je post is geliked door iemand.", time: "5 uur geleden" },
        { id: 5, title: "Nieuwe Reactie", message: "Je hebt een nieuwe reactie op je post.", time: "6 uur geleden" },
        { id: 6, title: "Nieuwe Volger", message: "Je hebt een nieuwe volger.", time: "7 uur geleden" },
        { id: 7, title: "Bericht Gelezen", message: "Je bericht is gelezen door de ontvanger.", time: "8 uur geleden" },
        { id: 8, title: "Nieuwe Like", message: "Je post is geliked door iemand.", time: "9 uur geleden" },
        { id: 9, title: "Nieuwe Reactie", message: "Je hebt een nieuwe reactie op je post.", time: "10 uur geleden" },
        { id: 10, title: "Nieuwe Volger", message: "Je hebt een nieuwe volger.", time: "11 uur geleden" },
        { id: 11, title: "Bericht Gelezen", message: "Je bericht is gelezen door de ontvanger.", time: "12 uur geleden" },
        { id: 12, title: "Nieuwe Like", message: "Je post is geliked door iemand.", time: "13 uur geleden" },
        { id: 13, title: "Nieuwe Reactie", message: "Je hebt een nieuwe reactie op je post.", time: "14 uur geleden" },
        { id: 14, title: "Nieuwe Volger", message: "Je hebt een nieuwe volger.", time: "15 uur geleden" },
        { id: 15, title: "Bericht Gelezen", message: "Je bericht is gelezen door de ontvanger.", time: "16 uur geleden" },
        { id: 16, title: "Nieuwe Like", message: "Je post is geliked door iemand.", time: "17 uur geleden" },
    ]);

    const count = ref(data.value.length);

    const getData = () => {
        return { count, data };
    };

    const removeData = (options: Record<string, any>) => {
        data.value = data.value.filter(notification => notification.id !== options.notification.id);
        count.value = data.value.length;
    }

    return {
        getData,
        removeData,
    }


    
});