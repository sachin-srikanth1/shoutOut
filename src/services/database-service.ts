// =====================================================
// DATABASE SERVICE
// Handles all database operations with Supabase
// =====================================================

import { createClient } from '@/lib/supabase/client';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  company?: string;
  job_title?: string;
  industry?: string;
  skills?: string[];
  interests?: string[];
  created_at: string;
  updated_at: string;
}

export interface RecommendedProfile {
  id: string;
  user_id: string;
  recommended_user_id: string;
  category_id?: string;
  reason?: string;
  score: number;
  is_viewed: boolean;
  is_contacted: boolean;
  created_at: string;
  recommended_user?: UserProfile;
  category?: ProfileCategory;
}

export interface ProfileCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface UserNotification {
  id: string;
  user_id: string;
  type_id: string;
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  is_archived: boolean;
  read_at?: string;
  created_at: string;
  type?: NotificationType;
}

export interface NotificationType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  template?: string;
  is_active: boolean;
  created_at: string;
}

export interface Meeting {
  id: string;
  organizer_id: string;
  type_id?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  timezone: string;
  location?: string;
  meeting_url?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  max_participants?: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  organizer?: UserProfile;
  type?: MeetingType;
  participants?: MeetingParticipant[];
}

export interface MeetingType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  is_active: boolean;
  created_at: string;
}

export interface MeetingParticipant {
  id: string;
  meeting_id: string;
  user_id: string;
  status: 'invited' | 'accepted' | 'declined' | 'maybe';
  joined_at?: string;
  left_at?: string;
  created_at: string;
  user?: UserProfile;
}

export interface Project {
  id: string;
  creator_id: string;
  status_id?: string;
  title: string;
  description?: string;
  start_date?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  creator?: UserProfile;
  status?: ProjectStatus;
  members?: ProjectMember[];
  tasks?: Task[];
}

export interface ProjectStatus {
  id: string;
  name: string;
  slug: string;
  color: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joined_at: string;
  user?: UserProfile;
}

export interface Task {
  id: string;
  project_id: string;
  assignee_id?: string;
  creator_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  assignee?: UserProfile;
  creator?: UserProfile;
  project?: Project;
}

export interface UserConnection {
  id: string;
  follower_id: string;
  following_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  follower?: UserProfile;
  following?: UserProfile;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  activity_data?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// =====================================================
// DATABASE SERVICE CLASS
// =====================================================

export class DatabaseService {
  private static instance: DatabaseService;
  private supabase;

  private constructor() {
    this.supabase = createClient();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // =====================================================
  // USER PROFILE OPERATIONS
  // =====================================================

  async getUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as UserProfile
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user profile'
      };
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as UserProfile
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user profile'
      };
    }
  }

  async createUserProfile(userId: string, email: string, userData: { firstName: string; lastName: string }): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .insert({
          id: userId,
          email: email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          full_name: `${userData.firstName} ${userData.lastName}`,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as UserProfile
      };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user profile'
      };
    }
  }

  async searchProfiles(query: string, limit: number = 10): Promise<ApiResponse<UserProfile[]>> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .or(`full_name.ilike.%${query}%,company.ilike.%${query}%,job_title.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;

      return {
        success: true,
        data: data as UserProfile[]
      };
    } catch (error) {
      console.error('Error searching profiles:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search profiles'
      };
    }
  }

  // =====================================================
  // RECOMMENDED PROFILES OPERATIONS
  // =====================================================

  async getRecommendedProfiles(userId: string, limit: number = 10): Promise<ApiResponse<RecommendedProfile[]>> {
    try {
      const { data, error } = await this.supabase
        .from('recommended_profiles')
        .select(`
          *,
          recommended_user:user_profiles!recommended_user_id(*),
          category:profile_categories(*)
        `)
        .eq('user_id', userId)
        .order('score', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        success: true,
        data: data as RecommendedProfile[]
      };
    } catch (error) {
      console.error('Error fetching recommended profiles:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch recommended profiles'
      };
    }
  }

  async markProfileAsViewed(userId: string, recommendedUserId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await this.supabase
        .from('recommended_profiles')
        .update({ is_viewed: true })
        .eq('user_id', userId)
        .eq('recommended_user_id', recommendedUserId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error marking profile as viewed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mark profile as viewed'
      };
    }
  }

  // =====================================================
  // NOTIFICATIONS OPERATIONS
  // =====================================================

  async getNotifications(userId: string, limit: number = 20): Promise<ApiResponse<UserNotification[]>> {
    try {
      const { data, error } = await this.supabase
        .from('user_notifications')
        .select(`
          *,
          type:notification_types(*)
        `)
        .eq('user_id', userId)
        .eq('is_archived', false)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        success: true,
        data: data as UserNotification[]
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch notifications'
      };
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await this.supabase
        .from('user_notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mark notification as read'
      };
    }
  }

  async createNotification(userId: string, typeId: string, title: string, message: string, data?: any): Promise<ApiResponse<UserNotification>> {
    try {
      const { data: notification, error } = await this.supabase
        .from('user_notifications')
        .insert({
          user_id: userId,
          type_id: typeId,
          title,
          message,
          data
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: notification as UserNotification
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create notification'
      };
    }
  }

  // =====================================================
  // MEETINGS OPERATIONS
  // =====================================================

  async getUpcomingMeetings(userId: string, limit: number = 10): Promise<ApiResponse<Meeting[]>> {
    try {
      const { data, error } = await this.supabase
        .from('meetings')
        .select(`
          *,
          organizer:user_profiles!organizer_id(*),
          type:meeting_types(*),
          participants:meeting_participants(
            *,
            user:user_profiles(*)
          )
        `)
        .or(`organizer_id.eq.${userId},id.in.(select meeting_id from meeting_participants where user_id = '${userId}')`)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(limit);

      if (error) throw error;

      return {
        success: true,
        data: data as Meeting[]
      };
    } catch (error) {
      console.error('Error fetching upcoming meetings:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch upcoming meetings'
      };
    }
  }

  async createMeeting(meetingData: Partial<Meeting>): Promise<ApiResponse<Meeting>> {
    try {
      const { data, error } = await this.supabase
        .from('meetings')
        .insert(meetingData)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Meeting
      };
    } catch (error) {
      console.error('Error creating meeting:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create meeting'
      };
    }
  }

  // =====================================================
  // PROJECTS & TASKS OPERATIONS
  // =====================================================

  async getInProgressProjects(userId: string, limit: number = 10): Promise<ApiResponse<Project[]>> {
    try {
      const { data, error } = await this.supabase
        .from('projects')
        .select(`
          *,
          creator:user_profiles!creator_id(*),
          status:project_statuses(*),
          members:project_members(
            *,
            user:user_profiles(*)
          ),
          tasks:tasks(*)
        `)
        .or(`creator_id.eq.${userId},id.in.(select project_id from project_members where user_id = '${userId}')`)
        .eq('status.slug', 'in_progress')
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        success: true,
        data: data as Project[]
      };
    } catch (error) {
      console.error('Error fetching in-progress projects:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch in-progress projects'
      };
    }
  }

  async getTasks(userId: string, status?: string, limit: number = 20): Promise<ApiResponse<Task[]>> {
    try {
      let query = this.supabase
        .from('tasks')
        .select(`
          *,
          assignee:user_profiles!assignee_id(*),
          creator:user_profiles!creator_id(*),
          project:projects(*)
        `)
        .or(`assignee_id.eq.${userId},creator_id.eq.${userId}`)
        .order('due_date', { ascending: true })
        .limit(limit);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data as Task[]
      };
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tasks'
      };
    }
  }

  // =====================================================
  // USER CONNECTIONS OPERATIONS
  // =====================================================

  async getConnections(userId: string, status: string = 'accepted'): Promise<ApiResponse<UserConnection[]>> {
    try {
      const { data, error } = await this.supabase
        .from('user_connections')
        .select(`
          *,
          follower:user_profiles!follower_id(*),
          following:user_profiles!following_id(*)
        `)
        .or(`follower_id.eq.${userId},following_id.eq.${userId}`)
        .eq('status', status);

      if (error) throw error;

      return {
        success: true,
        data: data as UserConnection[]
      };
    } catch (error) {
      console.error('Error fetching connections:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch connections'
      };
    }
  }

  async sendConnectionRequest(followerId: string, followingId: string): Promise<ApiResponse<UserConnection>> {
    try {
      const { data, error } = await this.supabase
        .from('user_connections')
        .insert({
          follower_id: followerId,
          following_id: followingId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as UserConnection
      };
    } catch (error) {
      console.error('Error sending connection request:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send connection request'
      };
    }
  }

  // =====================================================
  // ACTIVITY LOGGING
  // =====================================================

  async logActivity(userId: string, activityType: string, activityData?: any): Promise<ApiResponse<void>> {
    try {
      const { error } = await this.supabase
        .from('user_activities')
        .insert({
          user_id: userId,
          activity_type: activityType,
          activity_data: activityData
        });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error logging activity:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to log activity'
      };
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  async generateRecommendations(userId: string): Promise<ApiResponse<void>> {
    try {
      // This is a simplified recommendation algorithm
      // In a real app, you'd implement more sophisticated logic
      
      // Get user's profile
      const profileResponse = await this.getUserProfile(userId);
      if (!profileResponse.success || !profileResponse.data) {
        throw new Error('Failed to get user profile');
      }

      const userProfile = profileResponse.data;

      // Find users with similar interests/industry
      const { data: similarUsers, error } = await this.supabase
        .from('user_profiles')
        .select('id')
        .neq('id', userId)
        .or(`industry.eq.${userProfile.industry},company.eq.${userProfile.company}`)
        .limit(10);

      if (error) throw error;

      // Create recommendations
      for (const user of similarUsers || []) {
        await this.supabase
          .from('recommended_profiles')
          .upsert({
            user_id: userId,
            recommended_user_id: user.id,
            reason: 'Similar industry or company',
            score: Math.random() * 0.5 + 0.5 // Random score between 0.5 and 1.0
          });
      }

      return { success: true };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate recommendations'
      };
    }
  }
}

// Export singleton instance
export const databaseService = DatabaseService.getInstance(); 