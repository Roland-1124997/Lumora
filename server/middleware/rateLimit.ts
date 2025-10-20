export default defineEventHandler(async (event) => {

    const resource_available = checkRateLimit(event)

    if (!resource_available) {
        
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return useReturnResponse(event, {
            status: {
                success: false,
                message: "Too many requests",
                code: 429
            }
        });
    }   
});



