'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Users, Filter, Search, MapPin, Building, Star, Heart } from 'lucide-react';
import { useRef } from 'react';

interface Profile {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  matchScore: number;
  skills: string[];
  bio: string;
  avatar?: string;
}

// Typing animation component (copied from dashboard)
function TypingAnimation({ text, speed = 100 }: { text: string; speed?: number }) {
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

// Typing/cycling animation for search bar placeholder
function CyclingPlaceholder({ options, speed = 60, pause = 1200 }: { options: string[]; speed?: number; pause?: number }) {
  const [displayText, setDisplayText] = useState(options[0]);
  const [currentOption, setCurrentOption] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTyping) {
      if (currentIndex < options[currentOption].length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(options[currentOption].slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, speed);
      } else {
        setIsTyping(false);
        timeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, pause);
      }
    } else {
      timeoutRef.current = setTimeout(() => {
        setCurrentOption((currentOption + 1) % options.length);
        setCurrentIndex(0);
        setIsTyping(true);
      }, pause);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isTyping, currentIndex, currentOption, options, speed, pause]);

  return displayText;
}

export default function NetworkPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showScorePopover, setShowScorePopover] = useState(false);
  const heartRef = useRef<HTMLDivElement>(null);
  const [showMoveConfirm, setShowMoveConfirm] = useState(false);
  const [moveChecked, setMoveChecked] = useState(false);

  // Close popover when clicking outside
  useEffect(() => {
    if (!showScorePopover) return;
    function handleClick(e: MouseEvent) {
      if (heartRef.current && !heartRef.current.contains(e.target as Node)) {
        setShowScorePopover(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showScorePopover]);

  const profiles: Profile[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Senior Product Manager',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      matchScore: 95,
      skills: ['Product Strategy', 'User Research', 'Agile'],
      bio: 'Experienced PM with 8+ years in fintech and e-commerce. Passionate about user-centered design and data-driven decisions.'
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      role: 'Engineering Manager',
      company: 'InnovateLab',
      location: 'Austin, TX',
      matchScore: 88,
      skills: ['Team Leadership', 'Python', 'AWS', 'Microservices'],
      bio: 'Engineering leader focused on building scalable systems and mentoring junior developers. Previously at Google and Microsoft.'
    },
    {
      id: '3',
      name: 'Emily Watson',
      role: 'UX Designer',
      company: 'DesignStudio',
      location: 'New York, NY',
      matchScore: 92,
      skills: ['Figma', 'User Testing', 'Design Systems', 'Prototyping'],
      bio: 'Creative designer with expertise in mobile apps and web platforms. Led design for 3 successful startup exits.'
    },
    {
      id: '4',
      name: 'David Kim',
      role: 'Data Scientist',
      company: 'AnalyticsPro',
      location: 'Seattle, WA',
      matchScore: 85,
      skills: ['Machine Learning', 'Python', 'SQL', 'TensorFlow'],
      bio: 'ML specialist with PhD in Computer Science. Built recommendation systems used by millions of users.'
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      role: 'Marketing Director',
      company: 'GrowthCo',
      location: 'Los Angeles, CA',
      matchScore: 90,
      skills: ['Digital Marketing', 'Brand Strategy', 'Growth Hacking'],
      bio: 'Marketing leader with track record of 10x growth for SaaS companies. Expert in B2B marketing and customer acquisition.'
    },
    {
      id: '6',
      name: 'James Wilson',
      role: 'Frontend Developer',
      company: 'WebTech',
      location: 'Chicago, IL',
      matchScore: 87,
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      bio: 'Full-stack developer specializing in modern web technologies. Built 50+ production applications.'
    }
  ];

  // Add headshot, LinkedIn, and email to profiles for demo
  const demoHeadshots = [
    '/profile1.png', '/profile2.png', '/profile3.png', '/profile4.png', '/profile5.png', '/profile6.png'
  ];
  const demoLinkedIns = [
    'https://linkedin.com/in/sarahchen',
    'https://linkedin.com/in/michaelrodriguez',
    'https://linkedin.com/in/emilywatson',
    'https://linkedin.com/in/davidkim',
    'https://linkedin.com/in/lisathompson',
    'https://linkedin.com/in/jameswilson'
  ];
  const demoEmails = [
    'sarah.chen@email.com',
    'michael.rodriguez@email.com',
    'emily.watson@email.com',
    'david.kim@email.com',
    'lisa.thompson@email.com',
    'james.wilson@email.com'
  ];
  profiles.forEach((p, i) => {
    p.avatar = demoHeadshots[i % demoHeadshots.length];
    (p as any).linkedin = demoLinkedIns[i % demoLinkedIns.length];
    (p as any).email = demoEmails[i % demoEmails.length];
  });

  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');
  const [typing, setTyping] = useState(false);

  // Typing animation for email
  const sampleEmail = `Hi {name},\n\nI came across your profile on Netch.ai and was impressed by your background in {role} at {company}. I would love to connect and learn more about your experience.\n\nBest,\n[Your Name]`;
  const startEmailTyping = useCallback(() => {
    setShowEmailModal(true);
    setEmailDraft('');
    setTyping(true);
    let i = 0;
    const text = sampleEmail
      .replace('{name}', selectedProfile?.name || '')
      .replace('{role}', selectedProfile?.role || '')
      .replace('{company}', selectedProfile?.company || '');
    function type() {
      if (i <= text.length) {
        setEmailDraft(text.slice(0, i));
        i++;
        setTimeout(type, 18);
      } else {
        setTyping(false);
      }
    }
    setTimeout(type, 400);
  }, [selectedProfile]);

  const closeEmailModal = () => {
    setShowEmailModal(false);
    setTyping(false);
    setEmailDraft('');
  };

  const filters = [
    { id: 'all', label: 'All Profiles' },
    { id: 'high-match', label: 'High Match (90%+)' },
    { id: 'same-industry', label: 'Same Industry' },
    { id: 'same-location', label: 'Same Location' }
  ];

  const sortOptions = [
    { id: 'match', label: 'Netch Score' },
    { id: 'company', label: 'Company' },
    { id: 'role', label: 'Role' },
    { id: 'location', label: 'Location' }
  ];

  const filteredProfiles = profiles
    .filter(profile => {
      const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          profile.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          profile.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      switch (selectedFilter) {
        case 'high-match':
          return profile.matchScore >= 90;
        case 'same-industry':
          return profile.company.includes('Tech') || profile.company.includes('Lab');
        case 'same-location':
          return profile.location.includes('San Francisco') || profile.location.includes('CA');
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.matchScore - a.matchScore;
        case 'company':
          return a.company.localeCompare(b.company);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

  // Remove in-progress logic, just use filteredProfiles as recommendedProfiles
  const recommendedProfiles = filteredProfiles;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-medium text-foreground">Recommended Profiles</h1>
          </div>
          <p><TypingAnimation text="Connect with the right people for your goals..." speed={70} /></p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={CyclingPlaceholder({
                options: [
                  'Search by company...',
                  'Search by role...',
                  'Search by location...',
                  'Search by university...',
                  'Search by organization...'
                ],
                speed: 60,
                pause: 1200
              })}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: '1px solid rgba(168, 85, 247, 0.3)' }}
              className="w-full pl-10 pr-4 py-3 bg-card/50 backdrop-blur-sm rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
            />
          </div>

          {/* Sort By Button Group */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Sort by:</span>
            {sortOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                  sortBy === option.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {recommendedProfiles.length} of {profiles.length} profiles
        </div>

        {/* In-depth Profile View Layout */}
        {selectedProfile ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Other profiles, smaller, and action buttons below */}
            <div className="flex-1 max-w-xs flex flex-col justify-between" style={{ minHeight: '540px' }}>
              <div className="space-y-4">
                {recommendedProfiles.filter(p => p.id !== selectedProfile.id).map(profile => (
                  <div
                    key={profile.id}
                    style={{ border: '1px solid rgba(168, 85, 247, 0.15)' }}
                    className="p-3 rounded-lg bg-card/50 backdrop-blur-sm hover:shadow-md hover:border-purple-300 transition-all duration-200 cursor-pointer opacity-80 hover:opacity-100"
                    onClick={() => setSelectedProfile(profile)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="min-w-0">
                        <h4 className="text-base font-semibold text-foreground truncate">{profile.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{profile.role}</p>
                      </div>
                      <span className="text-xs font-medium text-foreground">{profile.matchScore}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{profile.bio}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 mt-8 items-stretch">
                {/* Move to In-Progress button removed */}
                <button
                  className="px-3 py-1.5 text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200 rounded-md hover:bg-purple-100 hover:border-purple-400 transition-all shadow-sm"
                  onClick={startEmailTyping}
                >
                  Generate Email
                </button>
                <button className="text-sm text-muted-foreground underline hover:text-purple-600 underline-offset-2 transition-colors px-1 py-0.5 rounded text-left" onClick={() => setSelectedProfile(null)}>
                  Back to all profiles
                </button>
              </div>
            </div>
            {/* Right: In-depth profile */}
            <div className="flex-[2] p-8 rounded-lg bg-card/70 border border-purple-200 shadow-lg">
              <div className="flex items-center gap-6 mb-6">
                <img
                  src={selectedProfile.avatar || '/profile1.png'}
                  alt={selectedProfile.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-purple-200 shadow"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-1">{selectedProfile.name}</h2>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg text-muted-foreground">{selectedProfile.role}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{selectedProfile.company}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{selectedProfile.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <a href={(selectedProfile as any).linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">LinkedIn</a>
                    <span className="text-sm text-muted-foreground">|</span>
                    <a href={`mailto:${(selectedProfile as any).email}`} className="text-purple-700 hover:underline text-sm">{(selectedProfile as any).email}</a>
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-2 relative select-none" ref={heartRef}>
                  <button
                    className="flex items-center gap-1 group focus:outline-none"
                    onClick={() => setShowScorePopover(v => !v)}
                    aria-label="Explain Netch Score"
                  >
                    <Heart className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
                    <span className="text-base font-semibold text-foreground">{selectedProfile.matchScore}%</span>
                  </button>
                  {showScorePopover && (
                    <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-card border border-purple-100 rounded-lg shadow-lg p-3 z-20 animate-fade-in">
                      <div className="text-xs font-semibold text-purple-700 mb-2">Why this score?</div>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
                        <li>Industry match</li>
                        <li>Location</li>
                        <li>Role</li>
                        <li>Shared interests</li>
                        <li>Experience</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              {/* Placeholder Move to In-Progress Checkbox and Actions */}
              <div className="flex flex-col gap-2 items-start mt-2 mb-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={moveChecked}
                    onChange={() => setShowMoveConfirm(true)}
                    className="accent-purple-500 w-4 h-4 rounded border border-purple-200 focus:ring-0 focus:outline-none transition-all"
                  />
                  <span className="text-sm text-foreground font-medium">Move to In-Progress</span>
                </label>
                {/* Confirm popup */}
                {showMoveConfirm && (
                  <div className="mt-2 bg-white dark:bg-card border border-purple-100 rounded-lg shadow-lg p-4 z-20 animate-fade-in flex flex-col gap-3 min-w-[220px]">
                    <span className="text-sm text-foreground">Are you sure you want to move this profile to In-Progress?</span>
                    <div className="flex gap-2 justify-end">
                      <button
                        className="px-3 py-1 text-sm font-medium bg-muted/60 text-foreground rounded-md hover:bg-muted/80 transition-all"
                        onClick={() => { setShowMoveConfirm(false); setMoveChecked(false); }}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-3 py-1 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all"
                        onClick={() => { setShowMoveConfirm(false); setMoveChecked(true); }}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
                <button
                  className="px-3 py-1.5 text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200 rounded-md hover:bg-purple-100 hover:border-purple-400 transition-all shadow-sm"
                  onClick={startEmailTyping}
                >
                  Generate Email
                </button>
                <button className="text-sm text-muted-foreground underline hover:text-purple-600 underline-offset-2 transition-colors px-1 py-0.5 rounded text-left" onClick={() => setSelectedProfile(null)}>
                  Back to all profiles
                </button>
              </div>
              <div className="mb-4">
                <h3 className="text-md font-semibold text-foreground mb-1">Bio</h3>
                <p className="text-sm text-muted-foreground">{selectedProfile.bio}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-md font-semibold text-foreground mb-1">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Inline Generated Email Box */}
              {showEmailModal && (
                <div className="mt-8 bg-muted/40 dark:bg-card/60 p-4 rounded-xl border border-purple-100/40">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-semibold text-foreground">Generated Email</h3>
                    <button className="text-xl text-muted-foreground hover:text-purple-500 px-2 transition-colors" onClick={closeEmailModal}>&times;</button>
                  </div>
                  <textarea
                    className="w-full min-h-[120px] p-2 border border-purple-100/40 rounded-md text-sm text-foreground bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-300 focus:border-purple-400 transition-all duration-200 placeholder:text-muted-foreground"
                    value={emailDraft}
                    onChange={e => setEmailDraft(e.target.value)}
                    disabled={typing}
                    placeholder="Your email will appear here..."
                  />
                  <div className="flex justify-end mt-3">
                    {!typing && (
                      <button className="px-4 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium shadow-sm" onClick={() => {/* send email logic */}}>
                        Send Email
                      </button>
                    )}
                  </div>
                </div>
              )}
              {/* Sent email section removed */}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProfiles.map((profile) => (
              <div
                key={profile.id}
                style={{ border: '1px solid rgba(168, 85, 247, 0.3)' }}
                className="p-6 rounded-lg bg-card/50 backdrop-blur-sm hover:shadow-lg hover:border-purple-300 transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground truncate">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{profile.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Building className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{profile.company}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{profile.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Heart className="h-3 w-3 text-red-500" />
                    <span className="text-xs font-medium text-foreground">{profile.matchScore}%</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{profile.bio}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {profile.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {profile.skills.length > 3 && (
                    <span className="px-2 py-1 text-xs text-muted-foreground">
                      +{profile.skills.length - 3} more
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  {/* Removed mutual connections display */}
                  <button
                    className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    onClick={() => setSelectedProfile(profile)}
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {recommendedProfiles.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No profiles found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters to find more matches.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 