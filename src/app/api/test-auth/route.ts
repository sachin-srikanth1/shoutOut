import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Test basic connection
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    // It's okay if there's no user - that just means no one is logged in
    if (userError && userError.message !== 'Auth session missing!') {
      return NextResponse.json({
        success: false,
        error: 'Auth error',
        details: userError.message
      }, { status: 500 });
    }

    // Test database connection with a public table
    const { data: testData, error: dbError } = await supabase
      .from('position_categories')
      .select('count')
      .limit(1);

    if (dbError) {
      return NextResponse.json({
        success: false,
        error: 'Database error',
        details: dbError.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Authentication and database working',
      authenticated: !!user,
      user: user ? {
        id: user.id,
        email: user.email
      } : null,
      database: {
        connected: true,
        data: testData
      }
    });

  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 