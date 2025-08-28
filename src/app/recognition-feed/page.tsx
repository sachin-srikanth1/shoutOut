'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { MessageSquare, Heart, Users, Calendar } from 'lucide-react';

export default function RecognitionFeedPage() {
  // Mock data for recognition feed
  const mockFeed = [
    {
      id: '1',
      sender: 'Sarah Johnson',
      senderRole: 'Senior Developer',
      recipient: 'Mike Chen',
      recipientRole: 'Product Manager',
      message: 'Mike has been exceptional in coordinating our cross-functional project. His clear communication and stakeholder management skills made our sprint delivery possible.',
      category: 'Teamwork',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      likes: 3,
      isLiked: false
    },
    {
      id: '2',
      sender: 'Emily Rodriguez',
      senderRole: 'UX Designer',
      recipient: 'Alex Kim',
      recipientRole: 'Frontend Developer',
      message: 'Alex went above and beyond to implement the new design system. His attention to detail and willingness to iterate made our user experience significantly better.',
      category: 'Innovation',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      likes: 5,
      isLiked: true
    },
    {
      id: '3',
      sender: 'David Wilson',
      senderRole: 'Engineering Manager',
      recipient: 'Lisa Park',
      recipientRole: 'QA Engineer',
      message: 'Lisa\'s thorough testing approach caught several critical issues before they reached production. Her dedication to quality is outstanding.',
      category: 'Quality',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      likes: 4,
      isLiked: false
    },
    {
      id: '4',
      sender: 'Mike Chen',
      senderRole: 'Product Manager',
      recipient: 'Sarah Johnson',
      recipientRole: 'Senior Developer',
      message: 'Sarah\'s technical leadership on the authentication refactor was incredible. She not only delivered on time but also mentored junior developers throughout the process.',
      category: 'Leadership',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      likes: 7,
      isLiked: false
    },
    {
      id: '5',
      sender: 'Alex Kim',
      senderRole: 'Frontend Developer',
      recipient: 'Emily Rodriguez',
      recipientRole: 'UX Designer',
      message: 'Emily\'s user research insights completely changed our approach to the onboarding flow. Her empathy for users helped us create something truly valuable.',
      category: 'User Focus',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      likes: 6,
      isLiked: true
    }
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Teamwork': return 'bg-blue-500';
      case 'Innovation': return 'bg-purple-500';
      case 'Leadership': return 'bg-green-500';
      case 'Quality': return 'bg-orange-500';
      case 'User Focus': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Recognition Feed</h1>
          <p className="text-muted-foreground">
            See recent team recognition activity and celebrate great work together
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{mockFeed.length}</p>
            <p className="text-sm text-muted-foreground">ShoutOuts Today</p>
          </div>
          
          <div className="p-4 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm text-center">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-sm text-muted-foreground">Team Members</p>
          </div>
          
          <div className="p-4 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm text-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">25</p>
            <p className="text-sm text-muted-foreground">Total Likes</p>
          </div>
        </div>

        {/* Recognition Feed */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Recent Recognition</h2>
          
          {mockFeed.map((recognition) => (
            <div 
              key={recognition.id}
              className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {recognition.sender.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{recognition.sender}</p>
                    <p className="text-sm text-muted-foreground">{recognition.senderRole}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getCategoryColor(recognition.category)}`}>
                    {recognition.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatTimeAgo(recognition.timestamp)}
                  </span>
                </div>
              </div>

              {/* Recognition Message */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Recognizing <span className="font-medium text-foreground">{recognition.recipient}</span> ({recognition.recipientRole})
                </p>
                <p className="text-foreground leading-relaxed">
                  "{recognition.message}"
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Heart className={`h-4 w-4 ${recognition.isLiked ? 'text-red-500 fill-current' : ''}`} />
                  <span>{recognition.likes} likes</span>
                </button>
                
                <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <button className="px-6 py-3 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200 text-foreground">
            Load More Recognition
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
