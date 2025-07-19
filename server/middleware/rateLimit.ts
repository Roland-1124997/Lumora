export default defineEventHandler((event) => {
    if (!checkRateLimit(event)) return useReturnResponse(event, {
        status: {
            success: false,
            message: "Too many requests",
            code: 429
        }
    });
});



