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

// Periodic session check and refresh
const SESSION_CHECK_INTERVAL = 4 * 60 * 1000; // 4 minutes
let sessionCheckTimeout: number;

const checkAndRefreshSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      clearTimeout(sessionCheckTimeout);
      window.location.href = '/login';
      return;
    }

    // Check if token expires in less than 5 minutes
    const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : null;
    const now = new Date();
    
    if (expiresAt && (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000)) {
      const { error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Session refresh failed:', error);
        await supabase.auth.signOut();
        window.location.href = '/login';
        return;
      }
    }
  } catch (error) {
    console.error('Session check failed:', error);
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  // Schedule next check
  sessionCheckTimeout = window.setTimeout(checkAndRefreshSession, SESSION_CHECK_INTERVAL);
};

// Start session checking
checkAndRefreshSession();

// Clean up on page unload
window.addEventListener('unload', () => {
  clearTimeout(sessionCheckTimeout);
});