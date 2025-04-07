let eventStream: any = null;
let id: any = null;

export const useEventStream = (event: H3Event) => {

    const create = (options?: Record<string, any>) => {
        id = options?.id || null;

        eventStream = createEventStream(event);
        eventStream.onClosed(() => eventStream = null);

        return eventStream
    }

    const push = async (data: Record<string, any>) => {
        if (eventStream && data.group_id == id) await eventStream.push(JSON.stringify(data));
    }

    return {
        create,
        push,
    }
}