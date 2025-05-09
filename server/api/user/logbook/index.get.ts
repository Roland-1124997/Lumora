
export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const query: query = getQuery(event);
    const { items, page, start, end } = useMakePagination(100, query);

    /*
    ************************************************************************************
    */

    return useReturnResponse(event, {
        status: {
            success: true,
            refresh: true,
            message: "Ok",
            code: 200
        },
    });
})

