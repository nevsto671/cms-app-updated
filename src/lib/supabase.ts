import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storageKey: 'app-auth',
    storage: window.localStorage,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-v2'
    }
  }
});

// Enhanced session refresh handler
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'TOKEN_REFRESHED' && !session) {
    // If token refresh failed, clear the session
    await supabase.auth.signOut();
    window.location.href = '/login';
  }
});

// Add periodic token refresh check
setInterval(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    const { error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Session refresh failed:', error);
      await supabase.auth.signOut();
      window.location.href = '/login';
    }
  }
}, 5 * 60 * 1000); // Check every 5 minutes