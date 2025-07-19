'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AuthCodeErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const description = searchParams.get('description');

  const getErrorDetails = () => {
    switch (error) {
      case 'access_denied':
        return {
          title: 'Access Denied',
          message: 'You denied the permission request for Google OAuth.',
          solution: 'Try signing in again and make sure to grant the necessary permissions.'
        };
      case 'redirect_uri_mismatch':
        return {
          title: 'Redirect URI Mismatch',
          message: 'The redirect URI in your OAuth configuration doesn\'t match.',
          solution: 'Check your Google Cloud Console and Supabase OAuth settings.'
        };
      case 'exchange_failed':
        return {
          title: 'Session Exchange Failed',
          message: description || 'Failed to exchange the OAuth code for a session.',
          solution: 'This might be a temporary issue. Try signing in again.'
        };
      case 'no_session':
        return {
          title: 'No Session Created',
          message: 'The OAuth exchange completed but no session was created.',
          solution: 'Try signing in again or contact support if the issue persists.'
        };
      case 'no_code':
        return {
          title: 'No OAuth Code',
          message: 'No authorization code was provided in the callback.',
          solution: 'Try starting the sign-in process again from the beginning.'
        };
      default:
        return {
          title: 'Authentication Error',
          message: description || 'There was an issue with the authentication process.',
          solution: 'Try signing in again or use a different authentication method.'
        };
    }
  };

  const errorInfo = getErrorDetails();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{errorInfo.title}</h1>
          <p className="text-muted-foreground">
            {errorInfo.message}
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg backdrop-blur-sm mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">What happened?</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• {errorInfo.message}</li>
            <li>• The authentication code may have expired</li>
            <li>• There could be a configuration issue</li>
            <li>• Your session may have timed out</li>
          </ul>
        </div>

        {/* Solution */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg backdrop-blur-sm mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">How to fix it</h2>
          <p className="text-sm text-muted-foreground mb-3">
            {errorInfo.solution}
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Try signing in again</li>
            <li>• Clear your browser cache and cookies</li>
            <li>• Use a different browser or incognito mode</li>
            <li>• Try email/password authentication instead</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/auth/signin"
            className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sign In</span>
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-secondary text-secondary-foreground py-3 px-4 rounded-lg font-medium hover:bg-secondary/80 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            If this problem persists, please contact support or try signing in with a different method.
          </p>
        </div>
      </div>
    </div>
  );
} 