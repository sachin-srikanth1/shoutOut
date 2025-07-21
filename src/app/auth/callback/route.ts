import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  
  const next = searchParams.get('next') ?? '/'

  console.log('OAuth callback received:', { code: !!code, error, errorDescription })

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1')
    const baseUrl = isLocalhost ? origin.replace('https://', 'http://') : origin
    const redirectUrl = `${baseUrl}/auth/auth-code-error?error=${error}&description=${errorDescription}`
    return NextResponse.redirect(redirectUrl)
  }

  if (code) {
    try {
      console.log('Exchanging code for session...')
      const supabase = await createClient()
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Exchange error:', exchangeError)
        const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1')
        const baseUrl = isLocalhost ? origin.replace('https://', 'http://') : origin
        const redirectUrl = `${baseUrl}/auth/auth-code-error?error=exchange_failed&description=${exchangeError.message}`
        return NextResponse.redirect(redirectUrl)
      }
      
      console.log('Exchange successful:', { 
        hasSession: !!data.session, 
        hasUser: !!data.session?.user,
        userEmail: data.session?.user?.email 
      })
      
      if (data.session) {
        const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1')
        const baseUrl = isLocalhost ? origin.replace('https://', 'http://') : origin
        
        // Check if user has completed onboarding
        const onboardingCompleted = data.session.user.user_metadata?.onboarding_completed
        const redirectUrl = onboardingCompleted ? `${baseUrl}${next}` : `${baseUrl}/onboarding`
        
        console.log('Redirecting to:', redirectUrl)
        return NextResponse.redirect(redirectUrl)
      } else {
        console.error('No session returned from exchange')
        const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1')
        const baseUrl = isLocalhost ? origin.replace('https://', 'http://') : origin
        const redirectUrl = `${baseUrl}/auth/auth-code-error?error=no_session&description=No session returned from OAuth exchange`
        return NextResponse.redirect(redirectUrl)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1')
      const baseUrl = isLocalhost ? origin.replace('https://', 'http://') : origin
      const redirectUrl = `${baseUrl}/auth/auth-code-error?error=unexpected&description=${err instanceof Error ? err.message : 'Unknown error'}`
      return NextResponse.redirect(redirectUrl)
    }
  }

  // No code provided - redirect to error page
  const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1')
  const baseUrl = isLocalhost ? origin.replace('https://', 'http://') : origin
  const redirectUrl = `${baseUrl}/auth/auth-code-error?error=no_code&description=No OAuth code provided`
  return NextResponse.redirect(redirectUrl)
} 