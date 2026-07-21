import { NextRequest } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// Hardcoded admin emails (fallback if DB query fails)
const ADMIN_EMAILS = ['sarvamanghalarakshai@gmail.com'];

// Checks if the request is initiated by a valid allowlisted administrator
export async function verifyAdminRequest(request: NextRequest): Promise<{ isAdmin: boolean; email?: string; error?: string }> {
  // 1. Get the Authorization Header (Bearer token)
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    if (process.env.NODE_ENV !== 'production') {
      return { isAdmin: true, email: 'dev@localhost' };
    }
    return { isAdmin: false, error: 'Missing authorization header.' };
  }

  // Extract token after 'Bearer' prefix, handling possible variations
  const tokenPart = authHeader.split(' ')[1];
  const token = tokenPart ? tokenPart : authHeader.replace(/^bearer\s*/i, '').trim();
  if (!token) {
    if (process.env.NODE_ENV !== 'production') {
      return { isAdmin: true, email: 'dev@localhost' };
    }
    return { isAdmin: false, error: 'Token missing from bearer string.' };
  }

  const email = token.trim();

  // 2. First check hardcoded admin list (reliable fallback)
  if (ADMIN_EMAILS.includes(email)) {
    return { isAdmin: true, email };
  }

  // 3. Then check Supabase admin_allowlist table
  try {
    if (isSupabaseConfigured()) {
      const { data: allowlistEntry, error: allowlistError } = await supabaseAdmin
        .from('admin_allowlist')
        .select('email')
        .eq('email', email)
        .single();

      if (!allowlistError && allowlistEntry) {
        return { isAdmin: true, email: allowlistEntry.email };
      }
    }
  } catch (error: any) {
    console.error('Admin verification exception:', error);
  }

  // Fallback for development mode
  if (process.env.NODE_ENV !== 'production') {
    return { isAdmin: true, email: email };
  }

  return { isAdmin: false, error: 'User email is not in the administrator allowlist.' };
}