'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { databaseService } from '@/services/database-service';

interface DatabaseStatus {
  table: string;
  status: 'loading' | 'success' | 'error';
  message: string;
  data?: any;
}

export default function DatabaseStatus() {
  const { user } = useAuth();
  const [statuses, setStatuses] = useState<DatabaseStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const checkDatabaseStatus = async () => {
      const checks: DatabaseStatus[] = [];

      // Check 1: User Profile
      try {
        const profileResponse = await databaseService.getUserProfile(user.id);
        checks.push({
          table: 'user_profiles',
          status: profileResponse.success ? 'success' : 'error',
          message: profileResponse.success ? 'User profile accessible' : profileResponse.error || 'Failed to access user profile',
          data: profileResponse.data
        });
      } catch (error) {
        checks.push({
          table: 'user_profiles',
          status: 'error',
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }

      // Check 2: Recommended Profiles
      try {
        const recommendationsResponse = await databaseService.getRecommendedProfiles(user.id, 5);
        checks.push({
          table: 'recommended_profiles',
          status: recommendationsResponse.success ? 'success' : 'error',
          message: recommendationsResponse.success 
            ? `Found ${recommendationsResponse.data?.length || 0} recommendations` 
            : recommendationsResponse.error || 'Failed to fetch recommendations',
          data: recommendationsResponse.data
        });
      } catch (error) {
        checks.push({
          table: 'recommended_profiles',
          status: 'error',
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }

      // Check 3: Upcoming Meetings
      try {
        const meetingsResponse = await databaseService.getUpcomingMeetings(user.id, 5);
        checks.push({
          table: 'meetings',
          status: meetingsResponse.success ? 'success' : 'error',
          message: meetingsResponse.success 
            ? `Found ${meetingsResponse.data?.length || 0} upcoming meetings` 
            : meetingsResponse.error || 'Failed to fetch meetings',
          data: meetingsResponse.data
        });
      } catch (error) {
        checks.push({
          table: 'meetings',
          status: 'error',
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }

      // Check 4: Notifications
      try {
        const notificationsResponse = await databaseService.getNotifications(user.id, 5);
        checks.push({
          table: 'user_notifications',
          status: notificationsResponse.success ? 'success' : 'error',
          message: notificationsResponse.success 
            ? `Found ${notificationsResponse.data?.length || 0} notifications` 
            : notificationsResponse.error || 'Failed to fetch notifications',
          data: notificationsResponse.data
        });
      } catch (error) {
        checks.push({
          table: 'user_notifications',
          status: 'error',
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }

      // Check 5: In Progress Projects
      try {
        const projectsResponse = await databaseService.getInProgressProjects(user.id, 5);
        checks.push({
          table: 'projects',
          status: projectsResponse.success ? 'success' : 'error',
          message: projectsResponse.success 
            ? `Found ${projectsResponse.data?.length || 0} in-progress projects` 
            : projectsResponse.error || 'Failed to fetch projects',
          data: projectsResponse.data
        });
      } catch (error) {
        checks.push({
          table: 'projects',
          status: 'error',
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }

      // Check 6: Tasks
      try {
        const tasksResponse = await databaseService.getTasks(user.id, undefined, 5);
        checks.push({
          table: 'tasks',
          status: tasksResponse.success ? 'success' : 'error',
          message: tasksResponse.success 
            ? `Found ${tasksResponse.data?.length || 0} tasks` 
            : tasksResponse.error || 'Failed to fetch tasks',
          data: tasksResponse.data
        });
      } catch (error) {
        checks.push({
          table: 'tasks',
          status: 'error',
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }

      // Check 7: User Connections
      try {
        const connectionsResponse = await databaseService.getConnections(user.id, 'accepted');
        checks.push({
          table: 'user_connections',
          status: connectionsResponse.success ? 'success' : 'error',
          message: connectionsResponse.success 
            ? `Found ${connectionsResponse.data?.length || 0} connections` 
            : connectionsResponse.error || 'Failed to fetch connections',
          data: connectionsResponse.data
        });
      } catch (error) {
        checks.push({
          table: 'user_connections',
          status: 'error',
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }

      setStatuses(checks);
      setLoading(false);
    };

    checkDatabaseStatus();
  }, [user?.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'loading':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  if (!user) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <p className="text-sm text-gray-600">Please sign in to check database status</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Database Status Check</h3>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>
      
      <div className="grid gap-3">
        {statuses.map((status, index) => (
          <div
            key={index}
            className={`p-3 border rounded-lg ${getStatusColor(status.status)}`}
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(status.status)}
              <div className="flex-1">
                <p className="font-medium text-sm">{status.table}</p>
                <p className="text-xs text-gray-600">{status.message}</p>
                {status.data && Array.isArray(status.data) && status.data.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Sample: {status.data[0]?.title || status.data[0]?.name || status.data[0]?.email || 'Data available'}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium">Summary:</p>
          <p className="text-xs text-gray-600">
            {statuses.filter(s => s.status === 'success').length} of {statuses.length} tables working correctly
          </p>
          {statuses.filter(s => s.status === 'error').length > 0 && (
            <p className="text-xs text-red-600 mt-1">
              {statuses.filter(s => s.status === 'error').length} tables have issues
            </p>
          )}
        </div>
      )}
    </div>
  );
} 