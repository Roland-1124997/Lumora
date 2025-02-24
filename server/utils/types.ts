import type { ZodIssue } from 'zod';
import type { AuthError } from '@supabase/auth-js';

export type { User, Session, AuthError } from '@supabase/auth-js';
export type { SupabaseClient } from "@supabase/supabase-js";
export type { H3Event } from "h3";

export interface query {
    search: string,
    page: string
}
export interface group {
    thumbnail: string
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
        redirect?: string
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
    data?: Record<string, unknown> | never[]
}
