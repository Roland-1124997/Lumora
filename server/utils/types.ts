import type { ZodIssue } from 'zod';
import type { AuthError, UserResponse } from '@supabase/auth-js';


export type { User, Session, AuthError } from '@supabase/auth-js';
export type { SupabaseClient } from "@supabase/supabase-js";
export type { H3Event } from "h3";

export interface query {
    search: string,
    page: string,
    slug: string
}
export interface group {
    thumbnail: string,
    last_photo_posted_by: string
}
export interface post {
    url: string
    author_id: string 
    author: string 
}
export interface MultiPartData {
    name?: string;
    data: Buffer | string
}
export interface FormDataItem {
    name: string;
    data: Buffer | string | never[];
}
export interface response {
    meta: {
        code: number,
        message: string,
        redirect?: string,
        refresh?: boolean
    }
    errors?: {
        field?: Record<string, unknown> | ZodIssue[] | ZodIssue
        auth?: Record<string, unknown> | AuthError
    }
    user?: {
        id: string;
        name: string;
        email: {
            verified: boolean;
        };
    } | null,
    pagination?: {
        page: number,
        total: number
    },
    data?: Record<string, any> | group[] | post[] | never[] 
}
