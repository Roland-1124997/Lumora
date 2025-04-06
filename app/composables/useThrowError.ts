

export default function useThrowError(error: any) {
    throw createError({
        statusCode: error.value.data.status.code || 500,
        message: error.value.data.status.message || 'Internal Server Error',
        fatal: true,
    });
}






