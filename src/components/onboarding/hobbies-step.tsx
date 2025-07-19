'use client';

import { useState, useEffect } from 'react';
import { useOnboardingManager } from '@/hooks/use-onboarding-manager';
import { Heart, Plus, X, Check, FileText, ArrowLeft, Sparkles } from 'lucide-react';

// Mock hobbies that might be extracted from resume
const RESUME_BASED_HOBBIES = [
  'Reading',
  'Writing',
  'Photography',
  'Travel',
  'Cooking',
  'Gaming',
  'Fitness',
  'Music',
  'Art',
  'Technology',
  'Sports',
  'Volunteering',
  'Languages',
  'Puzzles',
  'Gardening'
];

const COMMON_HOBBIES = [
  'Hiking',
  'Swimming',
  'Cycling',
  'Yoga',
  'Meditation',
  'Dancing',
  'Painting',
  'Drawing',
  'Sculpting',
  'Knitting',
  'Woodworking',
  'Collecting',
  'Bird Watching',
  'Astronomy',
  'Chess',
  'Board Games',
  'Video Games',
  'Podcasting',
  'Blogging',
  'Vlogging'
];

export default function HobbiesStep() {
  const { hobbies, navigation, completion } = useOnboardingManager();
  const [customHobby, setCustomHobby] = useState('');
  const [suggestedHobbies, setSuggestedHobbies] = useState<string[]>([]);

  // Simulate extracting hobbies from resume
  useEffect(() => {
    if (hobbies.suggested.length > 0) {
      // In a real app, you would analyze the resume content here
      // For now, we'll randomly select some hobbies as suggestions
      const shuffled = [...RESUME_BASED_HOBBIES].sort(() => 0.5 - Math.random());
      setSuggestedHobbies(shuffled.slice(0, 5));
    }
  }, [hobbies.suggested]);

  const handleHobbyToggle = (hobbyName: string, source?: string) => {
    hobbies.toggle(hobbyName, 'other', source);
  };

  const handleAddCustomHobby = () => {
    if (customHobby.trim() && hobbies.canAdd) {
      hobbies.add(customHobby.trim(), 'other', true, 'custom');
      setCustomHobby('');
    }
  };

  const handleRemoveHobby = (hobbyId: string) => {
    hobbies.remove(hobbyId);
  };

  const handleComplete = async () => {
    try {
      await completion.complete();
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const handleBack = () => {
    navigation.previous();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8 sm:mb-12 px-4">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-4 sm:mb-6">
          <span className="text-xl sm:text-2xl font-bold text-primary">3</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
          What are your hobbies?
        </h1>
        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Tell us about your interests and activities outside of work. This helps us connect you with like-minded professionals.
        </p>
      </div>

      {/* Selected hobbies */}
      {hobbies.count > 0 && (
        <div className="mb-6 sm:mb-8 px-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Your hobbies
            </h3>
            <span className="text-xs sm:text-sm text-muted-foreground bg-muted px-2 sm:px-3 py-1 rounded-full">
              {hobbies.count} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {hobbies.selected.map((hobby) => (
              <div
                key={hobby.id}
                className="group flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-200"
              >
                <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="font-medium text-sm sm:text-base">{hobby.name}</span>
                <button
                  onClick={() => handleRemoveHobby(hobby.id)}
                  className="text-primary/60 hover:text-primary transition-colors duration-200 p-1"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6 sm:space-y-8 px-4">
        {/* Resume-based suggestions */}
        {suggestedHobbies.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground">Based on your resume</h3>
                <p className="text-muted-foreground text-sm sm:text-base">We found these interests in your profile</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {suggestedHobbies.map((hobby) => (
                <button
                  key={hobby}
                  onClick={() => handleHobbyToggle(hobby, 'resume')}
                  className={`group p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-md touch-manipulation ${
                    hobbies.isSelected(hobby)
                      ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 text-primary shadow-sm shadow-primary/10'
                      : 'border-border hover:border-primary/40 hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs sm:text-sm">{hobby}</span>
                    {hobbies.isSelected(hobby) ? (
                      <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded-full">
                        <Check className="h-2 w-2 sm:h-3 sm:w-3 text-primary-foreground" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-border group-hover:border-primary/40 transition-colors duration-200" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Common hobbies */}
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">Popular hobbies</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Discover activities that interest you</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {COMMON_HOBBIES.map((hobby) => (
              <button
                key={hobby}
                onClick={() => handleHobbyToggle(hobby, 'suggested')}
                className={`group p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-md touch-manipulation ${
                  hobbies.isSelected(hobby)
                    ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 text-primary shadow-sm shadow-primary/10'
                    : 'border-border hover:border-primary/40 hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs sm:text-sm">{hobby}</span>
                  {hobbies.isSelected(hobby) ? (
                    <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded-full">
                      <Check className="h-2 w-2 sm:h-3 sm:w-3 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-border group-hover:border-primary/40 transition-colors duration-200" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom hobby input */}
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Add a custom hobby</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={customHobby}
              onChange={(e) => setCustomHobby(e.target.value)}
              placeholder="Enter a hobby not listed above..."
              className="flex-1 px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background transition-all duration-200 text-sm sm:text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomHobby()}
            />
            <button
              onClick={handleAddCustomHobby}
              disabled={!customHobby.trim() || !hobbies.canAdd}
              className="px-4 sm:px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 touch-manipulation"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 sm:mt-12 px-4">
        <button
          onClick={handleBack}
          className="group px-4 sm:px-6 py-2 sm:py-3 border border-border rounded-xl hover:bg-muted font-semibold transition-all duration-200 flex items-center gap-2 touch-manipulation text-sm sm:text-base"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <button
          onClick={handleComplete}
          className="group px-6 sm:px-8 py-2 sm:py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 flex items-center gap-2 touch-manipulation text-sm sm:text-base"
        >
          <span>Complete Setup</span>
          <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
} 