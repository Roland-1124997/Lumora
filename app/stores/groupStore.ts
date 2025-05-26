

interface GroupState {
    group: {
        name: string
    },
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


const useStorage = () => {

    const setItem = (STORAGE_KEY: string, value: any) => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    }

    const getItem = (STORAGE_KEY: string) => {
        const data = sessionStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    }

    const removeItem = (STORAGE_KEY: string) => {
        sessionStorage.removeItem(STORAGE_KEY);
    }

    return {
        setItem,
        getItem,
        removeItem
    }
}


const saveToStorage = (STORAGE_KEY: string, state: any = null) => {
    if(state) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    else sessionStorage.removeItem(STORAGE_KEY)
};

const modifyItemByMetaId = (state: Map<string, GroupState>, name: string, metaId: string, action: 'update' | 'remove', updatedFields: object = {}) => {
    const groupState = state.get(name);
    if (!groupState) return;

    const index = groupState.data.findIndex((item: Record<string, any>) => item.id === metaId);
    if (index < 0) return;

    if (action === 'update') groupState.data[index] = { ...groupState.data[index], ...updatedFields };
    if (action === 'remove') groupState.data.splice(index, 1);

    state.set(name, groupState);
    saveToStorage(`${name}_List`, groupState);
};

export const useGroupStore = defineStore('group', () => {
    const state = new Map<string, GroupState>();
    const scrollState = new Map<string, scrollState>();

    const getGroupData = (name: string) => {
        const data = useStorage().getItem(`${name}_List`)
        if(data) { state.set(name, data)}
        return state.get(name);
    };

    const getScrollData = (name: string) => {
        const data = useStorage().getItem(`${name}_Scroll`)
        if (data) {scrollState.set(name, data)}
        return scrollState.get(name)
    };

    const setGroupData = (name: string, group: string, page: number, total: number, data: object[]) => {
        if (state.has(name) || data.length == 0) return;
        state.set(name, { group: { name: group }, pagination: { page, total }, data });
        useStorage().setItem(`${name}_List`, state.get(name));
    };

    const setItemToStart = (name: string, newItem: object | object[]) => {
        const groupState = state.get(name);
        if (!groupState) return;

        const items = Array.isArray(newItem) ? newItem : [newItem];
        groupState.data.unshift(...items); 

        const maxItems = groupState.pagination.page * 12;  
        const totalItems = groupState.data.length;       

        if (totalItems > maxItems) {
            groupState.data.splice(maxItems); 
        }

        if (totalItems > groupState.pagination.total * 12) {
            groupState.pagination.total = Math.ceil(totalItems / 12);
        }

        if (groupState.pagination.page > groupState.pagination.total) {
            groupState.pagination.page = groupState.pagination.total;
        }

        useStorage().setItem(`${name}_List`, groupState);
    };

    const updateScrollData = (name: string, percentage: number, pixels: number) => {
        scrollState.set(name, { percentage, pixels });
        useStorage().setItem(`${name}_Scroll`, scrollState.get(name));
        
    }

    const updateGroupData = (name: string, group: string, page: number, total: number, data: object[]) => {
        if (!state.has(name)) return;
        state.set(name, { group: { name: group, }, pagination: { page, total }, data });
        
        useStorage().setItem(`${name}_List`, state.get(name));
        
    };

    const updateItemByMetaId = (name: string, metaId: string, updatedFields: object) => modifyItemByMetaId(state, name, metaId, 'update', updatedFields);
    const removeItemByMetaId = (name: string, metaId: string) => modifyItemByMetaId(state, name, metaId, 'remove');

    const removeData = (name: string, options: any = null) => {

        state.delete(name);
        useStorage().removeItem(`${name}_List`);
        
        if(!options?.partial) {
            scrollState.delete(name);
            useStorage().removeItem(`${name}_Scroll`);
        } 

    }

    const clearAllData = () => {
        state.clear();
        scrollState.clear();
    };

    return {
        setGroupData,
        setItemToStart,
        getGroupData,
        getScrollData,
        updateGroupData,
        updateScrollData,
        updateItemByMetaId,
        removeItemByMetaId,
        removeData,
        clearAllData
        
    };
});

