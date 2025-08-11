import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  // Helper function to handle refresh token errors
  const handleAuthError = async (error) => {
    if (error?.message?.includes('refresh_token_not_found') || 
        error?.message?.includes('Invalid Refresh Token') ||
        error?.message?.includes('AuthRetryableFetchError') ||
        error?.message?.includes('refresh_token_expired')) {
      
      console.log('Clearing corrupted session due to refresh token error');
      
      // Clear corrupted session data
      await supabase?.auth?.signOut();
      setUser(null);
      setUserProfile(null);
      
      // Clear all Supabase-related localStorage entries
      try {
        const keysToRemove = Object.keys(localStorage)?.filter(key => 
          key?.includes('supabase') || key?.includes('sb-')
        );
        keysToRemove?.forEach(key => localStorage.removeItem(key));
      } catch (e) {
        console.error('Error clearing localStorage:', e);
      }
      
      return true; // Error handled
    }
    return false; // Error not handled
  };

  // Enhanced session validation
  const validateSession = async () => {
    try {
      const { data: { session }, error } = await supabase?.auth?.getSession();
      
      if (error) {
        const handled = await handleAuthError(error);
        if (!handled) {
          console.error('Session validation error:', error);
          setAuthError('Session validation failed');
        }
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('Session validation failed:', error);
      await handleAuthError(error);
      return null;
    }
  };

  useEffect(() => {
    // Enhanced session initialization with refresh token error handling
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase?.auth?.getSession();
        
        if (error) {
          const handled = await handleAuthError(error);
          if (!handled) {
            if (error?.message?.includes('Failed to fetch') || 
                error?.message?.includes('AuthRetryableFetchError')) {
              setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.');
            } else {
              setAuthError('Failed to initialize authentication');
              console.error('Auth initialization error:', error);
            }
          }
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          setUser(session?.user);
          fetchUserProfile(session?.user?.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await handleAuthError(error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Enhanced auth state change listener
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        // Handle different auth events
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session?.user);
          fetchUserProfile(session?.user?.id);
        } else if (event === 'USER_UPDATED') {
          setUser(session?.user);
        }
        
        setAuthError(null);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const fetchUserProfile = (userId) => {
    setLoading(true)
    supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()?.then(({ data, error }) => {
        if (error) {
          // If user profile doesn't exist, create it
          if (error?.code === 'PGRST116') {
            createUserProfile(userId)
            return
          }
          setAuthError(error?.message)
          setLoading(false)
          return
        }
        setUserProfile(data)
        setLoading(false)
      })?.catch(async (error) => {
        // Check if it's a session-related error
        const handled = await handleAuthError(error);
        if (!handled) {
          if (error?.message?.includes('Failed to fetch')) {
            setAuthError('Cannot connect to database. Your Supabase project may be paused or inactive.')
          } else {
            setAuthError('Failed to load user profile')
            console.error('Profile fetch error:', error)
          }
        }
        setLoading(false)
      })
  }

  const createUserProfile = (userId) => {
    // Get user metadata to create profile
    supabase?.auth?.getUser()?.then(({ data: { user } }) => {
      if (!user) return
      
      const profileData = {
        id: userId,
        email: user?.email,
        full_name: user?.user_metadata?.full_name || user?.email?.split('@')?.[0] || 'User',
        // Ensure empty profile fields for new users
        address: null,
        phone_number: null,
        whatsapp_number: null,
        is_active: true
      }
      
      supabase?.from('user_profiles')?.insert([profileData])?.select()?.single()?.then(({ data, error }) => {
        if (error) {
          setAuthError('Failed to create user profile')
          console.error('Profile creation error:', error)
        } else {
          setUserProfile(data)
        }
        setLoading(false)
      })?.catch(async (error) => {
        const handled = await handleAuthError(error);
        if (!handled) {
          setAuthError('Failed to create user profile')
          console.error('Profile creation error:', error)
        }
        setLoading(false)
      })
    })
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      setAuthError(null)
      
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        const handled = await handleAuthError(error);
        if (!handled) {
          setAuthError(error?.message)
        }
        setLoading(false)
        return { success: false, error: error?.message };
      }
      
      setAuthError(null)
      // Don't set loading false here - let the auth state change handle it
      return { success: true, user: data?.user };
    } catch (error) {
      setLoading(false)
      const handled = await handleAuthError(error);
      if (!handled) {
        if (error?.message?.includes('Failed to fetch') || 
            error?.message?.includes('AuthRetryableFetchError')) {
          const errorMsg = 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.'
          setAuthError(errorMsg)
          return { success: false, error: errorMsg }
        }
        const errorMsg = 'Something went wrong during sign in. Please try again.'
        setAuthError(errorMsg)
        console.error('Sign in error:', error)
        return { success: false, error: errorMsg }
      }
      return { success: false, error: 'Please refresh the page and try logging in again.' }
    }
  }

  const signUp = async (email, password, fullName) => {
    try {
      setLoading(true)
      setAuthError(null)
      
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })
      
      if (error) {
        const handled = await handleAuthError(error);
        if (!handled) {
          setAuthError(error?.message)
        }
        setLoading(false)
        return { success: false, error: error?.message };
      }

      // For successful signup, ensure we have a clean profile
      if (data?.user) {
        setAuthError(null)
        // Set loading to false immediately after successful signup
        setLoading(false)
        
        // Wait a moment for trigger to create profile, then fetch it
        setTimeout(() => {
          fetchUserProfile(data?.user?.id)
        }, 500)
        
        return { success: true, user: data?.user };
      }

      setLoading(false)
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      setLoading(false)
      const handled = await handleAuthError(error);
      if (!handled) {
        if (error?.message?.includes('Failed to fetch') || 
            error?.message?.includes('AuthRetryableFetchError')) {
          const errorMsg = 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.'
          setAuthError(errorMsg)
          return { success: false, error: errorMsg }
        }
        const errorMsg = 'Something went wrong during sign up. Please try again.'
        setAuthError(errorMsg)
        console.error('Sign up error:', error)
        return { success: false, error: errorMsg }
      }
      return { success: false, error: 'Please refresh the page and try again.' }
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase?.auth?.signOut()
      
      // Clear state regardless of error
      setUser(null)
      setUserProfile(null)
      setAuthError(null)
      
      // Clear all Supabase-related localStorage entries
      try {
        const keysToRemove = Object.keys(localStorage)?.filter(key => 
          key?.includes('supabase') || key?.includes('sb-')
        );
        keysToRemove?.forEach(key => localStorage.removeItem(key));
      } catch (e) {
        console.error('Error clearing localStorage on signOut:', e);
      }
      
      if (error) {
        console.error('Sign out error:', error);
        // Don't set auth error for sign out issues, just log them
      }
      
      setLoading(false)
      return { success: true }
    } catch (error) {
      // Clear state even if sign out fails
      setUser(null)
      setUserProfile(null)
      setLoading(false)
      
      console.error('Sign out error:', error)
      return { success: true } // Return success anyway since we cleared the state
    }
  }

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single()
      
      if (error) {
        setAuthError(error?.message)
        return { success: false, error: error?.message };
      }
      
      setUserProfile(data)
      setAuthError(null)
      return { success: true, data }
    } catch (error) {
      const handled = await handleAuthError(error);
      if (!handled) {
        if (error?.message?.includes('Failed to fetch')) {
          const errorMsg = 'Cannot connect to database. Please check your connection.'
          setAuthError(errorMsg)
          return { success: false, error: errorMsg }
        }
        const errorMsg = 'Failed to update profile. Please try again.'
        setAuthError(errorMsg)
        console.error('Profile update error:', error)
        return { success: false, error: errorMsg }
      }
      return { success: false, error: 'Please refresh the page and try again.' }
    }
  }

  const clearError = () => {
    setAuthError(null)
  }

  // Method to manually refresh session if needed
  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase?.auth?.refreshSession();
      if (error) {
        await handleAuthError(error);
        return { success: false, error: error?.message };
      }
      return { success: true, session };
    } catch (error) {
      await handleAuthError(error);
      return { success: false, error: error?.message };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    authError,
    signIn,
    signUp,
    signOut,
    updateProfile,
    clearError,
    refreshSession,
    validateSession
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}