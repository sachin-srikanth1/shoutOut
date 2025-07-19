'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { 
  OnboardingData, 
  OnboardingContextType, 
  OnboardingStep,
  Position,
  Hobby,
  LinkedInProfile,
  ResumeFile
} from '@/types/onboarding';
import { onboardingService } from '@/services/onboarding-service';

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(() => {
    // Try to load from localStorage on initialization
    const savedData = onboardingService.loadFromLocalStorage();
    return savedData || onboardingService.createInitialData();
  });
  
  const { user, markOnboardingCompleted } = useAuth();

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (onboardingData && !onboardingData.isCompleted) {
      onboardingService.saveToLocalStorage(onboardingData);
    }
  }, [onboardingData]);

  // Step management
  const goToNextStep = () => {
    if (canProceedToNextStep()) {
      const nextStep = onboardingService.getNextStep(currentStep);
      if (nextStep) {
        setCurrentStep(nextStep as OnboardingStep);
        // Mark current step as completed
        setOnboardingData(prev => onboardingService.markStepCompleted(currentStep, prev));
        // Track step completion
        onboardingService.trackStepCompletion(currentStep, onboardingData);
      }
    }
  };

  const goToPreviousStep = () => {
    const previousStep = onboardingService.getPreviousStep(currentStep);
    if (previousStep) {
      setCurrentStep(previousStep as OnboardingStep);
    }
  };

  const canProceedToNextStep = (): boolean => {
    return onboardingService.canProceedToNextStep(currentStep, onboardingData);
  };

  // Position management
  const updatePositions = (positions: Position[]) => {
    setOnboardingData(prev => ({ 
      ...prev, 
      positions,
      lastUpdated: new Date()
    }));
  };

  const addPosition = (position: Position) => {
    if (onboardingService.canAddPosition(onboardingData.positions)) {
      setOnboardingData(prev => ({ 
        ...prev, 
        positions: [...prev.positions, position],
        lastUpdated: new Date()
      }));
    }
  };

  const removePosition = (positionId: string) => {
    setOnboardingData(prev => ({ 
      ...prev, 
      positions: onboardingService.removePosition(prev.positions, positionId),
      lastUpdated: new Date()
    }));
  };

  // Profile management
  const updateLinkedinProfile = (profile: LinkedInProfile) => {
    setOnboardingData(prev => ({ 
      ...prev, 
      linkedinProfile: profile,
      lastUpdated: new Date()
    }));
  };

  const updateResume = (file: ResumeFile | null) => {
    setOnboardingData(prev => ({ 
      ...prev, 
      resume: file,
      lastUpdated: new Date()
    }));
  };

  // Hobby management
  const updateHobbies = (hobbies: Hobby[]) => {
    setOnboardingData(prev => ({ 
      ...prev, 
      hobbies,
      lastUpdated: new Date()
    }));
  };

  const addHobby = (hobby: Hobby) => {
    if (onboardingService.canAddHobby(onboardingData.hobbies)) {
      setOnboardingData(prev => ({ 
        ...prev, 
        hobbies: [...prev.hobbies, hobby],
        lastUpdated: new Date()
      }));
    }
  };

  const removeHobby = (hobbyId: string) => {
    setOnboardingData(prev => ({ 
      ...prev, 
      hobbies: onboardingService.removeHobby(prev.hobbies, hobbyId),
      lastUpdated: new Date()
    }));
  };

  // Completion
  const completeOnboarding = async () => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Submit onboarding data
      const response = await onboardingService.submitOnboarding(user.id, onboardingData);
      
      if (response.success) {
        // Mark as completed
        setOnboardingData(prev => ({ 
          ...prev, 
          isCompleted: true,
          completedAt: new Date(),
          lastUpdated: new Date()
        }));

        // Track completion
        onboardingService.trackOnboardingCompletion(onboardingData);

        // Update auth context
        await markOnboardingCompleted();
      } else {
        throw new Error(response.message || 'Failed to complete onboarding');
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      throw error;
    }
  };

  const resetOnboarding = () => {
    setCurrentStep(1);
    setOnboardingData(onboardingService.createInitialData());
    onboardingService.clearLocalStorage();
  };

  // Validation
  const validateCurrentStep = (): boolean => {
    const validation = onboardingService.validateStep(currentStep, onboardingData);
    return validation.isValid;
  };

  const getStepValidationErrors = (step: OnboardingStep): string[] => {
    const validation = onboardingService.validateStep(step, onboardingData);
    return validation.errors;
  };

  const value: OnboardingContextType = {
    currentStep,
    onboardingData,
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    canProceedToNextStep,
    updatePositions,
    addPosition,
    removePosition,
    updateLinkedinProfile,
    updateResume,
    updateHobbies,
    addHobby,
    removeHobby,
    completeOnboarding,
    resetOnboarding,
    validateCurrentStep,
    getStepValidationErrors,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
} 