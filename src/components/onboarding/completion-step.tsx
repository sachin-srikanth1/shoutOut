'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Sparkles, ArrowRight, Users, Target, Zap } from 'lucide-react';

export default function CompletionStep() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8 sm:mb-12">
        <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-6 sm:mb-8">
          <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
          <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-primary absolute -top-1 -right-1 sm:-top-2 sm:-right-2 animate-pulse" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 sm:mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
          Welcome to Netch!
        </h1>
        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8">
          Your profile is now complete. We're excited to have you on board and can't wait to help you connect with amazing opportunities!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 text-center shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full mx-auto mb-3 sm:mb-4">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Connect</h3>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Build meaningful relationships with professionals in your field
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 text-center shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full mx-auto mb-3 sm:mb-4">
            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Discover</h3>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Find opportunities tailored to your skills and interests
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 text-center shadow-sm hover:shadow-md transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full mx-auto mb-3 sm:mb-4">
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Grow</h3>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Accelerate your career with personalized insights and resources
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6 sm:p-8 mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4 text-center">What's next?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full">
                <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 text-primary-foreground" />
              </div>
              <span className="text-foreground font-medium text-sm sm:text-base">Explore your personalized dashboard</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full">
                <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 text-primary-foreground" />
              </div>
              <span className="text-foreground font-medium text-sm sm:text-base">Connect with other professionals</span>
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full">
                <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 text-primary-foreground" />
              </div>
              <span className="text-foreground font-medium text-sm sm:text-base">Discover opportunities tailored to your interests</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full">
                <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 text-primary-foreground" />
              </div>
              <span className="text-foreground font-medium text-sm sm:text-base">Start building your professional network</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => router.push('/dashboard')}
          className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 font-semibold text-base sm:text-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 touch-manipulation"
        >
          Go to Dashboard
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
        <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
          Redirecting automatically in a few seconds...
        </p>
      </div>
    </div>
  );
} 