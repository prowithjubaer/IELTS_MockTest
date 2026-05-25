/**
 * Supabase Browser Client
 * Used in client components (pages, hooks, components)
 * Uses the anon key - respects RLS policies
 */
'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig, isSupabaseConfigured } from './config';
import type { Database } from '@/types/database';

let supabaseClient: SupabaseClient<Database> | null = null;

/**
 * Get or create the browser Supabase client singleton
 * Returns null if Supabase is not configured (demo mode)
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient<Database>(
      supabaseConfig.url,
      supabaseConfig.anonKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
      }
    );
  }

  return supabaseClient;
}

/**
 * Hook-friendly export
 */
export const supabase = typeof window !== 'undefined' ? getSupabaseBrowserClient() : null;
