'use client';

import { Bell, Send, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NotificationsSectionProps {
  className?: string;
}

interface Shoutout {
  id: string;
  type: 'sent' | 'received';
  recipient?: string;
  sender?: string;
  message: string;
  category: string;
  date: string;
  isPublic: boolean;
}

export default function NotificationsSection({ className = "" }: NotificationsSectionProps) {
  const [shoutouts, setShoutouts] = useState<Shoutout[]>([]);

  // Load shoutouts from localStorage on component mount
  useEffect(() => {
    const savedShoutouts = localStorage.getItem('shoutouts');
    if (savedShoutouts) {
      setShoutouts(JSON.parse(savedShoutouts));
    }
  }, []);

  // Get the 5 most recent shoutouts
  const recentShoutouts = shoutouts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getNotificationColor = (type: 'sent' | 'received') => {
    switch (type) {
      case 'received':
        return 'bg-green-500';
      case 'sent':
        return 'bg-blue-500';
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
        {recentShoutouts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No recent shoutouts yet</p>
            <p className="text-xs text-muted-foreground">Send your first shoutout to see it here!</p>
          </div>
        ) : (
          recentShoutouts.map((shoutout) => (
            <div 
              key={shoutout.id} 
              style={{ border: '1px solid rgba(168, 85, 247, 0.3)' }}
              className="flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-purple-500 transition-all duration-200"
            >
              <div className={`w-2 h-2 rounded-full ${getNotificationColor(shoutout.type)} flex-shrink-0`}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {shoutout.type === 'sent' ? (
                    <Send className="h-3 w-3 text-blue-500" />
                  ) : (
                    <Heart className="h-3 w-3 text-green-500" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {shoutout.type === 'sent' ? 'Sent to' : 'Received from'} {shoutout.type === 'sent' ? shoutout.recipient : shoutout.sender}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{shoutout.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary`}>
                    {shoutout.category}
                  </span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">{formatTimeAgo(shoutout.date)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 