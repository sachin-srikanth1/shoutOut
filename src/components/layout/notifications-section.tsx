'use client';

import { useEffect, useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { databaseService, UserNotification } from '@/services/database-service';

interface NotificationsSectionProps {
  className?: string;
}

export default function NotificationsSection({ className = "" }: NotificationsSectionProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await databaseService.getNotifications(user.id, 5);
        
        if (response.success && response.data) {
          setNotifications(response.data);
        } else {
          setError(response.error || 'Failed to load notifications');
        }
      } catch (err) {
        console.error('Error loading notifications:', err);
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user?.id]);

  const getNotificationColor = (typeSlug: string) => {
    switch (typeSlug) {
      case 'connection_request':
        return 'bg-blue-500';
      case 'meeting_invitation':
        return 'bg-purple-500';
      case 'task_assignment':
        return 'bg-orange-500';
      case 'project_update':
        return 'bg-green-500';
      case 'profile_view':
        return 'bg-gray-500';
      default:
        return 'bg-muted-foreground';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-foreground" />
          <h3 className="text-sm font-medium text-foreground">Notifications</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-foreground" />
          <h3 className="text-sm font-medium text-foreground">Notifications</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-foreground" />
          <h3 className="text-sm font-medium text-foreground">Notifications</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">No notifications</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-foreground" />
        <h3 className="text-sm font-medium text-foreground">Notifications</h3>
      </div>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            style={{ border: '1px solid rgba(168, 85, 247, 0.3)' }}
            className={`flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-purple-500 transition-all duration-200 ${!notification.is_read ? 'border-l-4 border-l-primary' : ''}`}
          >
            <div className={`w-2 h-2 rounded-full ${getNotificationColor(notification.type?.slug || 'default')} flex-shrink-0`}></div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground">{notification.title}</span>
              <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">{formatTimeAgo(notification.created_at)}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 