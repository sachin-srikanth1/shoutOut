'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  placeholder,
  className = ""
}: SearchBarProps) {
  const searchTexts = [
    "Search for colleagues to recognize...",
    "Search for recognition messages...",
    "Search for team recognition activity...",
    "Search your shoutout history..."
  ];
  
  const [displayPlaceholder, setDisplayPlaceholder] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = searchTexts[currentTextIndex];
    
    if (!isDeleting) {
      if (currentIndex < currentText.length) {
        const timer = setTimeout(() => {
          setDisplayPlaceholder(currentText.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, 120); // Increased from 80ms to 120ms

        return () => clearTimeout(timer);
      } else {
        // Wait before starting to delete
        const waitTimer = setTimeout(() => {
          setIsDeleting(true);
        }, 3000); // Increased from 2000ms to 3000ms

        return () => clearTimeout(waitTimer);
      }
    } else {
      if (currentIndex > 0) {
        const timer = setTimeout(() => {
          setDisplayPlaceholder(currentText.slice(0, currentIndex - 1));
          setCurrentIndex(currentIndex - 1);
        }, 80); // Increased from 50ms to 80ms

        return () => clearTimeout(timer);
      } else {
        // Move to next text
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % searchTexts.length);
        setCurrentIndex(0);
      }
    }
  }, [currentIndex, currentTextIndex, isDeleting, searchTexts]);

  return (
    <div className={`relative max-w-md mx-auto ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={displayPlaceholder}
          style={{ border: '1px solid rgba(168, 85, 247, 0.3)' }}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-purple-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        />
      </div>
    </div>
  );
} 