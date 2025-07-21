'use client';

import { useEffect, useState } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { databaseService, Meeting } from '@/services/database-service';

interface UpcomingMeetingsProps {
  className?: string;
}

export default function UpcomingMeetings({ className = "" }: UpcomingMeetingsProps) {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUpcomingMeetings = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await databaseService.getUpcomingMeetings(user.id, 5);
        
        if (response.success && response.data) {
          setMeetings(response.data);
        } else {
          setError(response.error || 'Failed to load meetings');
        }
      } catch (err) {
        console.error('Error loading upcoming meetings:', err);
        setError('Failed to load meetings');
      } finally {
        setLoading(false);
      }
    };

    loadUpcomingMeetings();
  }, [user?.id]);

  const getMeetingColor = (typeSlug?: string) => {
    switch (typeSlug) {
      case 'interview':
        return 'bg-red-500';
      case 'team_meeting':
        return 'bg-green-500';
      case 'client_call':
        return 'bg-orange-500';
      case 'one_on_one':
        return 'bg-blue-500';
      case 'workshop':
        return 'bg-purple-500';
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

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-foreground" />
          <h3 className="text-sm font-medium text-foreground">Upcoming Meetings</h3>
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
          <Calendar className="h-4 w-4 text-foreground" />
          <h3 className="text-sm font-medium text-foreground">Upcoming Meetings</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-foreground" />
          <h3 className="text-sm font-medium text-foreground">Upcoming Meetings</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">No upcoming meetings</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-foreground" />
        <h3 className="text-sm font-medium text-foreground">Upcoming Meetings</h3>
      </div>
      <div className="space-y-3">
        {meetings.map((meeting) => (
          <div 
            key={meeting.id} 
            style={{ border: '1px solid rgba(168, 85, 247, 0.3)' }}
            className="flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-purple-500 transition-all duration-200"
          >
            <div className={`w-2 h-2 rounded-full ${getMeetingColor(meeting.type?.slug)} flex-shrink-0`}></div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground">{meeting.title}</span>
              {meeting.location && (
                <p className="text-xs text-muted-foreground truncate">{meeting.location}</p>
              )}
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">{formatMeetingTime(meeting.start_time)}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 