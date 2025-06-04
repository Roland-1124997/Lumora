interface ModalRequestConfig {
    open: boolean
    type: string
    name: string
    requestUrl: string
    resize?: boolean
    minimized?: boolean
    loading?: boolean
}

export const useModal = () => {
    const context = inject<any>('modal')
    if (!context) throw new Error('Modal context not found. Make sure it is provided.')

    const { updateModalValue } = context

    const open = <T>(config: ModalRequestConfig) => {
        let successCallback: ((args: SuccessResponse<T>) => Promise<void>) | null = null
        let errorCallback: ((args: ErrorResponse) => Promise<void>) | null = null

        const handleSuccess = async (args: SuccessResponse<T>) => {
            await defaultSuccessHandler(args)
            if (successCallback) await successCallback(args)
        }

        const handleError = async (args: ErrorResponse) => {
            await defaultErrorHandler(args)
            if (errorCallback) await errorCallback(args)
        }

        updateModalValue({
            ...config,
            resize: config.resize ?? false,
            minimized: config.minimized ?? false,
            loading: config.loading ?? false,
            onSuccess: handleSuccess,
            onError: handleError,
            controller: new AbortController(),
        })

        return {
            onSuccess(callback: typeof successCallback) {
                successCallback = callback
            },
            onError(callback: typeof errorCallback) {
                errorCallback = callback
            },
        }
    }

    return { open }
}

const defaultSuccessHandler = async <T>({ response }: SuccessResponse<T>) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (response?.status?.redirect) navigateTo(response.status.redirect)
}

const defaultErrorHandler = async ({ error, actions }: ErrorResponse) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (error?.data?.error?.type === 'fields') actions.setErrors(error.data.error.details)
    else actions.setErrors({ message: ['Something went wrong. Please try again later.'] })
    
}
