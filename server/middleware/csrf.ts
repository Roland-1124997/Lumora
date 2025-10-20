export default defineEventHandler(async (event) => {
    
    const path = event.path || event.node.req.url || "";
    if (!path.startsWith("/api")) return;

    const method = event.method.toUpperCase();

    const rotateToken = () => {
        
        const token = (crypto?.randomUUID?.() ||
            `${Date.now().toString(36)}.${Math.random().toString(36).slice(2)}.${Math.random()
                .toString(36)
                .slice(2)}`)
            .replace(/\./g, "-");

        setCookie(event, "csrf-token", token, {
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            httpOnly: false,
            maxAge: 60 * 30,
        });

        setHeader(event, "x-csrf-token", token);
    };

    
    if (["GET", "HEAD"].includes(method)) {
        const exemptGetPaths = new Set(["/api/user", "/api/user/"]);
        if (!exemptGetPaths.has(path)) rotateToken();
        return;
    }

    if (method === "OPTIONS") return;

    const headerToken = getHeader(event, "x-csrf-token");
    const cookieToken = getCookie(event, "csrf-token");

    const valid = !!headerToken && !!cookieToken && headerToken === cookieToken;

    if (!valid) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return useReturnResponse(event, {
            status: {
                success: false,
                message: "Invalid CSRF token",
                code: 403,
            },
        });
    }

    rotateToken();
});