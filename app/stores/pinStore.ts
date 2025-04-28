export const usePinStore = defineStore('pin', () => {

    const pinned = ref<Record<string, string[]>>({});
    const details = ref<Record<string, any[]>>({}); // Zorg dat details een array bevat

    const setPinned = (group_id: string, content: { id: string; [key: string]: any }) => {
        if (!pinned.value[group_id]) pinned.value[group_id] = [];
        if (!details.value[group_id]) details.value[group_id] = []; // Controleer of details bestaat

        const index = pinned.value[group_id].indexOf(content.id);

        if (index !== -1) {
            pinned.value[group_id].splice(index, 1);
            details.value[group_id].splice(index, 1);
        } else {
            pinned.value[group_id].push(content.id);
            details.value[group_id].push(content);
        }
    };

    const getPinned = (group_id: string, content: { id: string }) => {
        return pinned.value[group_id]?.includes(content.id) || false;
    };

    const getPinnedList = (group_id: string) => {
        return {
            ids: pinned.value[group_id] || [],
            details: details.value[group_id] || []
        };
    };

    const clearPinned = (group_id: string) => {
        if (pinned.value[group_id]) delete pinned.value[group_id];
        if (details.value[group_id]) delete details.value[group_id]; // Verwijder ook details
    };

    return {
        setPinned,
        getPinned,
        getPinnedList,
        clearPinned
    };
});