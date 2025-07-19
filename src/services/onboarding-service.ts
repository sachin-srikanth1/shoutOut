import { 
  OnboardingData, 
  OnboardingSubmission, 
  OnboardingResponse, 
  Position, 
  Hobby, 
  LinkedInProfile, 
  ResumeFile,
  ValidationResult,
  validateOnboardingStep,
  createPosition,
  createHobby,
  createLinkedInProfile,
  createResumeFile
} from '@/types/onboarding';
import { DEFAULT_ONBOARDING_CONFIG } from '@/data/onboarding-options';

export class OnboardingService {
  private static instance: OnboardingService;
  private storageKey = 'netch_onboarding_data';

  private constructor() {}

  public static getInstance(): OnboardingService {
    if (!OnboardingService.instance) {
      OnboardingService.instance = new OnboardingService();
    }
    return OnboardingService.instance;
  }

  // Local Storage Management
  public saveToLocalStorage(data: OnboardingData): void {
    try {
      const serializedData = JSON.stringify(data, (key, value) => {
        // Handle File objects specially
        if (value instanceof File) {
          return {
            name: value.name,
            size: value.size,
            type: value.type,
            lastModified: value.lastModified,
            // Note: We can't serialize the actual file content
            // This is just for metadata
          };
        }
        return value;
      });
      localStorage.setItem(this.storageKey, serializedData);
    } catch (error) {
      console.error('Failed to save onboarding data to localStorage:', error);
    }
  }

  public loadFromLocalStorage(): OnboardingData | null {
    try {
      const serializedData = localStorage.getItem(this.storageKey);
      if (!serializedData) return null;

      const data = JSON.parse(serializedData);
      
      // Convert back to proper types
      if (data.resume && typeof data.resume === 'object') {
        // Note: We can't fully restore the File object from localStorage
        // The actual file would need to be re-uploaded
        data.resume = null;
      }

      return data;
    } catch (error) {
      console.error('Failed to load onboarding data from localStorage:', error);
      return null;
    }
  }

  public clearLocalStorage(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to clear onboarding data from localStorage:', error);
    }
  }

  // Data Validation
  public validateStep(step: number, data: OnboardingData): ValidationResult {
    return validateOnboardingStep(step as any, data);
  }

  public validateCompleteOnboarding(data: OnboardingData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate all required steps
    for (let step = 1; step <= 3; step++) {
      const stepValidation = this.validateStep(step, data);
      if (!stepValidation.isValid) {
        errors.push(...stepValidation.errors);
      }
      warnings.push(...stepValidation.warnings);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Position Management
  public addPosition(name: string, category: string = 'other', isCustom: boolean = false): Position {
    return createPosition(name, category as any, isCustom);
  }

  public removePosition(positions: Position[], positionId: string): Position[] {
    return positions.filter(pos => pos.id !== positionId);
  }

  public canAddPosition(positions: Position[]): boolean {
    return positions.length < DEFAULT_ONBOARDING_CONFIG.maxPositions;
  }

  // Hobby Management
  public addHobby(name: string, category: string = 'other', isCustom: boolean = false, source?: string): Hobby {
    return createHobby(name, category as any, isCustom, source as any);
  }

  public removeHobby(hobbies: Hobby[], hobbyId: string): Hobby[] {
    return hobbies.filter(hobby => hobby.id !== hobbyId);
  }

  public canAddHobby(hobbies: Hobby[]): boolean {
    return hobbies.length < DEFAULT_ONBOARDING_CONFIG.maxHobbies;
  }

  // Profile Management
  public updateLinkedInProfile(url: string): LinkedInProfile {
    return createLinkedInProfile(url);
  }

  public updateResume(file: File | null): ResumeFile | null {
    if (!file) return null;
    return createResumeFile(file);
  }

  // Step Navigation
  public canProceedToNextStep(currentStep: number, data: OnboardingData): boolean {
    const validation = this.validateStep(currentStep, data);
    return validation.isValid;
  }

  public getNextStep(currentStep: number): number | null {
    if (currentStep < 3) {
      return currentStep + 1;
    }
    return null;
  }

  public getPreviousStep(currentStep: number): number | null {
    if (currentStep > 1) {
      return currentStep - 1;
    }
    return null;
  }

  // API Integration
  public async submitOnboarding(userId: string, data: OnboardingData): Promise<OnboardingResponse> {
    try {
      // Validate complete onboarding data
      const validation = this.validateCompleteOnboarding(data);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Onboarding data is invalid',
          errors: validation.errors,
        };
      }

      // Prepare submission data
      const submission: OnboardingSubmission = {
        userId,
        positions: data.positions,
        linkedinProfile: data.linkedinProfile,
        resumeUrl: data.resume ? await this.uploadResume(data.resume) : undefined,
        hobbies: data.hobbies,
        submittedAt: new Date(),
      };

      // Make API call (replace with your actual API endpoint)
      const response = await this.makeApiCall('/api/onboarding/submit', {
        method: 'POST',
        body: JSON.stringify(submission),
      });

      if (response.success) {
        // Clear local storage on successful submission
        this.clearLocalStorage();
      }

      return response;
    } catch (error) {
      console.error('Failed to submit onboarding:', error);
      return {
        success: false,
        message: 'Failed to submit onboarding data',
        errors: ['Network error or server issue'],
      };
    }
  }

  private async uploadResume(resumeFile: ResumeFile): Promise<string> {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('resume', resumeFile.file);

             // Make file upload API call (replace with your actual upload endpoint)
       const response = await this.makeApiCall('/api/upload/resume', {
         method: 'POST',
         body: formData,
         headers: {
           // Don't set Content-Type for FormData, let the browser set it
         },
       });

       if (response.success && response.data && 'url' in response.data) {
         return (response.data as any).url;
       }

      throw new Error('Failed to upload resume');
    } catch (error) {
      console.error('Failed to upload resume:', error);
      throw error;
    }
  }

  private async makeApiCall(endpoint: string, options: RequestInit): Promise<OnboardingResponse> {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Analytics and Tracking
  public trackStepCompletion(step: number, data: OnboardingData): void {
    try {
      // Track step completion for analytics
      const stepData = {
        step,
        completedAt: new Date(),
        hasPositions: data.positions.length > 0,
        hasLinkedIn: !!data.linkedinProfile.url,
        hasResume: !!data.resume,
        hasHobbies: data.hobbies.length > 0,
      };

      // Send to analytics service (replace with your analytics implementation)
      this.sendAnalytics('step_completed', stepData);
    } catch (error) {
      console.error('Failed to track step completion:', error);
    }
  }

  public trackOnboardingCompletion(data: OnboardingData): void {
    try {
      const completionData = {
        completedAt: new Date(),
        totalSteps: 3,
        positionsCount: data.positions.length,
        hobbiesCount: data.hobbies.length,
        hasLinkedIn: !!data.linkedinProfile.url,
        hasResume: !!data.resume,
        timeToComplete: data.completedAt ? 
          data.completedAt.getTime() - data.startedAt.getTime() : 0,
      };

      this.sendAnalytics('onboarding_completed', completionData);
    } catch (error) {
      console.error('Failed to track onboarding completion:', error);
    }
  }

  private sendAnalytics(event: string, data: any): void {
    // Replace with your analytics implementation (Google Analytics, Mixpanel, etc.)
    console.log('Analytics Event:', event, data);
    
    // Example with Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, data);
    }
  }

  // Utility Methods
  public getProgressPercentage(data: OnboardingData): number {
    const totalSteps = 3;
    const completedSteps = data.completedSteps.length;
    return Math.round((completedSteps / totalSteps) * 100);
  }

  public isStepCompleted(step: number, data: OnboardingData): boolean {
    return data.completedSteps.includes(step as any);
  }

  public markStepCompleted(step: number, data: OnboardingData): OnboardingData {
    if (!this.isStepCompleted(step, data)) {
      return {
        ...data,
        completedSteps: [...data.completedSteps, step as any],
        lastUpdated: new Date(),
      };
    }
    return data;
  }

  public createInitialData(): OnboardingData {
    return {
      currentStep: 1,
      completedSteps: [],
      positions: [],
      maxPositions: DEFAULT_ONBOARDING_CONFIG.maxPositions,
      linkedinProfile: { url: '', isValid: false },
      resume: null,
      hobbies: [],
      isCompleted: false,
      startedAt: new Date(),
      lastUpdated: new Date(),
    };
  }
}

// Export singleton instance
export const onboardingService = OnboardingService.getInstance(); 