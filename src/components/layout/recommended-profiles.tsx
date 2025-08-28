'use client';

import { User, Heart } from 'lucide-react';
import Link from 'next/link';

interface RecommendedProfilesProps {
  className?: string;
}

// Mock data for recognition suggestions
const mockSuggestions = [
  {
    id: '1',
    recommended_user: {
      full_name: 'Sarah Johnson',
      first_name: 'Sarah',
      job_title: 'Senior Developer',
      company: 'Engineering Team'
    },
    score: 0.95,
    reason: 'Recently completed a major project milestone',
    recommended_user_id: 'user1'
  },
  {
    id: '2',
    recommended_user: {
      full_name: 'Mike Chen',
      first_name: 'Mike',
      job_title: 'Product Manager',
      company: 'Product Team'
    },
    score: 0.87,
    reason: 'Excellent stakeholder communication this week',
    recommended_user_id: 'user2'
  },
  {
    id: '3',
    recommended_user: {
      full_name: 'Emily Rodriguez',
      first_name: 'Emily',
      job_title: 'UX Designer',
      company: 'Design Team'
    },
    score: 0.82,
    reason: 'Helped onboard 3 new team members',
    recommended_user_id: 'user3'
  }
];

export default function RecommendedProfiles({ className = "" }: RecommendedProfilesProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-foreground" />
        <h3 className="text-sm font-medium text-foreground">Recognition Suggestions</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockSuggestions.map((suggestion) => (
          <div 
            key={suggestion.id}
            style={{ border: '1px solid rgba(168, 85, 247, 0.3)' }}
            className="p-4 rounded-lg bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-purple-500 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground truncate">
                  {suggestion.recommended_user?.full_name || suggestion.recommended_user?.first_name || 'Unknown'}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {suggestion.recommended_user?.job_title || 'No title'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {suggestion.recommended_user?.company || 'No company'}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Heart className="h-3 w-3 text-red-500" />
                <span className="text-xs font-medium text-foreground">
                  {Math.round(suggestion.score * 100)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {suggestion.reason || 'Great work this week'}
              </span>
              <Link 
                href={`/send-shoutout?to=${suggestion.recommended_user_id}`}
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Recognize
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 