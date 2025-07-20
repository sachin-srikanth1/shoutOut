'use client';

import { ReactNode, useState } from 'react';
import Header from './header';
import Sidebar from './sidebar';
import { Menu, X } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/5">
      <Header />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:block" />
        
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className={`
          fixed top-12 left-0 z-50 h-full bg-card/95 backdrop-blur-sm border-r border-border/50 transition-all duration-300 lg:hidden
          ${isMobileSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            {/* Mobile sidebar header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h2 className="text-lg font-medium text-foreground">Navigation</h2>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Mobile navigation */}
            <nav className="flex-1 p-4 space-y-2">
              <a
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <div className="w-4 h-4 bg-primary/10 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded"></div>
                </div>
                <span>Dashboard</span>
              </a>
              <a
                href="/recommended"
                className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded"></div>
                </div>
                <span>Network</span>
              </a>
              <a
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded"></div>
                </div>
                <span>Settings</span>
              </a>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile sidebar toggle button - floating */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className="fixed bottom-4 left-4 lg:hidden p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors z-30"
      >
        <Menu className="h-5 w-5" />
      </button>
    </div>
  );
} 