import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing Supabase environment variables',
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
      }, { status: 500 });
    }

    // Test Supabase client creation
    const supabase = createClient();
    
    // Test basic connection
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to Supabase',
        details: error.message,
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase configuration is working',
      hasSession: !!data.session,
      userEmail: data.session?.user?.email || null,
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
    });

  } catch (error) {
    console.error('Supabase config test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error testing Supabase configuration',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 