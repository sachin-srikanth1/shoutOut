'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { ListChecks } from 'lucide-react';
import { useState, useEffect } from 'react';

// Typing animation component (copied from recommended page)
function TypingAnimation({ text, speed = 70 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      setIsTypingComplete(true);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={`text-purple-400 transition-opacity duration-1000 ${isTypingComplete ? 'opacity-100' : 'opacity-70'}`}>
      {displayText}
    </span>
  );
}

// No in-progress logic needed

export default function InProgressPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-medium text-foreground">In-Progress Connections</h1>
          </div>
          <p><TypingAnimation text="Track your ongoing connections..." speed={70} /></p>
        </div>

        {/* In-Progress Profiles List */}
        <div className="text-center py-12">
          <ListChecks className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No in-progress connections yet</h3>
          <p className="text-muted-foreground">Connections you start will appear here as you make progress.</p>
        </div>
      </div>
    </DashboardLayout>
  );
} 