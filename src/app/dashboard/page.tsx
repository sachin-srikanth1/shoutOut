'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import SearchBar from '@/components/layout/search-bar';
import NotificationsSection from '@/components/layout/notifications-section';

import UpcomingMeetings from '@/components/layout/upcoming-meetings';

// Typing animation component
function TypingAnimation({ text, speed = 100 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      setIsTypingComplete(true);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={`text-purple-400 transition-opacity duration-1000 ${isTypingComplete ? 'opacity-100' : 'opacity-70'}`}>
      {displayText}
    </span>
  );
}

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const getDisplayName = () => {
    return 'Sachin';
  };

  const renderDashboard = () => (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="space-y-1 animate-fade-in">
        <h1 className="text-2xl font-medium text-foreground bg-gradient-to-r from-foreground via-purple-600 to-foreground bg-clip-text">
          Welcome back, {getDisplayName()}
        </h1>
        <p>
          <TypingAnimation text="Ready to recognize your colleagues?" speed={30} />
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
        <div className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-lg">🎉</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Send ShoutOut</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Recognize a colleague for their great work
          </p>
          <button 
            onClick={() => window.location.href = '/send-shoutout'}
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
          >
            Send Recognition
          </button>
        </div>

        <div className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <span className="text-blue-500 text-lg">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">View Analytics</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            See recognition trends and insights
          </p>
          <button 
            onClick={() => window.location.href = '/analytics'}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            View Insights
          </button>
        </div>

        <div className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <span className="text-green-500 text-lg">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Team Feed</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            See recent team recognition activity
          </p>
          <button 
            onClick={() => window.location.href = '/recognition-feed'}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
          >
            View Feed
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xl font-semibold text-foreground mb-6">Recent Recognition Activity</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <NotificationsSection />
          </div>
          <div>
            <UpcomingMeetings />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="pt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <SearchBar />
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium text-foreground bg-gradient-to-r from-foreground via-purple-600 to-foreground bg-clip-text">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between py-3 p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200">
          <div>
            <p className="text-sm font-medium text-foreground">Account</p>
            <p className="text-xs text-muted-foreground">Profile and security</p>
          </div>
          <button className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
            Edit
          </button>
        </div>

        <div className="flex items-center justify-between py-3 p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200">
          <div>
            <p className="text-sm font-medium text-foreground">Notifications</p>
            <p className="text-xs text-muted-foreground">Alert preferences</p>
          </div>
          <button className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
            Configure
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
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
      <div className="light">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
} 