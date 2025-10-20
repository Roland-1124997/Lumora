export const rateLimits = new Map<string, { count: number; timestamp: number }>();
const routesConfig: any = useRuntimeConfig().rateLimit.routes;

// Ensure consistent trailing slash handling for matching and keys
const normalizePath = (path: string) => (path?.endsWith('/') ? path : `${path}/`);

// Find the matching route entry and return both the config and the route key used
const getRateLimitForRoute = (
    rawPath: string,
    method: string
): { routeKey: string; config: { methods: string[]; maxRequests: number; intervalSeconds: number } } | null => {
    const path = normalizePath(rawPath);

    for (const routeKey in routesConfig) {
        const config = routesConfig[routeKey];
        const routePattern = new RegExp(
            `^${routeKey
                .replace(/\[.*?\]/g, '[^/]+')
                .replace(/\*/g, '.*')
                .replace(/\/$/, '')}/?$`
        );

        if (routePattern.test(path)) {
            if (config.methods.includes('*') || config.methods.includes(method)) {
                return { routeKey, config };
            }
        }
    }
    return null;
};

export const cleanupRateLimitForKey = (key: string): void => {
    const now = Date.now();

    // Keys are structured JSON: { ip, method, route }
    let parsed: { ip: string; method: string; route: string } | null = JSON.parse(key);

    if (!parsed) return;
    const routeConfig = routesConfig?.[parsed.route];
    if (!routeConfig) return;

    const windowMs = routeConfig.intervalSeconds * 1000;

    if (rateLimits.has(key)) {
        const data = rateLimits.get(key)!;
        if (now - data.timestamp >= windowMs) {
            rateLimits.delete(key);
        }
    }
};

export const checkRateLimit = (event: H3Event): boolean => {
    const rawPath = event.path.split("?")[0] || "/";
    const method = event.node.req.method || "GET";
    const match = getRateLimitForRoute(rawPath, method);

    if (!match) return true; 
    

    const { config: routeConfig, routeKey } = match;
    const { maxRequests, intervalSeconds } = routeConfig;
    const windowMs = intervalSeconds * 1000;

    const ip = getIP(event);
    const now = Date.now();

    const key = JSON.stringify({ ip, method, route: routeKey });

    cleanupRateLimitForKey(key);

    const data = rateLimits.get(key) || { count: 0, timestamp: now };

    if (now - data.timestamp > windowMs) {
        data.count = 1;
        data.timestamp = now;
    } else {
        data.count += 1;
    }

    const secondsUntilReset = Math.ceil((windowMs - (now - data.timestamp)) / 1000);

    if (data.count > maxRequests) {
        setRateLimitHeaders(event, Math.min(data.count + 1, maxRequests), maxRequests, secondsUntilReset);
        return false;
    }

    rateLimits.set(key, data);
    setRateLimitHeaders(event, data.count, maxRequests, secondsUntilReset);
    return true;
};

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

