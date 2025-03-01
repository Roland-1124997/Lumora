import type { ZodIssue } from 'zod';
import type { AuthError } from '@supabase/auth-js';

interface Group {
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
interface Post {
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
interface User {
    id: string;
    name: string;
}
interface permision {
    delete: boolean
}

export interface ApiResponse<T> {
    status: Status;
    meta?: Meta; 
    pagination?: Pagination;
    data?: T | null | Record<string, unknown>; 
    error?: ErrorResponse; 
}

export const internalServerError = {
    status: {
        success: false,
        message: "Internal Server Error",
        code: 500
    }
}

export const notFoundError = {
    status: {
        success: false,
        message: "Not Found",
        code: 404
    }
}

export const forbiddenError = {
    status: {
        success: false,
        message: "Forbidden",
        code: 403
    }
}

export const unauthorizedError = {
    status: {
        success: false,
        message: "Unauthorized",
        code: 401
    }
}

export const badRequestError = {
    status: {
        success: false,
        message: "Bad Request",
        code: 400
    }
}

export const useFormatGroupPosts = async (server: SupabaseClient, client: SupabaseClient, media: Record<string, any>) => {

    return await Promise.all(media.posts.map(async (posts: any) => {
        const { data } = await server.auth.admin.getUserById(posts.author.id);

        return {
            ...posts,
            author: {
                name: data.user?.user_metadata.name,
                is_owner: posts.author.is_owner
            },
            media: {
                type: "image",
                url: client.storage.from("images").getPublicUrl(posts.media.url).data.publicUrl,
            },
        };
    }));

}


export const useReturnResponse = (event: H3Event, data: ApiResponse<Post[] | Group[] | User | permision >) => { setResponseStatus(event, data.status.code)
    return { ...data }
}