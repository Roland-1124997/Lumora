
export default defineEventHandler(async (event) => {

    const path = event.path;
    const blacklist = ["/api/status", "/api/user", "/api/notifications"]

    const shouldSkip = !path.startsWith("/api") ||
        blacklist.some(p => path.startsWith(p));

    if (shouldSkip) return;

    const server = serverSupabaseServiceRole(event)
    
    const routes = await useApiRoutes()
    const { route } = matchRoute(path, routes);

    await server.from("requests").insert({
        path: route.path,
        method: event.method
    })

})

