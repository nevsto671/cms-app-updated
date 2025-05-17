import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Ensure consistent storage key usage
const STORAGE_KEY = 'app-auth';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storageKey: STORAGE_KEY,
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

// Handle auth state changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'TOKEN_REFRESHED' && !session) {
    // Clear local storage to remove any stale tokens
    window.localStorage.removeItem(STORAGE_KEY);
    await supabase.auth.signOut();
    window.location.href = '/login';
    return;
  }

  if (event === 'SIGNED_OUT') {
    // Clear local storage on sign out
    window.localStorage.removeItem(STORAGE_KEY);
  }
});

// Clean up on page unload
window.addEventListener('unload', () => {
  window.localStorage.removeItem(`${STORAGE_KEY}-event-queue`);
});