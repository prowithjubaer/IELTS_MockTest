/**
 * Supabase Admin Client (Service Role)
 * ONLY use in server-side code (API routes, server actions)
 * Bypasses RLS - use carefully
 * 
 * Use cases:
 * - Auto-scoring (reading answer keys without RLS restrictions)
 * - Admin operations from API routes
 * - Creating user profiles after auth signup
 * - Background jobs
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig, isSupabaseConfigured } from './config';
import type { Database } from '@/types/database';

let adminClient: SupabaseClient<Database> | null = null;

/**
 * Get the admin (service role) Supabase client
 * Returns null if not configured or service role key is missing
 * WARNING: This bypasses RLS - only use server-side
 */
export function getSupabaseAdminClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured() || !supabaseConfig.serviceRoleKey) {
    return null;
  }

  if (!adminClient) {
    adminClient = createClient<Database>(
      supabaseConfig.url,
      supabaseConfig.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  return adminClient;
}
