/**
 * Base Service - Adapter pattern for demo/production mode
 * All module services extend this to get mode detection
 */

import { getAppMode } from '@/lib/supabase/config';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

export type AppMode = 'production' | 'demo';

export abstract class BaseService {
  protected get mode(): AppMode {
    return getAppMode();
  }

  protected get isDemo(): boolean {
    return this.mode === 'demo';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected get supabase(): SupabaseClient<any> | null {
    return getSupabaseBrowserClient() as SupabaseClient<any> | null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected requireSupabase(): SupabaseClient<any> {
    const client = this.supabase;
    if (!client) {
      throw new Error(
        'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
      );
    }
    return client;
  }
}

/**
 * Service result type for consistent error handling
 */
export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export function success<T>(data: T): ServiceResult<T> {
  return { data, error: null, success: true };
}

export function failure<T>(error: string): ServiceResult<T> {
  return { data: null, error, success: false };
}
