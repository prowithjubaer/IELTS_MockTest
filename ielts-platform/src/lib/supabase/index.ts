/**
 * Supabase module exports
 */

export { getSupabaseBrowserClient, supabase } from './client';
export { getSupabaseServerClient, getServerUser } from './server';
export { getSupabaseAdminClient } from './admin';
export { 
  supabaseConfig, 
  isSupabaseConfigured, 
  getAppMode, 
  STORAGE_BUCKETS,
  type StorageBucket 
} from './config';
