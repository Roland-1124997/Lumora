let payloadString: Record<string, any> | null = null;

export const userServerSocket = () => {
    const broadcastEvent = (payload: Record<string, any>) => {
        payloadString = payload;
    };

    const getPayLoad = () => {
        return payloadString;
    };

    const deletePayLoad = () => {
        payloadString = null;
    };

    return {
        getPayLoad, 
        broadcastEvent,
        deletePayLoad
    };
};