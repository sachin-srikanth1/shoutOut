'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { ListChecks } from 'lucide-react';

export default function InProgressPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-medium text-foreground">In-Progress Connections</h1>
          </div>
          <p className="text-muted-foreground">Track your ongoing networking and connection activities</p>
        </div>

        {/* Placeholder for in-progress connections */}
        <div className="text-center py-12">
          <ListChecks className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No in-progress connections yet</h3>
          <p className="text-muted-foreground">Connections you start will appear here as you make progress.</p>
        </div>
      </div>
    </DashboardLayout>
  );
} 