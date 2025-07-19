'use client';

import { useState } from 'react';
import { useOnboardingManager } from '@/hooks/use-onboarding-manager';
import { Check, Plus, X, ArrowRight } from 'lucide-react';

const POSITION_OPTIONS = [
  'Software Engineering',
  'Data Science',
  'Product Management',
  'Consulting',
  'Marketing',
  'Sales',
  'Design',
  'Finance',
  'Human Resources',
  'Operations',
  'Research',
  'Education',
  'Healthcare',
  'Legal',
  'Other'
];

export default function PositionStep() {
  const { positions, navigation } = useOnboardingManager();
  const [customPosition, setCustomPosition] = useState('');

  const handlePositionToggle = (positionName: string) => {
    positions.toggle(positionName, 'other');
  };

  const handleAddCustomPosition = () => {
    if (customPosition.trim() && positions.canAdd) {
      positions.add(customPosition.trim(), 'other', true);
      setCustomPosition('');
    }
  };

  const handleRemovePosition = (positionId: string) => {
    positions.remove(positionId);
  };

  const handleNext = () => {
    if (positions.count > 0) {
      navigation.next();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8 sm:mb-12 px-4">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-4 sm:mb-6">
          <span className="text-xl sm:text-2xl font-bold text-primary">1</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
          What positions interest you?
        </h1>
        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Select up to 3 positions or fields that match your career interests. This helps us personalize your experience.
        </p>
      </div>

      {/* Selected positions */}
      {positions.count > 0 && (
        <div className="mb-6 sm:mb-8 px-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              Selected positions
            </h3>
            <span className="text-xs sm:text-sm text-muted-foreground bg-muted px-2 sm:px-3 py-1 rounded-full">
              {positions.count}/{positions.maxCount}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {positions.selected.map((position) => (
              <div
                key={position.id}
                className="group flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-200"
              >
                <span className="font-medium text-sm sm:text-base">{position.name}</span>
                <button
                  onClick={() => handleRemovePosition(position.id)}
                  className="text-primary/60 hover:text-primary transition-colors duration-200 p-1"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Position options grid */}
      <div className="mb-8 sm:mb-10 px-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
          Choose from popular positions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {POSITION_OPTIONS.map((positionName) => (
            <button
              key={positionName}
              onClick={() => handlePositionToggle(positionName)}
              disabled={!positions.isSelected(positionName) && !positions.canAdd}
              className={`group p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg hover:shadow-primary/5 touch-manipulation ${
                positions.isSelected(positionName)
                  ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 text-primary shadow-md shadow-primary/10'
                  : 'border-border hover:border-primary/40 hover:bg-muted/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:bg-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm sm:text-base">{positionName}</span>
                {positions.isSelected(positionName) ? (
                  <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                  </div>
                ) : (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-border group-hover:border-primary/40 transition-colors duration-200" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom position input */}
      <div className="mb-8 sm:mb-12 px-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Add a custom position</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customPosition}
            onChange={(e) => setCustomPosition(e.target.value)}
            placeholder="Enter a position not listed above..."
            disabled={!positions.canAdd}
            className="flex-1 px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 bg-background transition-all duration-200 text-sm sm:text-base"
            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomPosition()}
          />
          <button
            onClick={handleAddCustomPosition}
            disabled={!customPosition.trim() || !positions.canAdd}
            className="px-4 sm:px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 touch-manipulation"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end px-4">
        <button
          onClick={handleNext}
          disabled={positions.count === 0}
          className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2 touch-manipulation"
        >
          <span>Continue</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
} 