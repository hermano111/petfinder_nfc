import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Enhanced storage adapter for better session persistence
    storage: {
      getItem: (key) => {
        try {
          return window?.localStorage?.getItem(key) || null;
        } catch {
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          window?.localStorage?.setItem(key, value);
        } catch {
          // Fail silently in environments without localStorage
        }
      },
      removeItem: (key) => {
        try {
          window?.localStorage?.removeItem(key);
        } catch {
          // Fail silently
        }
      }
    }
  }
});

// Global error handler for Supabase auth errors
supabase?.auth?.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' && !session) {
    // Clear any remaining auth-related localStorage on sign out
    try {
      const keysToRemove = Object.keys(localStorage)?.filter(key => 
        key?.includes('supabase') || key?.includes('sb-')
      );
      keysToRemove?.forEach(key => localStorage.removeItem(key));
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  }
});