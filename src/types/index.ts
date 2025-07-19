// Export all onboarding types
export * from './onboarding';

// Re-export commonly used types for convenience
export type {
  OnboardingData,
  OnboardingContextType,
  OnboardingStep,
  Position,
  Hobby,
  LinkedInProfile,
  ResumeFile,
  ValidationResult,
  OnboardingSubmission,
  OnboardingResponse,
} from './onboarding';

// Re-export constants
export {
  ONBOARDING_STEPS,
  POSITION_CATEGORIES,
  HOBBY_CATEGORIES,
} from './onboarding';

// Re-export utility functions
export {
  createPosition,
  createHobby,
  createLinkedInProfile,
  createResumeFile,
  validateLinkedInUrl,
  extractLinkedInUsername,
  validateResumeFile,
  validateOnboardingStep,
} from './onboarding'; 