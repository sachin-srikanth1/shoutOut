'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { Send, Heart, Calendar, User, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

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

export default function MyShoutoutPage() {
  const [shoutouts, setShoutouts] = useState<Shoutout[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'sent' | 'received'>('all');

  // Load shoutouts from localStorage on component mount
  useEffect(() => {
    const savedShoutouts = localStorage.getItem('shoutouts');
    if (savedShoutouts) {
      setShoutouts(JSON.parse(savedShoutouts));
    }
  }, []);

  // Filter shoutouts based on active tab
  const filteredShoutouts = shoutouts.filter(shoutout => {
    if (activeTab === 'all') return true;
    return shoutout.type === activeTab;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Teamwork': 'bg-blue-500/10 text-blue-600',
      'Innovation': 'bg-green-500/10 text-green-600',
      'Leadership': 'bg-purple-500/10 text-purple-600',
      'Customer Focus': 'bg-orange-500/10 text-orange-600',
      'Excellence': 'bg-pink-500/10 text-pink-600'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/10 text-gray-600';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">My Shoutouts</h1>
          <p className="text-muted-foreground">
            Track all the recognition you've given and received
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Send className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sent</p>
                <p className="text-2xl font-bold text-foreground">
                  {shoutouts.filter(s => s.type === 'sent').length}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Received</p>
                <p className="text-2xl font-bold text-foreground">
                  {shoutouts.filter(s => s.type === 'received').length}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{shoutouts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 p-1 bg-muted/30 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({shoutouts.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'sent'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sent ({shoutouts.filter(s => s.type === 'sent').length})
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'received'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Received ({shoutouts.filter(s => s.type === 'received').length})
          </button>
        </div>

        {/* Shoutouts List */}
        <div className="space-y-4">
          {filteredShoutouts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {activeTab === 'all' 
                  ? 'No shoutouts yet' 
                  : activeTab === 'sent' 
                    ? 'No sent shoutouts yet' 
                    : 'No received shoutouts yet'
                }
              </h3>
              <p className="text-muted-foreground">
                {activeTab === 'all' 
                  ? 'Start recognizing your team members to see them here!' 
                  : activeTab === 'sent' 
                    ? 'Send your first shoutout to someone who deserves recognition!' 
                    : 'Your team members will send you shoutouts that will appear here!'
                }
              </p>
            </div>
          ) : (
            filteredShoutouts.map((shoutout) => (
              <div
                key={shoutout.id}
                className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      shoutout.type === 'sent' 
                        ? 'bg-blue-500/10 text-blue-600' 
                        : 'bg-green-500/10 text-green-600'
                    }`}>
                      {shoutout.type === 'sent' ? (
                        <Send className="h-4 w-4" />
                      ) : (
                        <Heart className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {shoutout.type === 'sent' ? 'Sent to' : 'Received from'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {shoutout.type === 'sent' ? shoutout.recipient : shoutout.sender}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(shoutout.category)}`}>
                      {shoutout.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(shoutout.date)}
                    </span>
                  </div>
                </div>
                
                <p className="text-foreground mb-4 leading-relaxed">
                  {shoutout.message}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(shoutout.date)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      shoutout.isPublic ? 'bg-green-500/10 text-green-600' : 'bg-gray-500/10 text-gray-600'
                    }`}>
                      {shoutout.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 