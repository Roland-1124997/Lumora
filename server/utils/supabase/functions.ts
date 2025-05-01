import { createClient } from '@supabase/supabase-js';
export { serverSupabaseClient, serverSupabaseUser, serverSupabaseSession, serverSupabaseServiceRole } from '#supabase/server'

const supabase: SupabaseClient = createClient<Database>(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || '',
);

export const useSupaBaseServer = () => supabase


