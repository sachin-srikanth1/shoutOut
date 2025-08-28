'use client';

import { Bell } from 'lucide-react';

interface NotificationsSectionProps {
  className?: string;
}

// Mock data for recognition notifications
const mockNotifications = [
  {
    id: '1',
    title: 'ShoutOut Received',
    message: 'Sarah Johnson recognized you for your excellent presentation skills',
    type: { slug: 'recognition_received' },
    is_read: false,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
  },
  {
    id: '2',
    title: 'ShoutOut Sent',
    message: 'You recognized Mike Chen for his teamwork on the project',
    type: { slug: 'recognition_sent' },
    is_read: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    id: '3',
    title: 'Team Recognition',
    message: 'Emily Rodriguez was recognized by 3 team members this week',
    type: { slug: 'team_recognition' },
    is_read: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: '4',
    title: 'Weekly Summary',
    message: 'Your team sent 12 shoutouts this week - great engagement!',
    type: { slug: 'weekly_summary' },
    is_read: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  }
];

export default function NotificationsSection({ className = "" }: NotificationsSectionProps) {
  const getNotificationColor = (typeSlug: string) => {
    switch (typeSlug) {
      case 'recognition_received':
        return 'bg-green-500';
      case 'recognition_sent':
        return 'bg-blue-500';
      case 'team_recognition':
        return 'bg-purple-500';
      case 'weekly_summary':
        return 'bg-orange-500';
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

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-foreground" />
        <h3 className="text-sm font-medium text-foreground">Recognition Activity</h3>
      </div>
      <div className="space-y-3">
        {mockNotifications.map((notification) => (
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