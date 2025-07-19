'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { TrendingUp, Users, BarChart3, Settings, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading, signOut, onboardingCompleted } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
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

  const getDisplayName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name.split(' ')[0];
    }
    return 'there';
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const renderDashboard = () => (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="space-y-1">
        <h1 className="text-2xl font-medium text-foreground">
          Welcome back, {getDisplayName()}
        </h1>
        <p className="text-muted-foreground">
          Here's your overview
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Active Users</span>
          </div>
          <p className="text-3xl font-semibold text-foreground">1,234</p>
          <p className="text-xs text-green-600 dark:text-green-400">+12% from last month</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Revenue</span>
          </div>
          <p className="text-3xl font-semibold text-foreground">$45.2K</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">+8% from last month</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Satisfaction</span>
          </div>
          <p className="text-3xl font-semibold text-foreground">89%</p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400">+2% from last week</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span className="text-foreground">New user registration</span>
            <span className="text-muted-foreground ml-auto">2m ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span className="text-foreground">Payment processed</span>
            <span className="text-muted-foreground ml-auto">15m ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
            <span className="text-foreground">System maintenance</span>
            <span className="text-muted-foreground ml-auto">1h ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Account</p>
            <p className="text-xs text-muted-foreground">Profile and security</p>
          </div>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            Edit
          </button>
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Notifications</p>
            <p className="text-xs text-muted-foreground">Alert preferences</p>
          </div>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            Configure
          </button>
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Sign Out</p>
            <p className="text-xs text-muted-foreground">End session</p>
          </div>
          <button 
            onClick={handleSignOut}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-2 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return renderDashboard();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <DashboardLayout>
      {renderContent()}
    </DashboardLayout>
  );
} 