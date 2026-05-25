/**
 * Supabase configuration and mode detection
 * Determines whether to use real Supabase or demo fallback
 */

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
} as const;

/**
 * Check if Supabase is properly configured
 * Returns true only if both URL and anon key are real values (not placeholders)
 */
export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = supabaseConfig;
  return (
    !!url &&
    !!anonKey &&
    url !== 'https://your-project.supabase.co' &&
    anonKey !== 'your-anon-key-here' &&
    url.includes('supabase.co')
  );
}

/**
 * Get the current app mode
 * 'production' = real Supabase backend
 * 'demo' = local mock data fallback
 */
export function getAppMode(): 'production' | 'demo' {
  // Explicit mode override
  const explicitMode = process.env.NEXT_PUBLIC_APP_MODE;
  if (explicitMode === 'production' && isSupabaseConfigured()) {
    return 'production';
  }
  if (explicitMode === 'demo') {
    return 'demo';
  }
  // Auto-detect: if Supabase is configured, use production
  return isSupabaseConfigured() ? 'production' : 'demo';
}

/**
 * Storage bucket names
 */
export const STORAGE_BUCKETS = {
  LISTENING_AUDIO: 'listening-audio',
  WRITING_ASSETS: 'writing-assets',
  SPEAKING_VIDEOS: 'speaking-videos',
  SPEAKING_RECORDINGS: 'speaking-recordings',
  INSTRUCTION_VIDEOS: 'instruction-videos',
  GENERAL_ASSETS: 'general-assets',
} as const;

export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS];
