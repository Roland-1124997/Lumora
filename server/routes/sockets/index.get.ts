import type { Peer, Message } from "crossws"

const server = useSupaBaseServer()

export default defineWebSocketHandler({
    async open(peer: Peer) {

        const { data } = await useSupaBaseUser(server, peer)

        if(data) {
            peer.subscribe(data.user.id)
            await useRegisterTopics(server, peer, data)
        }
        else peer.close()
    },
    async message(peer: Peer, message: Message) {

        const { data } = await useSupaBaseUser(server, peer)

        if(data) {

            const payload: Record<string, any> = message.json()
            
            if (payload.type == "update-topics") await useRegisterTopics(server, peer, data)

            if (payload.type == "delete") {
                peer.publish(payload.group_id, message.toString())
                await useRegisterTopics(server, peer, data)
            }

            if(payload.type == "kick") {
                peer.publish(payload.group_id, message.toString())
                await useRegisterTopics(server, peer, data)
            }

            if(payload.type == "update") {
                await useRegisterTopics(server, peer, data)
                peer.publish(payload.group_id, message.toString())
            }
        }

        else peer.close()
    },
})


const useWebSocketCookie = (peer: Peer, name: string) : string | undefined => {
    const cookieHeader = peer.request.headers.get('cookie')
    if (!cookieHeader) return undefined

    const cookies = cookieHeader.split(';').reduce((acc, cookieStr) => {
        const [key, ...rest] = cookieStr.trim().split('=')
        acc[key] = decodeURIComponent(rest.join('='))
        return acc
    }, {} as Record<string, string>)

    return cookies[name]
}

const useSupaBaseUser = async (server: SupabaseClient, peer: Peer) => {
    const access_token = useWebSocketCookie(peer, 'sb-access-token')
    const refresh_token = useWebSocketCookie(peer, 'sb-refresh-token')
    return await server.auth.getUser(access_token || refresh_token ) as any
}

const useRegisterTopics = async (server: SupabaseClient, peer: Peer, data: Record<string, any>) => {
    const topics = await useTopics(server, data)
    const topicIds = topics ? topics.map((topic: Tables<"members">) => topic.group_id).filter((id): id is string => id !== null) : []

    for (const topic of Array.from(peer.topics)) {
        if (!topicIds.includes(topic)) {
            peer.topics.delete(topic)
            peer.unsubscribe(topic)
        }
    }

    topicIds.forEach((id) => {
        if (!peer.topics.has(id)) {
            peer.topics.add(id)
            peer.subscribe(id)
        }
    })
}


const useTopics = async (server: SupabaseClient, data: any) => {
    const { data: topics } = await server.from("members").select("group_id").eq("user_id", data.user.id).overrideTypes <Array<Tables<"members">>>()
    return topics
}