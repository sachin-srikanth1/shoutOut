'use client';

export default function DebugPage() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Debug Information</h1>
        
        {/* System Status */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">System Status</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Authentication:</strong> Disabled</p>
            <p><strong>Database:</strong> Removed</p>
            <p><strong>Status:</strong> Running without auth</p>
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
            {JSON.stringify({ 
              auth: 'disabled', 
              database: 'removed',
              status: 'running_without_auth'
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 