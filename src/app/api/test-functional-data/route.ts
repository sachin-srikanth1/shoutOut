import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/services/database-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId parameter is required'
      }, { status: 400 });
    }

    // Test all database operations
    const results = {
      userProfile: await databaseService.getUserProfile(userId),
      recommendedProfiles: await databaseService.getRecommendedProfiles(userId, 3),
      notifications: await databaseService.getNotifications(userId, 3),
      upcomingMeetings: await databaseService.getUpcomingMeetings(userId, 3),
      inProgressProjects: await databaseService.getInProgressProjects(userId, 3),
      tasks: await databaseService.getTasks(userId, 'in_progress', 3),
      connections: await databaseService.getConnections(userId, 'accepted')
    };

    return NextResponse.json({
      success: true,
      data: results,
      message: 'All database operations completed successfully'
    });

  } catch (error) {
    console.error('Error testing functional data:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, data } = body;

    switch (action) {
      case 'generate_recommendations':
        if (!userId) {
          return NextResponse.json({
            success: false,
            error: 'userId is required for generating recommendations'
          }, { status: 400 });
        }
        
        const result = await databaseService.generateRecommendations(userId);
        return NextResponse.json(result);

      case 'create_notification':
        if (!userId || !data) {
          return NextResponse.json({
            success: false,
            error: 'userId and notification data are required'
          }, { status: 400 });
        }
        
        const notificationResult = await databaseService.createNotification(
          userId,
          data.typeId,
          data.title,
          data.message,
          data.data
        );
        return NextResponse.json(notificationResult);

      case 'log_activity':
        if (!userId || !data) {
          return NextResponse.json({
            success: false,
            error: 'userId and activity data are required'
          }, { status: 400 });
        }
        
        const activityResult = await databaseService.logActivity(
          userId,
          data.activityType,
          data.activityData
        );
        return NextResponse.json(activityResult);

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: generate_recommendations, create_notification, log_activity'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
} 