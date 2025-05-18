import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Ensure consistent storage key usage
const STORAGE_KEY = 'sb-auth';

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
  if (event === 'SIGNED_IN') {
    // Store the session
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
    await handleSignOut();
  } else if (event === 'TOKEN_REFRESHED') {
    if (!session) {
      await handleSignOut();
      return;
    }
    
    // Verify the session is still valid
    const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !currentSession) {
      await handleSignOut();
      return;
    }
    
    // Update stored session
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSession));
  }
});

// Handle sign out and cleanup
async function handleSignOut() {
  // Clear all auth data first
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(`${STORAGE_KEY}-event-queue`);
  window.localStorage.removeItem(`${STORAGE_KEY}-token`);
  
  try {
    // Check if we have a session before attempting to sign out
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      await supabase.auth.signOut();
    }
  } catch (error) {
    console.warn('Error during sign out:', error);
    // Continue with redirect even if server signout fails
  }

  // Only redirect if we're not already on the login page
  if (!window.location.pathname.includes('/login')) {
    // Store the current path to redirect back after login
    const currentPath = window.location.pathname;
    if (currentPath !== '/') {
      window.sessionStorage.setItem('auth-redirect', currentPath);
    }
    
    window.location.href = '/login';
  }
}

// Initialize auth state
async function initializeAuth() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session error:', error);
      await handleSignOut();
      return;
    }
    
    if (!session) {
      // No session, redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return;
    }
    
    // Valid session exists, store it
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    
    // Check for redirect path
    const redirectPath = window.sessionStorage.getItem('auth-redirect');
    if (redirectPath) {
      window.sessionStorage.removeItem('auth-redirect');
      window.location.href = redirectPath;
    }
  } catch (error) {
    console.error('Auth initialization error:', error);
    await handleSignOut();
  }
}

// Initialize auth on load
initializeAuth();

// Clean up on page unload
window.addEventListener('unload', () => {
  window.localStorage.removeItem(`${STORAGE_KEY}-event-queue`);
});

export default supabase;