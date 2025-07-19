import { useCallback, useMemo } from 'react';
import { useOnboarding } from '@/contexts/onboarding-context';
import { 
  Position, 
  Hobby, 
  LinkedInProfile, 
  ResumeFile,
  OnboardingStep,
  ValidationResult
} from '@/types/onboarding';
import { onboardingService } from '@/services/onboarding-service';
import { 
  POSITION_OPTIONS, 
  HOBBY_OPTIONS, 
  getResumeBasedHobbies,
  DEFAULT_ONBOARDING_CONFIG 
} from '@/data/onboarding-options';

export function useOnboardingManager() {
  const {
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
  } = useOnboarding();

  // Step management
  const stepInfo = useMemo(() => ({
    current: currentStep,
    total: 3,
    progress: onboardingService.getProgressPercentage(onboardingData),
    isCompleted: onboardingData.isCompleted,
    canProceed: canProceedToNextStep(),
    validationErrors: getStepValidationErrors(currentStep),
  }), [currentStep, onboardingData, canProceedToNextStep, getStepValidationErrors]);

  const navigateToStep = useCallback((step: OnboardingStep) => {
    setCurrentStep(step);
  }, [setCurrentStep]);

  // Position management
  const positionManager = useMemo(() => ({
    selected: onboardingData.positions,
    available: POSITION_OPTIONS,
    maxCount: DEFAULT_ONBOARDING_CONFIG.maxPositions,
    canAdd: onboardingService.canAddPosition(onboardingData.positions),
    count: onboardingData.positions.length,
    
    add: (name: string, category: string = 'other', isCustom: boolean = false) => {
      const position = onboardingService.addPosition(name, category, isCustom);
      addPosition(position);
    },
    
    remove: (positionId: string) => {
      removePosition(positionId);
    },
    
    toggle: (name: string, category: string = 'other') => {
      const existingPosition = onboardingData.positions.find(p => p.name === name);
      if (existingPosition) {
        removePosition(existingPosition.id);
      } else if (onboardingService.canAddPosition(onboardingData.positions)) {
        const position = onboardingService.addPosition(name, category, false);
        addPosition(position);
      }
    },
    
    isSelected: (name: string) => {
      return onboardingData.positions.some(p => p.name === name);
    },
  }), [onboardingData.positions, addPosition, removePosition]);

  // Profile management
  const profileManager = useMemo(() => ({
    linkedin: onboardingData.linkedinProfile,
    resume: onboardingData.resume,
    
    updateLinkedin: (url: string) => {
      const profile = onboardingService.updateLinkedInProfile(url);
      updateLinkedinProfile(profile);
    },
    
    updateResume: (file: File | null) => {
      const resumeFile = onboardingService.updateResume(file);
      updateResume(resumeFile);
    },
    
    removeResume: () => {
      updateResume(null);
    },
    
    isLinkedinValid: onboardingData.linkedinProfile.isValid,
    hasResume: !!onboardingData.resume,
  }), [onboardingData.linkedinProfile, onboardingData.resume, updateLinkedinProfile, updateResume]);

  // Hobby management
  const hobbyManager = useMemo(() => {
    const suggestedHobbies = onboardingData.resume ? 
      getResumeBasedHobbies(onboardingData.resume.name) : [];
    
    return {
      selected: onboardingData.hobbies,
      available: HOBBY_OPTIONS,
      suggested: suggestedHobbies,
      maxCount: DEFAULT_ONBOARDING_CONFIG.maxHobbies,
      canAdd: onboardingService.canAddHobby(onboardingData.hobbies),
      count: onboardingData.hobbies.length,
      
      add: (name: string, category: string = 'other', isCustom: boolean = false, source?: string) => {
        const hobby = onboardingService.addHobby(name, category, isCustom, source);
        addHobby(hobby);
      },
      
      remove: (hobbyId: string) => {
        removeHobby(hobbyId);
      },
      
      toggle: (name: string, category: string = 'other', source?: string) => {
        const existingHobby = onboardingData.hobbies.find(h => h.name === name);
        if (existingHobby) {
          removeHobby(existingHobby.id);
        } else if (onboardingService.canAddHobby(onboardingData.hobbies)) {
          const hobby = onboardingService.addHobby(name, category, false, source);
          addHobby(hobby);
        }
      },
      
      isSelected: (name: string) => {
        return onboardingData.hobbies.some(h => h.name === name);
      },
    };
  }, [onboardingData.hobbies, onboardingData.resume, addHobby, removeHobby]);

  // Validation
  const validation = useMemo(() => {
    const currentValidation = onboardingService.validateStep(currentStep, onboardingData);
    const completeValidation = onboardingService.validateCompleteOnboarding(onboardingData);
    
    return {
      current: currentValidation,
      complete: completeValidation,
      isCurrentStepValid: currentValidation.isValid,
      isCompleteValid: completeValidation.isValid,
      getErrors: (step?: OnboardingStep) => {
        const targetStep = step || currentStep;
        return onboardingService.validateStep(targetStep, onboardingData).errors;
      },
      getWarnings: (step?: OnboardingStep) => {
        const targetStep = step || currentStep;
        return onboardingService.validateStep(targetStep, onboardingData).warnings;
      },
    };
  }, [currentStep, onboardingData]);

  // Navigation
  const navigation = useMemo(() => ({
    next: goToNextStep,
    previous: goToPreviousStep,
    canGoNext: canProceedToNextStep(),
    canGoPrevious: currentStep > 1,
    goToStep: navigateToStep,
  }), [goToNextStep, goToPreviousStep, canProceedToNextStep, currentStep, navigateToStep]);

  // Completion
  const completion = useMemo(() => ({
    isCompleted: onboardingData.isCompleted,
    complete: completeOnboarding,
    reset: resetOnboarding,
    progress: onboardingService.getProgressPercentage(onboardingData),
    startedAt: onboardingData.startedAt,
    lastUpdated: onboardingData.lastUpdated,
    completedAt: onboardingData.completedAt,
  }), [onboardingData, completeOnboarding, resetOnboarding]);

  // Analytics
  const analytics = useMemo(() => ({
    trackStepCompletion: () => {
      onboardingService.trackStepCompletion(currentStep, onboardingData);
    },
    trackOnboardingCompletion: () => {
      onboardingService.trackOnboardingCompletion(onboardingData);
    },
  }), [currentStep, onboardingData]);

  return {
    // Core data
    data: onboardingData,
    
    // Step management
    step: stepInfo,
    
    // Managers
    positions: positionManager,
    profile: profileManager,
    hobbies: hobbyManager,
    
    // Navigation
    navigation,
    
    // Validation
    validation,
    
    // Completion
    completion,
    
    // Analytics
    analytics,
    
    // Utility methods
    saveToStorage: () => onboardingService.saveToLocalStorage(onboardingData),
    loadFromStorage: () => onboardingService.loadFromLocalStorage(),
    clearStorage: () => onboardingService.clearLocalStorage(),
  };
} 