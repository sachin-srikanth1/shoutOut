'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { CheckCircle } from 'lucide-react';

export default function CompletedPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-medium text-foreground">Completed Connections</h1>
          </div>
          <p className="text-muted-foreground">View all your successfully completed networking connections</p>
        </div>

        {/* Placeholder for completed connections */}
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No completed connections yet</h3>
          <p className="text-muted-foreground">Connections you complete will appear here for your records.</p>
        </div>
      </div>
    </DashboardLayout>
  );
} 