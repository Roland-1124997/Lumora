
import type { H3Event } from "h3";

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

export const useReturnResponse = (event: H3Event, startTime: number, data: any) => {  setResponseStatus(event, data.meta.code)
    return {
        ...data,
        details: {
            duration: `${Date.now() - startTime}ms`,
            timestamp: new Date().toISOString(),
        }
    }
}