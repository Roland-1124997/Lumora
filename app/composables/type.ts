export interface SuccessResponse {
    response: {
        meta: {
            code: number;
            message: string;
            redirect?: string;
            refresh?: boolean
        },
        details: {
            duration: string;
            timestamp: string;
        }
    },
}

export interface ErrorResponse {
    error: {
        data: {
            meta: {
                code: number;
                message: string;
            },
            details: {
                duration: string;
                timestamp: string;
            },
            
            errors: {
                field?: Record<string, string[]>;
                auth?: Record<string, unknown> 
            }
        }
    };
    actions: {
        setErrors: (errors: Record<string, string[]>) => void;
    };
}

