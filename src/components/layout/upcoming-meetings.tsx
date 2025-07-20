'use client';

import { Calendar } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  time: string;
  type: 'interview' | 'networking' | 'mentorship' | 'coffee';
}

interface UpcomingMeetingsProps {
  className?: string;
}

export default function UpcomingMeetings({ className = "" }: UpcomingMeetingsProps) {
  const meetings: Meeting[] = [
    {
      id: '1',
      title: 'Interview with TechCorp',
      time: '2:30 PM',
      type: 'interview'
    },
    {
      id: '2',
      title: 'Networking Coffee',
      time: '4:00 PM',
      type: 'coffee'
    },
    {
      id: '3',
      title: 'Mentorship Session',
      time: 'Tomorrow 10 AM',
      type: 'mentorship'
    }
  ];

  const getMeetingColor = (type: Meeting['type']) => {
    switch (type) {
      case 'interview':
        return 'bg-blue-500';
      case 'networking':
        return 'bg-green-500';
      case 'mentorship':
        return 'bg-purple-500';
      case 'coffee':
        return 'bg-orange-500';
      default:
        return 'bg-muted-foreground';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-foreground" />
        <h3 className="text-sm font-medium text-foreground">Upcoming Meetings</h3>
      </div>
      <div className="space-y-3">
        {meetings.map((meeting, index) => (
          <div 
            key={meeting.id} 
            style={{ border: '1px solid rgba(168, 85, 247, 0.3)' }}
            className={`flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-purple-500 transition-all duration-200 ${index === 0 ? 'animate-bounce-subtle' : ''}`}
          >
            <div className={`w-2 h-2 rounded-full ${getMeetingColor(meeting.type)} flex-shrink-0`}></div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground">{meeting.title}</span>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">{meeting.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 