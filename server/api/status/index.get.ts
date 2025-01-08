export default defineEventHandler((event) => {
    return new Promise(async (resolve) => {
        return resolve({ 
            statusCode: 200,
            statusMessage: "OK",
            message: "online",
        })
    })
});