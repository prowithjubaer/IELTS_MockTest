/**
 * Auth Callback Route
 * Handles Supabase auth redirects (email verification, password reset, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabaseConfig } from '@/lib/supabase/config';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code && isSupabaseConfigured()) {
    const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to home page after auth
  return NextResponse.redirect(new URL('/', request.url));
}
