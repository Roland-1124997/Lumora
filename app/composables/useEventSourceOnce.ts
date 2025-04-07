
const sources = new Map<string, EventSource>()

export function useEventSourceOnce(groupId: string, onMessage: (data: any) => void) {
    if (sources.has(groupId)) return

    const source = new EventSource(`/socket/moments/${groupId}`)
    source.onmessage = (event) => {
        const response = JSON.parse(event.data)
        onMessage(response)
    }

    sources.set(groupId, source)
}


export function closeEventSource(groupId: string) {
    const source = sources.get(groupId)
    if (source) {
        source.close()
        sources.delete(groupId)
    }
}

export function closeAllEventSources() {
    sources.forEach((source) => source.close())
    sources.clear()
}
