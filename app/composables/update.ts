
const payload = ref()

export const useServerEvent = async () => {

    const update = (data: any) => payload.value = data

    return {
        payload,
        update
    }

}