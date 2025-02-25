

interface GroupState {

    pagination: {
        page: number;
        total: number;
    }
    data: object[];
}

interface scrollState {
    percentage: number;
    pixels: number;
}

const saveToStorage = (STORAGE_KEY: string, state: any) => {
    if(state) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    else sessionStorage.removeItem(STORAGE_KEY)
};

export const useGroupStore = defineStore('group', () => {
    const state = new Map<string, GroupState>();
    const scrollState = new Map<string, scrollState>();

    const getGroupData = (name: string) => {
        const data = sessionStorage.getItem(`${name}_List`)
        if(data) { state.set(name, JSON.parse(data))}
        return state.get(name);
    };

    const getScrollData = (name: string) => {
        const data = sessionStorage.getItem(`${name}_Scroll`)
        if (data) {scrollState.set(name, JSON.parse(data))}
        return scrollState.get(name)
    };

    const setGroupData = (name: string, page: number, total: number, data: object[]) => {
        if (state.has(name)) return;
        state.set(name, { pagination: { page, total }, data });
        saveToStorage(`${name}_List`, state.get(name));
    };

    const updateScrollData = (name: string, percentage: number, pixels: number) => {
        scrollState.set(name, { percentage, pixels });
        saveToStorage(`${name}_Scroll`, scrollState.get(name));
    }

    const updateGroupData = (name: string, page: number, total: number, data: object[]) => {
        if (!state.has(name)) return;
        state.set(name, { pagination: { page, total }, data });
        saveToStorage(`${name}_List`, state.get(name));
    };

    const removeData = (name: string) => {
        state.delete(name);
        scrollState.delete(name);
        saveToStorage(`${name}_List`, null);
        saveToStorage(`${name}_Scroll`, null);
    }

    return {
        setGroupData,
        getGroupData,
        getScrollData,
        updateGroupData,
        updateScrollData,
        removeData
    };
});

