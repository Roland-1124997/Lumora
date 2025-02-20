export default defineEventHandler((event) => {
    const time = Date.now();

    return useReturnResponse(event, time, {
        meta: {
            code: 200,
            message: "OK",
        },
    })
});