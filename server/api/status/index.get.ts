export default defineEventHandler((event) => {
    new Promise(async (resolve) => {
        return resolve({ 
            statusCode: 200,
            statusMessage: "OK",
            message: "online",
        })
    })
});