export default defineEventHandler(async (event) => {

    const resource_available = checkRateLimit(event)

    if (!resource_available) return useReturnResponse(event, {
        status: {
            success: false,
            message: "Too many requests",
            code: 429
        }
    });
});



