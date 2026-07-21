import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseServiceRoleKey;
};

// Create a Supabase client using the service role key (for server-side bypass of RLS)
export const supabaseAdmin = (() => {
  // Server‑side guard – never initialise on the browser
  if (typeof window !== 'undefined') {
    // Return a dummy client; it should never be used client‑side
    return {} as ReturnType<typeof createClient>;
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
      );
    }
    console.warn('WARNING: Supabase variables not set. Using mock Supabase client for local development.');
    return {} as ReturnType<typeof createClient>;
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
})();

export const supabaseBrowser = (() => {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
      );
    }
    console.warn(
      'WARNING: Supabase variables not set. Using mock Supabase client for local development.'
    );
    return {} as ReturnType<typeof createClient>;
  }
  return createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
})();
