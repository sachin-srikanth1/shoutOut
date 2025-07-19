// Onboarding Step Types
export type OnboardingStep = 1 | 2 | 3;

export interface OnboardingStepConfig {
  number: OnboardingStep;
  title: string;
  description: string;
  icon: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

// Position Types
export interface Position {
  id: string;
  name: string;
  category: PositionCategory;
  isCustom: boolean;
}

export type PositionCategory = 
  | 'engineering'
  | 'data'
  | 'product'
  | 'business'
  | 'creative'
  | 'other';

export interface PositionOption {
  name: string;
  category: PositionCategory;
  description?: string;
}

// Profile Types
export interface LinkedInProfile {
  url: string;
  isValid: boolean;
  username?: string;
}

export interface ResumeFile {
  file: File;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  isValid: boolean;
  errorMessage?: string;
}

// Hobby Types
export interface Hobby {
  id: string;
  name: string;
  category: HobbyCategory;
  isCustom: boolean;
  source?: 'resume' | 'suggested' | 'custom';
}

export type HobbyCategory = 
  | 'sports'
  | 'creative'
  | 'intellectual'
  | 'social'
  | 'outdoor'
  | 'technology'
  | 'other';

export interface HobbyOption {
  name: string;
  category: HobbyCategory;
  description?: string;
  isPopular?: boolean;
}

// Main Onboarding Data Interface
export interface OnboardingData {
  // Step tracking
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  
  // Position data
  positions: Position[];
  maxPositions: number;
  
  // Profile data
  linkedinProfile: LinkedInProfile;
  resume: ResumeFile | null;
  
  // Hobby data
  hobbies: Hobby[];
  
  // Completion status
  isCompleted: boolean;
  completedAt?: Date;
  
  // Metadata
  startedAt: Date;
  lastUpdated: Date;
}

// Onboarding Context Interface
export interface OnboardingContextType {
  // Current state
  currentStep: OnboardingStep;
  onboardingData: OnboardingData;
  
  // Step management
  setCurrentStep: (step: OnboardingStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canProceedToNextStep: () => boolean;
  
  // Data updates
  updatePositions: (positions: Position[]) => void;
  addPosition: (position: Position) => void;
  removePosition: (positionId: string) => void;
  
  updateLinkedinProfile: (profile: LinkedInProfile) => void;
  updateResume: (file: ResumeFile | null) => void;
  
  updateHobbies: (hobbies: Hobby[]) => void;
  addHobby: (hobby: Hobby) => void;
  removeHobby: (hobbyId: string) => void;
  
  // Completion
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => void;
  
  // Validation
  validateCurrentStep: () => boolean;
  getStepValidationErrors: (step: OnboardingStep) => string[];
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface StepValidation {
  step: OnboardingStep;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// API Types
export interface OnboardingSubmission {
  userId: string;
  positions: Position[];
  linkedinProfile: LinkedInProfile;
  resumeUrl?: string;
  hobbies: Hobby[];
  submittedAt: Date;
}

export interface OnboardingResponse {
  success: boolean;
  message: string;
  data?: OnboardingSubmission;
  errors?: string[];
}

// Constants
export const ONBOARDING_STEPS: Record<OnboardingStep, OnboardingStepConfig> = {
  1: {
    number: 1,
    title: 'Positions',
    description: 'Select up to 3 positions that interest you',
    icon: 'briefcase',
    isCompleted: false,
    isCurrent: true,
  },
  2: {
    number: 2,
    title: 'Profile',
    description: 'Connect your LinkedIn and upload your resume',
    icon: 'user',
    isCompleted: false,
    isCurrent: false,
  },
  3: {
    number: 3,
    title: 'Hobbies',
    description: 'Tell us about your interests and activities',
    icon: 'heart',
    isCompleted: false,
    isCurrent: false,
  },
};

export const POSITION_CATEGORIES: Record<PositionCategory, string> = {
  engineering: 'Engineering',
  data: 'Data & Analytics',
  product: 'Product & Design',
  business: 'Business & Operations',
  creative: 'Creative & Media',
  other: 'Other',
};

export const HOBBY_CATEGORIES: Record<HobbyCategory, string> = {
  sports: 'Sports & Fitness',
  creative: 'Creative Arts',
  intellectual: 'Intellectual',
  social: 'Social Activities',
  outdoor: 'Outdoor & Nature',
  technology: 'Technology',
  other: 'Other',
};

// Utility Types
export type OnboardingAction = 
  | { type: 'SET_CURRENT_STEP'; payload: OnboardingStep }
  | { type: 'UPDATE_POSITIONS'; payload: Position[] }
  | { type: 'UPDATE_LINKEDIN_PROFILE'; payload: LinkedInProfile }
  | { type: 'UPDATE_RESUME'; payload: ResumeFile | null }
  | { type: 'UPDATE_HOBBIES'; payload: Hobby[] }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'RESET_ONBOARDING' };

// Helper Functions
export const createPosition = (name: string, category: PositionCategory = 'other', isCustom = false): Position => ({
  id: `${category}-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
  name,
  category,
  isCustom,
});

export const createHobby = (name: string, category: HobbyCategory = 'other', isCustom = false, source?: 'resume' | 'suggested' | 'custom'): Hobby => ({
  id: `${category}-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
  name,
  category,
  isCustom,
  source,
});

export const createLinkedInProfile = (url: string): LinkedInProfile => ({
  url,
  isValid: validateLinkedInUrl(url),
  username: extractLinkedInUsername(url),
});

export const createResumeFile = (file: File): ResumeFile => {
  const validation = validateResumeFile(file);
  return {
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    isValid: validation.isValid,
    errorMessage: validation.errors[0],
  };
};

// Validation Functions
export const validateLinkedInUrl = (url: string): boolean => {
  const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
  return linkedInRegex.test(url);
};

export const extractLinkedInUsername = (url: string): string | undefined => {
  const match = url.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/);
  return match ? match[1] : undefined;
};

export const validateResumeFile = (file: File): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('Please upload a PDF, DOC, or DOCX file');
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    errors.push('File size must be less than 5MB');
  }

  // Check file name
  if (file.name.length > 100) {
    warnings.push('File name is quite long');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

export const validateOnboardingStep = (step: OnboardingStep, data: OnboardingData): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  switch (step) {
    case 1:
      if (data.positions.length === 0) {
        errors.push('Please select at least one position');
      }
      if (data.positions.length > data.maxPositions) {
        errors.push(`You can only select up to ${data.maxPositions} positions`);
      }
      break;

    case 2:
      if (!data.linkedinProfile.url) {
        errors.push('Please provide your LinkedIn profile URL');
      } else if (!data.linkedinProfile.isValid) {
        errors.push('Please provide a valid LinkedIn profile URL');
      }
      if (!data.resume) {
        errors.push('Please upload your resume');
      } else if (!data.resume.isValid) {
        errors.push(data.resume.errorMessage || 'Please upload a valid resume file');
      }
      break;

    case 3:
      if (data.hobbies.length === 0) {
        warnings.push('Adding hobbies helps us personalize your experience');
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}; 