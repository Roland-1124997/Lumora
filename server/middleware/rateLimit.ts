import { useScheduler } from "#scheduler";

const scheduler = useScheduler();

scheduler.run(() => {
    rateLimits.forEach((data, key) => cleanupRateLimitForKey(key))
}).everyMinutes(5)

export default defineEventHandler((event) => {
    if (!checkRateLimit(event)) return useReturnResponse(event, {
        status: {
            success: false,
            message: "Too many requests",
            code: 429
        }
    });
});



