'use client';

import { useState, useRef } from 'react';
import { useOnboardingManager } from '@/hooks/use-onboarding-manager';
import { Upload, FileText, Linkedin, X, Check, ArrowLeft, ArrowRight } from 'lucide-react';

export default function ProfileStep() {
  const { profile, navigation } = useOnboardingManager();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLinkedinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    profile.updateLinkedin(e.target.value);
  };

  const handleFileSelect = (file: File) => {
    profile.updateResume(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveResume = () => {
    profile.removeResume();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNext = () => {
    if (profile.isLinkedinValid && profile.hasResume) {
      navigation.next();
    }
  };

  const handleBack = () => {
    navigation.previous();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8 sm:mb-12 px-4">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-4 sm:mb-6">
          <span className="text-xl sm:text-2xl font-bold text-primary">2</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
          Professional Profile
        </h1>
        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Help us understand your background better by providing your LinkedIn profile and resume.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8 px-4">
        {/* LinkedIn Profile */}
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full">
              <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">LinkedIn Profile</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Connect your professional network</p>
            </div>
          </div>
          <input
            type="url"
            value={profile.linkedin.url}
            onChange={handleLinkedinChange}
            placeholder="https://linkedin.com/in/your-profile"
            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background transition-all duration-200 text-sm sm:text-base"
          />
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3">
            This helps us verify your professional background and connect you with relevant opportunities.
          </p>
        </div>

        {/* Resume Upload */}
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">Resume Upload</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Share your experience and skills</p>
            </div>
          </div>

          {profile.resume ? (
            <div className="border border-border rounded-xl p-4 sm:p-6 bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-full">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm sm:text-base">{profile.resume.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {(profile.resume.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1 sm:gap-2 text-green-600">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Uploaded</span>
                  </div>
                  <button
                    onClick={handleRemoveResume}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all duration-300 ${
                isDragging
                  ? 'border-primary bg-primary/5 scale-[1.02]'
                  : 'border-border hover:border-primary/40 hover:bg-muted/20'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mx-auto mb-4 sm:mb-6">
                <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                Upload your resume
              </h4>
              <p className="text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
                Drag and drop your resume here, or click the button below to browse your files
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 sm:px-8 py-2 sm:py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 touch-manipulation text-sm sm:text-base"
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
                Supported formats: PDF, DOC, DOCX (max 5MB)
              </p>
            </div>
          )}
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
          onClick={handleNext}
          disabled={!profile.isLinkedinValid || !profile.hasResume}
          className="group px-6 sm:px-8 py-2 sm:py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 flex items-center gap-2 touch-manipulation text-sm sm:text-base"
        >
          <span>Continue</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
} 