'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { TrendingUp, Users, BarChart3, Activity, Calendar, Settings, Download, Filter } from 'lucide-react';

export default function AnalyticsPage() {
  const { user, loading, onboardingCompleted } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !onboardingCompleted) {
      router.push('/onboarding');
    }
  }, [user, loading, onboardingCompleted, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/10">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/10">
        <div className="text-center space-y-3">
          <h1 className="text-xl font-medium text-foreground">Access Denied</h1>
          <p className="text-sm text-muted-foreground">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-medium text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Track your performance and insights
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border/50 rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">+15.3%</p>
              <p className="text-sm text-muted-foreground">Growth Rate</p>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">vs last month</p>
          </div>

          <div className="bg-card border border-border/50 rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">2,847</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">+234 this week</p>
          </div>

          <div className="bg-card border border-border/50 rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">92.4%</p>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">+1.2% improvement</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border/50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Recent Analytics</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-foreground">New user signup completed</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-foreground">Monthly report generated</p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-foreground">Data export completed</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-foreground">Analytics dashboard updated</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border/50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center gap-3 p-3 text-left text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors">
              <Download className="h-5 w-5" />
              <span className="text-sm font-medium">Export Data</span>
            </button>
            <button className="flex items-center gap-3 p-3 text-left text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors">
              <Filter className="h-5 w-5" />
              <span className="text-sm font-medium">Filter Results</span>
            </button>
            <button className="flex items-center gap-3 p-3 text-left text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors">
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium">Schedule Report</span>
            </button>
            <button className="flex items-center gap-3 p-3 text-left text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors">
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">Analytics Settings</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 