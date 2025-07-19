'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/components/theme-provider';
import { 
  Menu, 
  X, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  Globe,
  Moon,
  Sun
} from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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
    return 'User';
  };

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  return (
    <header className={`bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 ${className}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo - Left edge */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-md flex items-center justify-center">
                <Globe className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-base font-semibold text-foreground">Netch</span>
            </Link>
          </div>

          {/* Right side - Notifications, User, Mobile menu - Right edge */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-foreground hover:text-primary bg-muted/50 hover:bg-muted rounded-md transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>

            {/* Notifications */}
            <button className="p-1.5 text-foreground hover:text-primary bg-muted/50 hover:bg-muted rounded-md transition-colors relative">
              <Bell className="h-4 w-4" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-1.5 text-foreground hover:text-primary bg-muted/50 hover:bg-muted rounded-md transition-colors"
              >
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-primary" />
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  {getDisplayName()}
                </span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border/50 rounded-lg shadow-lg z-20">
                    <div className="p-3 border-b border-border/50">
                      <p className="text-sm font-medium text-foreground">{getDisplayName()}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <div className="p-1">
                      <Link
                        href="/settings"
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-foreground hover:text-primary bg-muted/50 hover:bg-muted rounded-md transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 py-3">
            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/network"
                className="block px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Analytics
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 