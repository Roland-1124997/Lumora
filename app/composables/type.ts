import type { ZodIssue } from 'zod';
import type { AuthError } from '@supabase/auth-js';
import type { InternalApi, } from 'nitropack'

export type FetchUrl = Parameters<typeof $fetch>[0];
export type FetchOptions = Parameters<typeof $fetch>[1];

interface Media {
    type: "image";
    url: string;
}

interface ConfigSection {
    title: string;
    options: ConfigOption[];
}

interface ConfigOption {
    key: string;
    label: string;
    value: boolean;
}


interface Author {
    name: string;
    url: string;
    is_owner: boolean;
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

interface Error {
    type: 'fields' | 'auth';
    details: ZodIssue[] | AuthError
}

export interface GroupSettings {
    id: string;
    name: string;
    thumbnail: string;
    last_active: string;
    last_photo_posted_by: string | null;
    owner_id: string;
    description: string;
    last_action: string;
    accepted: boolean;
    permision: {
        change: boolean;
        delete: boolean;
        create: boolean;
        edit: boolean;
    };
    media: Media
    configuration: {
        sections: ConfigSection[];
    };
}

export interface GroupMember {
    id: string;
    name: string;
    avatar: string;
    accepted: boolean;
    Permissions: MemberPermissions;
}

interface MemberPermissions {
    can_edit_group: boolean;
    can_delete_group: boolean;
    can_delete_messages_all: boolean;
}


export interface Actions {
    setErrors: (field: Record<string, string[]>) => void;
    resetForm: () => void;
}

export interface Interactions {
    has_liked: boolean;
    likes: {
        count: number;
    };
    comments?: {
        count: number;
    };
}

export interface InviteLink {
    created_at: string;
    expiresAt: string | null;
    code: string;
    uses: number;
    group_id: string;
    id: string;
    user_id: string;
    permision: {
        delete: boolean;
    };
}

export interface Pending {
    accepted: boolean,
    need_approval: boolean,
    posts_count_need_approval: number,
    has_interaction: boolean,
    has_permisons: boolean
}

export interface GroupOverview {
    id: string,
    name: string,
    description: string,
    last_active: Date,
    last_action: "Rejected" | "Approved",
    needs_attention: boolean,
    last_photo_posted_by: {
        url: string
    },
    media: Media
}

export interface PostUserDetails {
    id: string;
    created_at: string;
    has_interactions: Interactions
    author: Author
    permision: {
        can_delete_message: boolean;
    };
    media: Media
    related: RelatedPost[];
}

export interface RelatedPost {
    post_data: {
        id: string;
        media: {
            type: string;
            url: string;
        };
    };
}

export interface UserComments {
    id: string;
    created_at: string;
    author: Author
    content: {
        text: string;
    };
    related: UserComments[];
    deleted: boolean;
}

export interface ApiUserComments {
    count: number,
    comments: UserComments[]
}

export interface Post {
    id: string;
    created_at: string;
    updated_at: string;
    accepted_at: string;
    has_left: boolean;
    has_been_accepted: boolean;
    has_interactions: Interactions;
    author: Author;
    media: Media;
}

export interface User {
    id: string;
    name: string;
    avatar: string,
    email: string,
    team: boolean,
    provider: string,
    factors: boolean
}

export interface SuccessResponse<Type> {
    response: {
        status: Status;
        meta?: Meta;
        pagination?: Pagination;
        data: Type;
    },
}

export interface ErrorResponse {
    error: {
        data: {
            status: Status;
            meta?: Meta;
            error: Error | Record<string, any>;
        }
    };
    actions: Actions
}

export interface ApiResponse<Type> {
    status: Status;
    meta?: Meta;
    pagination?: Pagination;
    data: Type;
    error?: Error | Record<string, any>;
}


