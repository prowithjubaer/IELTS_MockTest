/**
 * Legacy export - re-exports from new modular setup
 * Kept for backward compatibility
 */
export { supabase, getSupabaseBrowserClient } from './supabase/client';
export { getSupabaseAdminClient } from './supabase/admin';
export { isSupabaseConfigured, getAppMode } from './supabase/config';
