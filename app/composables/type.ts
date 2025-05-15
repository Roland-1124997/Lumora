import type { ZodIssue } from 'zod';
import type { AuthError } from '@supabase/auth-js';


interface Status {
    success: boolean;
    redirect?: string,
    refresh?: boolean,
    message: string;
    code: number;
}
interface Meta {
    id: string;
    name?: string;
    description?: string;
}
interface Pagination {
    page: number;
    total: number;
}
interface Error {
    type: 'fields' | 'auth';
    details: ZodIssue[] | AuthError 
}

export interface Group {
    id: string;
    name: string,
    description: string,
    last_active: string,
    last_photo_posted_by?: string
    permisions?: {
        delete: boolean
    }
    media: {
        type: string;
        url: string;
    };
    posts?: Post
}
export interface Post {
    id: string;
    created_at: string;
    has_liked?: boolean;
    author: {
        name: string;
        is_owner: boolean;
    };
    likes: {
        count: number;
    };
    media: {
        type: string;
        url: string;
    };
}
export interface User {
    id: string;
    name: string;
}
export interface SuccessResponse<Type> {
    response: {
        status: Status;
        meta?: Meta; 
        pagination?: Pagination;
        data?: Type ; 
    },
}

export interface ErrorResponse {
    error: {
        data: {
            status: Status;
            meta?: Meta;
            error?: Error | Record<string, any>; 
        }
    };
    actions: {
        setErrors: (errors: Record<string, string[]>) => void;
        resetForm: () => void;
    };
}

export interface ApiResponse<Type> {
    status: Status;
    meta?: Meta;
    pagination?: Pagination;
    data?: Type | Type[] | null | { [key: string]: any } | undefined;
    error?: Error | Record<string, any>;
}


