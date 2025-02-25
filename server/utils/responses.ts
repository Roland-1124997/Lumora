

export const internalServerError = {
    meta: {
        code: 500,
        message: "Internal Server Error",
    },
}

export const notFoundError = {
    meta: {
        code: 404,
        message: "Not Found",
    },
}

export const forbiddenError = {
    meta: {
        code: 403,
        message: "Forbidden",
    },
}

export const unauthorizedError = {
    meta: {
        code: 401,
        message: "Unauthorized",
    },
}

export const badRequestError = {
    meta: {
        code: 400,
        message: "Bad Request",
    },
}

export const useReturnResponse = (event: H3Event, startTime: number, data: response) => { setResponseStatus(event, data.meta.code)
    return {
        ...data,
        details: {
            duration: `${Date.now() - startTime}ms`,
            timestamp: new Date().toISOString(),
        }
    }
}