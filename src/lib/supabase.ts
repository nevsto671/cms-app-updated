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
  if (event === 'TOKEN_REFRESHED') {
    if (!session) {
      // Session is invalid after token refresh attempt
      await handleInvalidSession();
      return;
    }
    
    // Verify the session is still valid
    const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !currentSession) {
      await handleInvalidSession();
      return;
    }
  }

  if (event === 'SIGNED_OUT') {
    await handleInvalidSession();
  }
});

// Handle invalid or expired sessions
async function handleInvalidSession() {
  // Clear all auth data
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(`${STORAGE_KEY}-event-queue`);
  
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error during sign out:', error);
  }

  // Only redirect if we're not already on the login page
  if (!window.location.pathname.includes('/login')) {
    // Store the current path to redirect back after login
    const currentPath = window.location.pathname;
    if (currentPath !== '/') {
      window.localStorage.setItem('auth-redirect', currentPath);
    }
    
    window.location.href = '/login';
  }
}

// Intercept Supabase requests to handle 401 errors
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);
    
    // Check if the request was to Supabase and returned 401
    if (
      args[0] instanceof URL || typeof args[0] === 'string' &&
      args[0].includes(supabaseUrl) &&
      response.status === 401
    ) {
      // Try to refresh the session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        await handleInvalidSession();
        return response;
      }
      
      // Retry the original request with the new token
      const newHeaders = new Headers(args[1]?.headers || {});
      newHeaders.set('Authorization', `Bearer ${session.access_token}`);
      
      const newArgs = [...args];
      newArgs[1] = { ...args[1], headers: newHeaders };
      
      return originalFetch(...newArgs);
    }
    
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Clean up on page unload
window.addEventListener('unload', () => {
  window.localStorage.removeItem(`${STORAGE_KEY}-event-queue`);
});