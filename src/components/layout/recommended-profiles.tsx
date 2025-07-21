'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, TrendingUp, Heart, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { databaseService, RecommendedProfile } from '@/services/database-service';

interface RecommendedProfilesProps {
  className?: string;
}

export default function RecommendedProfiles({ className = "" }: RecommendedProfilesProps) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<RecommendedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommendedProfiles = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await databaseService.getRecommendedProfiles(user.id, 6);
        
        if (response.success && response.data) {
          setProfiles(response.data);
        } else {
          setError(response.error || 'Failed to load recommendations');
        }
      } catch (err) {
        console.error('Error loading recommended profiles:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendedProfiles();
  }, [user?.id]);

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-foreground" />
          <h3 className="text-sm font-medium text-foreground">Recommended Profiles</h3>
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
          <User className="h-4 w-4 text-foreground" />
          <h3 className="text-sm font-medium text-foreground">Recommended Profiles</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-foreground" />
          <h3 className="text-sm font-medium text-foreground">Recommended Profiles</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">No recommendations yet</p>
        </div>
      </div>
    );
  }

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
                <h4 className="text-sm font-semibold text-foreground truncate">
                  {profile.recommended_user?.full_name || profile.recommended_user?.first_name || 'Unknown'}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {profile.recommended_user?.job_title || 'No title'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile.recommended_user?.company || 'No company'}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Heart className="h-3 w-3 text-red-500" />
                <span className="text-xs font-medium text-foreground">
                  {Math.round(profile.score * 100)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {profile.reason || 'Recommended for you'}
              </span>
              <Link 
                href={`/profile/${profile.recommended_user_id}`}
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