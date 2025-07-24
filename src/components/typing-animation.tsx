'use client';

import { useState, useEffect } from 'react';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  className?: string;
}

export default function TypingAnimation({ text, speed = 50, className = '' }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      setIsTypingComplete(true);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={`text-purple-400 transition-opacity duration-1000 ${isTypingComplete ? 'opacity-100' : 'opacity-70'} ${className}`}>
      {displayedText}
    </span>
  );
} 