export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    graphql_public: {
        Tables: {
            [_ in never]: never
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            graphql: {
                Args: {
                    operationName?: string
                    query?: string
                    variables?: Json
                    extensions?: Json
                }
                Returns: Json
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
    public: {
        Tables: {
            deletion_queue: {
                Row: {
                    created_at: string | null
                    id: string
                    thumbnail: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    thumbnail?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    thumbnail?: string | null
                }
                Relationships: []
            }
            group_settings: {
                Row: {
                    auto_accept_new_members: boolean | null
                    created_at: string
                    everyone_can_create_link: boolean | null
                    can_mod_own_pending: boolean | null,
                    group_id: string | null
                    id: string
                    needs_review: boolean | null
                    owner_id: string | null
                    social_interactions: boolean | null
                }
                Insert: {
                    auto_accept_new_members?: boolean | null
                    created_at?: string
                    everyone_can_create_link?: boolean | null
                    can_mod_own_pending: boolean | null,
                    group_id?: string | null
                    id?: string
                    needs_review?: boolean | null
                    owner_id?: string | null
                    social_interactions?: boolean | null
                }
                Update: {
                    auto_accept_new_members?: boolean | null
                    can_mod_own_pending: boolean | null,
                    created_at?: string
                    everyone_can_create_link?: boolean | null
                    group_id?: string | null
                    id?: string
                    needs_review?: boolean | null
                    owner_id?: string | null
                    social_interactions?: boolean | null
                }
                Relationships: [
                    {
                        foreignKeyName: "group_settings_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: false
                        referencedRelation: "groups"
                        referencedColumns: ["id"]
                    },
                ]
            }
            groups: {
                Row: {
                    description: string | null
                    id: string
                    last_action: string | null
                    last_active: string | null
                    last_photo_posted_by: string | null
                    name: string | null
                    owner_id: string | null
                    thumbnail: string | null
                }
                Insert: {
                    description?: string | null
                    id?: string
                    last_action?: string | null
                    last_active?: string | null
                    last_photo_posted_by?: string | null
                    name?: string | null
                    owner_id?: string | null
                    thumbnail?: string | null
                }
                Update: {
                    description?: string | null
                    id?: string
                    last_action?: string | null
                    last_active?: string | null
                    last_photo_posted_by?: string | null
                    name?: string | null
                    owner_id?: string | null
                    thumbnail?: string | null
                }
                Relationships: []
            }
            invite_links: {
                Row: {
                    code: string | null
                    created_at: string
                    expiresAt: string | null
                    group_id: string | null
                    id: string
                    user_id: string | null
                    uses: number | null
                }
                Insert: {
                    code?: string | null
                    created_at?: string
                    expiresAt?: string | null
                    group_id?: string | null
                    id?: string
                    user_id?: string | null
                    uses?: number | null
                }
                Update: {
                    code?: string | null
                    created_at?: string
                    expiresAt?: string | null
                    group_id?: string | null
                    id?: string
                    user_id?: string | null
                    uses?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "invite_links_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: false
                        referencedRelation: "groups"
                        referencedColumns: ["id"]
                    },
                ]
            }
            liked_posts: {
                Row: {
                    id: string
                    post_id: string
                    user_id: string
                }
                Insert: {
                    id?: string
                    post_id: string
                    user_id: string
                }
                Update: {
                    id?: string
                    post_id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "liked_posts_post_id_fkey"
                        columns: ["post_id"]
                        isOneToOne: false
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    },
                ]
            }
            logbook: {
                Row: {
                    action_type: string
                    context: Json | null
                    group_id: string
                    id: string
                    message: string | null
                    performed_by_id: string
                    target_user_id: string | null
                    timestamp: string
                }
                Insert: {
                    action_type: string
                    context?: Json | null
                    group_id: string
                    id?: string
                    message?: string | null
                    performed_by_id: string
                    target_user_id?: string | null
                    timestamp?: string
                }
                Update: {
                    action_type?: string
                    context?: Json | null
                    group_id?: string
                    id?: string
                    message?: string | null
                    performed_by_id?: string
                    target_user_id?: string | null
                    timestamp?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "logbook_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: false
                        referencedRelation: "groups"
                        referencedColumns: ["id"]
                    },
                ]
            }
            members: {
                Row: {
                    accepted: boolean | null
                    can_delete_group: boolean | null
                    can_delete_messages_all: boolean | null
                    can_edit_group: boolean | null
                    group_id: string | null
                    id: string
                    user_id: string | null
                }
                Insert: {
                    accepted?: boolean | null
                    can_delete_group?: boolean | null
                    can_delete_messages_all?: boolean | null
                    can_edit_group?: boolean | null
                    group_id?: string | null
                    id?: string
                    user_id?: string | null
                }
                Update: {
                    accepted?: boolean | null
                    can_delete_group?: boolean | null
                    can_delete_messages_all?: boolean | null
                    can_edit_group?: boolean | null
                    group_id?: string | null
                    id?: string
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "members_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: false
                        referencedRelation: "groups"
                        referencedColumns: ["id"]
                    },
                ]
            }
            posts: {
                Row: {
                    Accepted: boolean | null
                    accepted_at: string | null
                    author_id: string | null
                    created_at: string | null
                    group_id: string | null
                    id: string
                    likes: number | null
                    updated_at: string | null
                    url: string
                    user_left: boolean | null
                }
                Insert: {
                    Accepted?: boolean | null
                    accepted_at?: string | null
                    author_id?: string | null
                    created_at?: string | null
                    group_id?: string | null
                    id?: string
                    likes?: number | null
                    updated_at?: string | null
                    url: string
                    user_left?: boolean | null
                }
                Update: {
                    Accepted?: boolean | null
                    accepted_at?: string | null
                    author_id?: string | null
                    created_at?: string | null
                    group_id?: string | null
                    id?: string
                    likes?: number | null
                    updated_at?: string | null
                    url?: string
                    user_left?: boolean | null
                }
                Relationships: [
                    {
                        foreignKeyName: "posts_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: false
                        referencedRelation: "groups"
                        referencedColumns: ["id"]
                    },
                ]
            }
            posts_comments: {
                Row: {
                    author_id: string | null
                    content: string | null
                    created_at: string
                    group_id: string | null
                    id: string
                    post_id: string | null
                }
                Insert: {
                    author_id?: string | null
                    content?: string | null
                    created_at?: string
                    group_id?: string | null
                    id?: string
                    post_id?: string | null
                }
                Update: {
                    author_id?: string | null
                    content?: string | null
                    created_at?: string
                    group_id?: string | null
                    id?: string
                    post_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "posts_comments_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: false
                        referencedRelation: "groups"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "posts_comments_post_id_fkey"
                        columns: ["post_id"]
                        isOneToOne: false
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    },
                ]
            }
            user_group_visits: {
                Row: {
                    group_id: string | null
                    id: string
                    user_id: string | null
                    visited_at: string | null
                }
                Insert: {
                    group_id?: string | null
                    id?: string
                    user_id?: string | null
                    visited_at?: string | null
                }
                Update: {
                    group_id?: string | null
                    id?: string
                    user_id?: string | null
                    visited_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "user_group_visits_group_id_fkey"
                        columns: ["group_id"]
                        isOneToOne: false
                        referencedRelation: "groups"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            accept_post: {
                Args: { p_id: string }
                Returns: undefined
            }
            get_group_with_posts: {
                Args: {
                    group_id_param: string
                    limit_param: number
                    page_param: number
                    user_id_param: string
                    include_accepted_param: boolean
                }
                Returns: {
                    group_id: string
                    name: string
                    thumbnail: string
                    last_active: string
                    last_photo_posted_by: string
                    owner_id: string
                    description: string
                    total_count: number
                    posts: Json
                }[]
            }
            get_nearest_posts: {
                Args: {
                    target_post_id: string
                    target_created_at: string
                    target_group_id: string
                    target_author_id: string
                    limit_posts?: number
                }
                Returns: {
                    post_data: Json
                }[]
            }
            should_show_group_notification: {
                Args: { p_user_id: string; p_group_id: string }
                Returns: boolean
            }
            toggle_like: {
                Args: { liked_post_id: string; liked_user_id: string }
                Returns: {
                    likes_count: number
                    is_liked: boolean
                }[]
            }
            upsert_user_group_visit: {
                Args: { p_user_id: string; p_group_id: string; p_visited_at?: string }
                Returns: undefined
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    graphql_public: {
        Enums: {},
    },
    public: {
        Enums: {},
    },
} as const
