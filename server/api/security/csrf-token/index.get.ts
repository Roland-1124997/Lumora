export default defineEventHandler(async (event) => {
    const token = (globalThis.crypto?.randomUUID?.() ||
        `${Date.now().toString(36)}.${Math.random().toString(36).slice(2)}.${Math.random().toString(36).slice(2)}`)
        .replace(/\./g, "-");

    setCookie(event, "csrf-token", token, {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
        maxAge: 60 * 60,
    });

    setHeader(event, "x-csrf-token", token);

    return {
        status: {
            success: true,
            message: "CSRF token issued",
            code: 200,
        },
        data: {
            token,
        },
    }
});