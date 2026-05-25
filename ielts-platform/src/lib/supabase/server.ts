/**
 * Supabase Server Client
 * Used in Server Components, Server Actions, Route Handlers
 * Creates a new client per request for proper auth context
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { supabaseConfig, isSupabaseConfigured } from './config';
import type { Database } from '@/types/database';

/**
 * Create a Supabase server client that reads auth from cookies
 * Returns null if Supabase is not configured (demo mode)
 */
export async function getSupabaseServerClient(): Promise<SupabaseClient<Database> | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const cookieStore = await cookies();
  
  const client = createClient<Database>(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          cookie: cookieStore.getAll()
            .map(c => `${c.name}=${c.value}`)
            .join('; '),
        },
      },
    }
  );

  return client;
}

/**
 * Get the current authenticated user from server context
 * Returns null if not authenticated or in demo mode
 */
export async function getServerUser() {
  const client = await getSupabaseServerClient();
  if (!client) return null;

  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return null;
  
  return user;
}
