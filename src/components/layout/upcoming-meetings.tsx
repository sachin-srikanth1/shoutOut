'use client';

import { Calendar } from 'lucide-react';

interface UpcomingMeetingsProps {
  className?: string;
}

// Mock data for recognition milestones
const mockMilestones = [
  {
    id: '1',
    title: 'Weekly Recognition Goal',
    type: { slug: 'weekly_goal' },
    start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    location: 'Team Meeting'
  },
  {
    id: '2',
    title: 'Monthly Recognition Review',
    type: { slug: 'monthly_review' },
    start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    location: 'Manager 1:1'
  },
  {
    id: '3',
    title: 'Quarterly Recognition Awards',
    type: { slug: 'quarterly_awards' },
    start_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month from now
    location: 'All-Hands Meeting'
  },
  {
    id: '4',
    title: 'Recognition Training Session',
    type: { slug: 'training' },
    start_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    location: 'Training Room'
  }
];

export default function UpcomingMeetings({ className = "" }: UpcomingMeetingsProps) {
  const getMeetingColor = (typeSlug?: string) => {
    switch (typeSlug) {
      case 'weekly_goal':
        return 'bg-green-500';
      case 'monthly_review':
        return 'bg-blue-500';
      case 'quarterly_awards':
        return 'bg-purple-500';
      case 'training':
        return 'bg-orange-500';
      default:
        return 'bg-muted-foreground';
    }
  };

  const formatMeetingTime = (startTime: string) => {
    const date = new Date(startTime);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    const timeString = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    if (isToday) {
      return `Today ${timeString}`;
    } else if (isTomorrow) {
      return `Tomorrow ${timeString}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-foreground" />
        <h3 className="text-sm font-medium text-foreground">Recognition Milestones</h3>
      </div>
      <div className="space-y-3">
        {mockMilestones.map((milestone) => (
          <div 
            key={milestone.id} 
            style={{ border: '1px solid rgba(168, 85, 247, 0.3)' }}
            className="flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-purple-500 transition-all duration-200"
          >
            <div className={`w-2 h-2 rounded-full ${getMeetingColor(milestone.type?.slug)} flex-shrink-0`}></div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground">{milestone.title}</span>
              {milestone.location && (
                <p className="text-xs text-muted-foreground truncate">{milestone.location}</p>
              )}
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">{formatMeetingTime(milestone.start_time)}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 