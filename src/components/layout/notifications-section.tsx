'use client';

import { Bell } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface NotificationsSectionProps {
  className?: string;
}

export default function NotificationsSection({ className = "" }: NotificationsSectionProps) {
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'New user registration',
      time: '2m ago',
      type: 'success'
    },
    {
      id: '2',
      title: 'Payment processed',
      time: '15m ago',
      type: 'success'
    },
    {
      id: '3',
      title: 'System maintenance',
      time: '1h ago',
      type: 'warning'
    }
  ];

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-muted-foreground';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-foreground" />
        <h3 className="text-sm font-medium text-foreground">Important Notifications</h3>
      </div>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            style={{ border: '1px solid rgba(168, 85, 247, 0.3)' }}
            className="flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-purple-500 transition-all duration-200"
          >
            <div className={`w-2 h-2 rounded-full ${getNotificationColor(notification.type)} flex-shrink-0`}></div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground">{notification.title}</span>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">{notification.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 