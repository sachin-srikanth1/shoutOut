'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, userData: { firstName: string; lastName: string }) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabase] = useState(() => createClient());

  // Helper function to get the correct redirect URL for localhost
  const getRedirectUrl = () => {
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const protocol = isLocalhost ? 'http' : 'https';
    return `${protocol}://${window.location.host}/auth/callback`;
  };

  useEffect(() => {
    let mounted = true;

    // Quick timeout to prevent hanging
    const quickTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.log('Quick timeout - setting loading to false');
        setLoading(false);
        setError('Authentication timeout - please try again');
      }
    }, 3000); // 3 second timeout

    // Get initial session with timeout
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        
        // Check environment variables quickly
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.error('Missing Supabase environment variables');
          if (mounted) {
            setError('Missing Supabase configuration');
            setLoading(false);
          }
          return;
        }

        // Use Promise.race to add a timeout to the session call
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 2000)
        );

        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (mounted) {
            setError(error.message);
            setLoading(false);
          }
        } else {
          console.log('Initial session:', session ? 'Found' : 'None', session?.user?.email);
          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
            setError(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setError('Failed to initialize authentication');
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes with timeout
    let subscription: any;
    try {
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state change:', event, session?.user?.email || 'No user');
          
          if (!mounted) return;
          
          // Handle undefined session gracefully
          if (session === undefined) {
            console.log('Session is undefined, treating as no session');
            setSession(null);
            setUser(null);
            setError(null);
            setLoading(false);
            return;
          }
          
          setSession(session);
          setUser(session?.user ?? null);
          setError(null);
          setLoading(false);
        }
      );
      subscription = sub;
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      if (mounted) {
        setError('Failed to set up authentication listener');
        setLoading(false);
      }
    }

    return () => {
      mounted = false;
      clearTimeout(quickTimeout);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [supabase.auth]);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
        return { error };
      } else {
        return { error: null };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setError(errorMessage);
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string, userData: { firstName: string; lastName: string }) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            full_name: `${userData.firstName} ${userData.lastName}`,
          },
          emailRedirectTo: getRedirectUrl(),
        },
      });
      
      if (error) {
        setError(error.message);
        return { error };
      }

      // Manually create user profile if user was created successfully
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              first_name: userData.firstName,
              last_name: userData.lastName,
              full_name: `${userData.firstName} ${userData.lastName}`,
            });

          if (profileError) {
            console.warn('Failed to create user profile:', profileError);
          }
        } catch (profileError) {
          console.warn('Error creating user profile:', profileError);
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      setError(errorMessage);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      setError(errorMessage);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      console.log('Starting Google OAuth...');
      const redirectUrl = getRedirectUrl();
      console.log('Redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        console.error('Google OAuth error:', error);
        setError(error.message);
        return { error };
      } else {
        console.log('Google OAuth initiated successfully:', data);
        return { error: null };
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Google sign in failed';
      setError(errorMessage);
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getRedirectUrl().replace('/auth/callback', '/auth/reset-password'),
      });
      
      if (error) {
        setError(error.message);
        return { error };
      } else {
        return { error: null };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Reset password failed';
      setError(errorMessage);
      return { error: error as AuthError };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      
      if (error) {
        setError(error.message);
        return { error };
      } else {
        return { error: null };
      }
    } catch (error) {
      console.error('Update password error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Update password failed';
      setError(errorMessage);
      return { error: error as AuthError };
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 