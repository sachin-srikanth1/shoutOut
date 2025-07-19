'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function HomePage() {
  const router = useRouter();
  const { user, loading, onboardingCompleted } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, check if onboarding is completed
        if (onboardingCompleted) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      } else {
        // User is not authenticated, redirect to sign in
        router.push('/auth/signin');
      }
    }
  }, [user, loading, onboardingCompleted, router]);

  // Show loading state while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
