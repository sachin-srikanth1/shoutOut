'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useOnboarding } from '@/contexts/onboarding-context';
import { OnboardingProvider } from '@/contexts/onboarding-context';
import PositionStep from '@/components/onboarding/position-step';
import ProfileStep from '@/components/onboarding/profile-step';
import HobbiesStep from '@/components/onboarding/hobbies-step';
import CompletionStep from '@/components/onboarding/completion-step';
import { CheckCircle } from 'lucide-react';

function OnboardingContent() {
  const { user, loading } = useAuth();
  const { currentStep, onboardingData } = useOnboarding();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (onboardingData.isCompleted) {
      // Don't redirect immediately, show completion step first
    }
  }, [onboardingData.isCompleted, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 px-4">
        <div className="text-center space-y-4 max-w-sm w-full">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary/40 animate-ping"></div>
          </div>
          <p className="text-muted-foreground font-medium text-sm sm:text-base">Setting up your experience...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const steps = [
    { number: 1, title: 'Positions', completed: onboardingData.positions.length > 0 },
    { number: 2, title: 'Profile', completed: onboardingData.linkedinProfile && onboardingData.resume },
    { number: 3, title: 'Hobbies', completed: onboardingData.hobbies.length > 0 },
  ];

  const renderStep = () => {
    if (onboardingData.isCompleted) {
      return <CompletionStep />;
    }
    
    switch (currentStep) {
      case 1:
        return <PositionStep />;
      case 2:
        return <ProfileStep />;
      case 3:
        return <HobbiesStep />;
      default:
        return <PositionStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header */}
      {!onboardingData.isCompleted && (
        <div className="sticky top-0 z-10 backdrop-blur-sm bg-background/80 border-b border-border/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text truncate">
                  Welcome to Netch
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base truncate">Let's get you set up in just a few steps</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-muted/50 rounded-full ml-4">
                <span className="text-sm font-medium text-foreground">
                  Step {currentStep} of 3
                </span>
              </div>
            </div>

            {/* Mobile step indicator */}
            <div className="sm:hidden mb-4">
              <div className="flex items-center justify-center">
                <span className="text-sm font-medium text-foreground bg-muted/50 px-3 py-1 rounded-full">
                  Step {currentStep} of 3
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300 ${
                      step.completed || currentStep > step.number
                        ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25'
                        : currentStep === step.number
                        ? 'border-primary text-primary bg-primary/5 shadow-md'
                        : 'border-border text-muted-foreground bg-background'
                    }`}>
                      {step.completed || currentStep > step.number ? (
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <span className="text-xs sm:text-sm font-semibold">{step.number}</span>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 sm:mx-3 transition-all duration-300 ${
                        step.completed ? 'bg-gradient-to-r from-primary to-primary/80' : 'bg-border'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground px-1 sm:px-2">
                {steps.map((step) => (
                  <span key={step.number} className="text-center flex-1 font-medium truncate">
                    {step.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step content */}
      <div className="py-4 sm:py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  );
} 