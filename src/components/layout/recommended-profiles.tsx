'use client';

import Link from 'next/link';
import { User, TrendingUp, Heart } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  role: string;
  company: string;
  matchScore: number;
  mutualConnections: number;
  avatar?: string;
}

interface RecommendedProfilesProps {
  className?: string;
}

export default function RecommendedProfiles({ className = "" }: RecommendedProfilesProps) {
  const profiles: Profile[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Senior Product Manager',
      company: 'TechCorp',
      matchScore: 94,
      mutualConnections: 3
    },
    {
      id: '2',
      name: 'Alex Rodriguez',
      role: 'Data Scientist',
      company: 'InnovateLab',
      matchScore: 87,
      mutualConnections: 2
    },
    {
      id: '3',
      name: 'Emma Thompson',
      role: 'UX Designer',
      company: 'DesignStudio',
      matchScore: 91,
      mutualConnections: 5
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-foreground" />
        <h3 className="text-sm font-medium text-foreground">Recommended Profiles</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <div 
            key={profile.id}
            style={{ border: '1px solid rgba(168, 85, 247, 0.3)' }}
            className="p-4 rounded-lg bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-purple-500 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground truncate">{profile.name}</h4>
                <p className="text-xs text-muted-foreground truncate">{profile.role}</p>
                <p className="text-xs text-muted-foreground truncate">{profile.company}</p>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Heart className="h-3 w-3 text-red-500" />
                <span className="text-xs font-medium text-foreground">{profile.matchScore}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{profile.mutualConnections} mutual connections</span>
              <Link 
                href="/network"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Connect
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 