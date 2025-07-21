'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function HomePage() {
  const router = useRouter();
  const { user, loading, error } = useAuth();

  useEffect(() => {
    console.log('HomePage - Auth state:', { loading, user: user?.email, error });
    
    if (!loading) {
      if (error) {
        console.log('Auth error detected:', error);
        // Still try to redirect based on user state, but log the error
        if (user) {
          console.log('User authenticated despite error, redirecting to dashboard');
          router.push('/dashboard');
        } else {
          console.log('User not authenticated, redirecting to signin');
          router.push('/auth/signin');
        }
      } else if (user) {
        console.log('User authenticated, redirecting to dashboard');
        router.push('/dashboard');
      } else {
        console.log('User not authenticated, redirecting to signin');
        router.push('/auth/signin');
      }
    }
  }, [user, loading, error, router]);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.error('Loading timeout reached - forcing navigation to signin');
        router.push('/auth/signin');
      }
    }, 8000); // 8 second timeout

    return () => clearTimeout(timeout);
  }, [loading, router]);

  // Show loading state while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
        <p className="text-xs text-muted-foreground mt-2">
          Loading: {loading ? 'true' : 'false'} | User: {user ? 'yes' : 'no'}
        </p>
        {error && (
          <p className="text-xs text-red-500 mt-2 max-w-md mx-auto">
            Error: {error}
          </p>
        )}
        <div className="mt-4 space-x-2">
          <button 
            onClick={() => router.push('/auth/signin')} 
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Go to Sign In
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}
