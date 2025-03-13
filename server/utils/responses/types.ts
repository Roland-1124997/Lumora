import type { ZodIssue } from 'zod';
import type { AuthError } from '@supabase/auth-js';

export interface Group {
    id: string;
    name: string,
    description: string,
    last_active: string,
    last_photo_posted_by: string
    media: {
        type: string;
        url: string;
    };
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
interface ErrorResponse {
    type: 'fields' | 'auth';
    details: ZodIssue[] | AuthError| object
}

export interface permision {
    delete: boolean
}

export interface ApiResponse<T> {
    status: Status;
    meta?: Meta; 
    pagination?: Pagination;
    data?: T | null | Record<string, unknown>; 
    error?: ErrorResponse; 
}