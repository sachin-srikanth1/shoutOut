'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { BarChart3, TrendingUp, Users, Award } from 'lucide-react';

export default function AnalyticsPage() {
  // Mock data for analytics
  const mockData = {
    totalShoutOuts: 47,
    thisWeek: 12,
    thisMonth: 34,
    teamMembers: 24,
    recognitionRate: 0.85,
    topRecognizers: [
      { name: 'Sarah Johnson', count: 8 },
      { name: 'Mike Chen', count: 6 },
      { name: 'Emily Rodriguez', count: 5 }
    ],
    weeklyTrend: [5, 8, 3, 12, 7, 9, 11],
    categories: [
      { name: 'Teamwork', count: 18, percentage: 38 },
      { name: 'Innovation', count: 12, percentage: 26 },
      { name: 'Leadership', count: 9, percentage: 19 },
      { name: 'Customer Focus', count: 8, percentage: 17 }
    ]
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Recognition Analytics</h1>
          <p className="text-muted-foreground">
            Track recognition trends and team engagement metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total ShoutOuts</p>
                <p className="text-2xl font-bold text-foreground">{mockData.totalShoutOuts}</p>
              </div>
            </div>
          </div>

          <div className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold text-foreground">{mockData.thisWeek}</p>
              </div>
            </div>
          </div>

          <div className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold text-foreground">{mockData.teamMembers}</p>
              </div>
            </div>
          </div>

          <div className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recognition Rate</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(mockData.recognitionRate * 100)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Trend */}
          <div className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Recognition Trend</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">This Week</span>
                <span className="font-medium">{mockData.thisWeek} shoutouts</span>
              </div>
              <div className="flex items-end gap-1 h-32">
                {mockData.weeklyTrend.map((value, index) => {
                  const maxValue = Math.max(...mockData.weeklyTrend);
                  const heightPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                  const minHeight = 4; // Minimum height in pixels
                  const actualHeight = Math.max(heightPercentage, minHeight);
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-muted/30 rounded-t relative">
                        <div 
                          className="bg-primary rounded-t transition-all duration-300 w-full"
                          style={{ 
                            height: `${actualHeight}%`,
                            minHeight: `${minHeight}px`
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">{value}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          {/* Recognition Categories */}
          <div className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recognition Categories</h3>
            <div className="space-y-4">
              {mockData.categories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-muted-foreground">{category.count} ({category.percentage}%)</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Recognizers */}
        <div className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Recognizers This Month</h3>
          <div className="space-y-3">
            {mockData.topRecognizers.map((recognizer, index) => (
              <div key={recognizer.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  <span className="font-medium">{recognizer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{recognizer.count} shoutouts</span>
                  <Award className="h-4 w-4 text-yellow-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Positive Trends</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Recognition increased 40% this month</li>
                <li>• 85% of team members engaged</li>
                <li>• Teamwork is the top category</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Areas for Growth</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Encourage more cross-team recognition</li>
                <li>• Increase innovation category recognition</li>
                <li>• Promote recognition during team meetings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
