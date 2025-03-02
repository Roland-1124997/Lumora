export const rateLimits = new Map<string, { count: number; timestamp: number }>();
const routesConfig: any = useRuntimeConfig().rateLimit.routes;


const getRateLimitForRoute = (path: string) => {
    if (!path.endsWith('/')) path += '/'; 
    for (const route in routesConfig) {
        if (path === route) return routesConfig[route];

        if (route.endsWith('*')) {
            const baseRoute = route.slice(0, -1); 
            if (path.startsWith(baseRoute)) return routesConfig[route];
        }
    }
    return null;  
}


export const cleanupRateLimitForKey = (key: string): void => {
    const now = Date.now();

    const routeConfig = getRateLimitForRoute(key.split('-')[1]);
    if (!routeConfig) return; 

    const { intervalSeconds } = routeConfig;
    const windowMs = intervalSeconds * 1000; 

    if (rateLimits.has(key)) {
        const data = rateLimits.get(key)!;
        const secondsUntilReset = Math.ceil((windowMs - (now - data.timestamp)) / 1000);

        if (secondsUntilReset <= 0) rateLimits.delete(key);
    }
}


export const checkRateLimit = (event: H3Event): boolean => {

    const path = event.path.split("?")[0] || "/";
    const routeConfig = getRateLimitForRoute(path);

    if (!routeConfig) return true; 

    const { maxRequests, intervalSeconds } = routeConfig;
    const windowMs = intervalSeconds * 1000; 

    const ip = getIP(event);
    const now = Date.now();
    const key = `${ip}-${path}`;

    cleanupRateLimitForKey(key);

    const data = rateLimits.get(key) || { count: 0, timestamp: now };

    if (now - data.timestamp > windowMs) {
        data.count = 1;
        data.timestamp = now;
    } else {
        data.count += 1
    }

    const secondsUntilReset = Math.ceil((windowMs - (now - data.timestamp)) / 1000);

    if (data.count > maxRequests) {
        setRateLimitHeaders(event, Math.min(data.count + 1, maxRequests), maxRequests, secondsUntilReset);
        return false;
    }

    rateLimits.set(key, data);
    setRateLimitHeaders(event, data.count, maxRequests, secondsUntilReset);
    return true;
}

const setRateLimitHeaders = (event: any, current: number, limit: number, reset: number): void => {
    setHeader(event, 'x-ratelimit-current', current.toString());
    setHeader(event, 'x-ratelimit-limit', limit.toString());
    setHeader(event, 'x-ratelimit-reset', reset.toString());
}

const getIP = (event: H3Event) => {
    const req = event?.node?.req
    const xForwardedFor = getRequestHeader(event, 'x-forwarded-for')?.split(',')?.pop()?.trim() || ''
    const remoteAddress = req?.socket?.remoteAddress || ''
    let ip = xForwardedFor || remoteAddress

    if (ip) ip = ip.split(':')[0]

    return ip
}

