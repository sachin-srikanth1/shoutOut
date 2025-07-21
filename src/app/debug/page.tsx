'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';

export default function DebugPage() {
  const { user, loading, error } = useAuth();
  const [envCheck, setEnvCheck] = useState<any>(null);
  const [supabaseTest, setSupabaseTest] = useState<any>(null);

  useEffect(() => {
    // Check environment variables
    setEnvCheck({
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
    });

    // Test Supabase connection
    fetch('/api/test-supabase-config')
      .then(res => res.json())
      .then(data => setSupabaseTest(data))
      .catch(err => setSupabaseTest({ error: err.message }));
  }, []);

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Debug Information</h1>
        
        {/* Auth Context Status */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Auth Context Status</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
            <p><strong>User:</strong> {user ? user.email : 'null'}</p>
            <p><strong>Error:</strong> {error || 'null'}</p>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <p><strong>SUPABASE_URL:</strong> {envCheck?.url || 'Checking...'}</p>
            <p><strong>SUPABASE_ANON_KEY:</strong> {envCheck?.key || 'Checking...'}</p>
          </div>
        </div>

        {/* Supabase Connection Test */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Supabase Connection Test</h2>
          <div className="space-y-2 text-sm">
            {supabaseTest ? (
              <>
                <p><strong>Success:</strong> {supabaseTest.success ? 'true' : 'false'}</p>
                <p><strong>Message:</strong> {supabaseTest.message || supabaseTest.error}</p>
                <p><strong>Has Session:</strong> {supabaseTest.hasSession ? 'true' : 'false'}</p>
                <p><strong>User Email:</strong> {supabaseTest.userEmail || 'null'}</p>
              </>
            ) : (
              <p>Testing connection...</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
          <div className="space-x-2">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => window.location.href = '/auth/signin'} 
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
            >
              Go to Sign In
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard'} 
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
            >
              Go to Dashboard
            </button>
          </div>
        </div>

        {/* Raw Data */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Raw Data</h2>
          <pre className="text-xs bg-muted p-2 rounded overflow-auto">
            {JSON.stringify({ envCheck, supabaseTest, auth: { loading, user: user?.email, error } }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 