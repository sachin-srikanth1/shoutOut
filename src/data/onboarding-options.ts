import { PositionOption, HobbyOption, PositionCategory, HobbyCategory } from '@/types/onboarding';

// Predefined Position Options
export const POSITION_OPTIONS: PositionOption[] = [
  // Engineering
  { name: 'Software Engineering', category: 'engineering', description: 'Develop software applications and systems' },
  { name: 'Frontend Development', category: 'engineering', description: 'Build user interfaces and web applications' },
  { name: 'Backend Development', category: 'engineering', description: 'Develop server-side applications and APIs' },
  { name: 'Full Stack Development', category: 'engineering', description: 'Work on both frontend and backend systems' },
  { name: 'DevOps Engineering', category: 'engineering', description: 'Manage infrastructure and deployment processes' },
  { name: 'Mobile Development', category: 'engineering', description: 'Build mobile applications for iOS and Android' },
  { name: 'QA Engineering', category: 'engineering', description: 'Ensure software quality through testing' },
  
  // Data & Analytics
  { name: 'Data Science', category: 'data', description: 'Analyze data to extract insights and build models' },
  { name: 'Data Engineering', category: 'data', description: 'Build data pipelines and infrastructure' },
  { name: 'Data Analytics', category: 'data', description: 'Analyze business data and create reports' },
  { name: 'Machine Learning', category: 'data', description: 'Develop AI and ML models' },
  { name: 'Business Intelligence', category: 'data', description: 'Create dashboards and data visualizations' },
  
  // Product & Design
  { name: 'Product Management', category: 'product', description: 'Lead product strategy and development' },
  { name: 'UX/UI Design', category: 'product', description: 'Design user experiences and interfaces' },
  { name: 'Product Design', category: 'product', description: 'Create product concepts and prototypes' },
  { name: 'Graphic Design', category: 'product', description: 'Create visual content and branding' },
  { name: 'User Research', category: 'product', description: 'Conduct user research and usability testing' },
  
  // Business & Operations
  { name: 'Consulting', category: 'business', description: 'Provide strategic advice to organizations' },
  { name: 'Marketing', category: 'business', description: 'Develop and execute marketing strategies' },
  { name: 'Sales', category: 'business', description: 'Drive revenue through customer relationships' },
  { name: 'Finance', category: 'business', description: 'Manage financial planning and analysis' },
  { name: 'Human Resources', category: 'business', description: 'Manage talent and organizational development' },
  { name: 'Operations', category: 'business', description: 'Optimize business processes and efficiency' },
  { name: 'Project Management', category: 'business', description: 'Lead projects and coordinate teams' },
  { name: 'Business Development', category: 'business', description: 'Identify and pursue growth opportunities' },
  
  // Creative & Media
  { name: 'Content Creation', category: 'creative', description: 'Create engaging content for various platforms' },
  { name: 'Video Production', category: 'creative', description: 'Produce video content and multimedia' },
  { name: 'Photography', category: 'creative', description: 'Capture and edit visual content' },
  { name: 'Social Media Management', category: 'creative', description: 'Manage social media presence and strategy' },
  { name: 'Brand Management', category: 'creative', description: 'Develop and maintain brand identity' },
  
  // Other
  { name: 'Research', category: 'other', description: 'Conduct academic or industry research' },
  { name: 'Education', category: 'other', description: 'Teach and develop educational content' },
  { name: 'Healthcare', category: 'other', description: 'Work in healthcare and medical fields' },
  { name: 'Legal', category: 'other', description: 'Provide legal services and counsel' },
  { name: 'Non-profit', category: 'other', description: 'Work in non-profit and social impact' },
];

// Predefined Hobby Options
export const HOBBY_OPTIONS: HobbyOption[] = [
  // Sports & Fitness
  { name: 'Hiking', category: 'sports', description: 'Explore trails and nature', isPopular: true },
  { name: 'Swimming', category: 'sports', description: 'Swim for fitness and recreation' },
  { name: 'Cycling', category: 'sports', description: 'Ride bikes for exercise and transport', isPopular: true },
  { name: 'Running', category: 'sports', description: 'Jog or run for fitness', isPopular: true },
  { name: 'Yoga', category: 'sports', description: 'Practice yoga for wellness', isPopular: true },
  { name: 'Meditation', category: 'sports', description: 'Practice mindfulness and meditation' },
  { name: 'Weightlifting', category: 'sports', description: 'Build strength through resistance training' },
  { name: 'Tennis', category: 'sports', description: 'Play tennis for recreation' },
  { name: 'Basketball', category: 'sports', description: 'Play basketball for fun and fitness' },
  { name: 'Soccer', category: 'sports', description: 'Play soccer or football' },
  { name: 'Dancing', category: 'sports', description: 'Dance for fun and fitness' },
  { name: 'Rock Climbing', category: 'sports', description: 'Climb indoor or outdoor routes' },
  
  // Creative Arts
  { name: 'Painting', category: 'creative', description: 'Create art with paint and canvas' },
  { name: 'Drawing', category: 'creative', description: 'Sketch and draw illustrations' },
  { name: 'Sculpting', category: 'creative', description: 'Create three-dimensional art' },
  { name: 'Photography', category: 'creative', description: 'Capture moments and scenes', isPopular: true },
  { name: 'Knitting', category: 'creative', description: 'Create textiles and clothing' },
  { name: 'Woodworking', category: 'creative', description: 'Build and craft with wood' },
  { name: 'Pottery', category: 'creative', description: 'Create ceramic art and vessels' },
  { name: 'Calligraphy', category: 'creative', description: 'Practice beautiful handwriting' },
  { name: 'Digital Art', category: 'creative', description: 'Create art using digital tools' },
  { name: 'Cooking', category: 'creative', description: 'Prepare and experiment with food', isPopular: true },
  { name: 'Baking', category: 'creative', description: 'Create breads, pastries, and desserts' },
  
  // Intellectual
  { name: 'Reading', category: 'intellectual', description: 'Read books and literature', isPopular: true },
  { name: 'Writing', category: 'intellectual', description: 'Write stories, articles, or blogs', isPopular: true },
  { name: 'Chess', category: 'intellectual', description: 'Play strategic board games' },
  { name: 'Puzzles', category: 'intellectual', description: 'Solve crosswords, sudoku, and brain teasers' },
  { name: 'Learning Languages', category: 'intellectual', description: 'Study foreign languages' },
  { name: 'Podcasting', category: 'intellectual', description: 'Create and host audio content' },
  { name: 'Blogging', category: 'intellectual', description: 'Write and publish online content' },
  { name: 'Vlogging', category: 'intellectual', description: 'Create and share video content' },
  { name: 'Collecting', category: 'intellectual', description: 'Collect items of interest' },
  { name: 'Astronomy', category: 'intellectual', description: 'Study stars and celestial objects' },
  { name: 'Bird Watching', category: 'intellectual', description: 'Observe and identify birds' },
  
  // Social Activities
  { name: 'Volunteering', category: 'social', description: 'Help others and give back to community', isPopular: true },
  { name: 'Board Games', category: 'social', description: 'Play tabletop games with friends' },
  { name: 'Video Games', category: 'social', description: 'Play digital games for entertainment', isPopular: true },
  { name: 'Music', category: 'social', description: 'Listen to or create music', isPopular: true },
  { name: 'Travel', category: 'social', description: 'Explore new places and cultures', isPopular: true },
  { name: 'Networking', category: 'social', description: 'Build professional relationships' },
  { name: 'Mentoring', category: 'social', description: 'Guide and support others' },
  { name: 'Public Speaking', category: 'social', description: 'Present and speak to audiences' },
  
  // Outdoor & Nature
  { name: 'Gardening', category: 'outdoor', description: 'Grow plants and maintain gardens' },
  { name: 'Camping', category: 'outdoor', description: 'Spend time outdoors in nature' },
  { name: 'Fishing', category: 'outdoor', description: 'Fish for recreation and relaxation' },
  { name: 'Kayaking', category: 'outdoor', description: 'Paddle on water for adventure' },
  { name: 'Skiing', category: 'outdoor', description: 'Ski on snow for recreation' },
  { name: 'Surfing', category: 'outdoor', description: 'Ride waves on a surfboard' },
  { name: 'Mountain Biking', category: 'outdoor', description: 'Ride bikes on challenging terrain' },
  
  // Technology
  { name: 'Programming', category: 'technology', description: 'Write code and build software' },
  { name: '3D Printing', category: 'technology', description: 'Create objects with 3D printers' },
  { name: 'Robotics', category: 'technology', description: 'Build and program robots' },
  { name: 'Arduino', category: 'technology', description: 'Work with microcontrollers and electronics' },
  { name: 'AI/ML Projects', category: 'technology', description: 'Experiment with artificial intelligence' },
  { name: 'Web Development', category: 'technology', description: 'Build websites and web applications' },
  { name: 'Mobile App Development', category: 'technology', description: 'Create mobile applications' },
  
  // Other
  { name: 'Meditation', category: 'other', description: 'Practice mindfulness and relaxation' },
  { name: 'Journaling', category: 'other', description: 'Write personal thoughts and experiences' },
  { name: 'DIY Projects', category: 'other', description: 'Build and create things yourself' },
  { name: 'Home Improvement', category: 'other', description: 'Renovate and improve living spaces' },
  { name: 'Car Maintenance', category: 'other', description: 'Maintain and repair vehicles' },
  { name: 'Pet Care', category: 'other', description: 'Care for and train pets' },
];

// Resume-based hobby suggestions (keywords that might appear in resumes)
export const RESUME_HOBBY_KEYWORDS: Record<string, string[]> = {
  'leadership': ['Volunteering', 'Mentoring', 'Public Speaking', 'Networking'],
  'team': ['Team Sports', 'Board Games', 'Volunteering', 'Mentoring'],
  'creative': ['Writing', 'Photography', 'Digital Art', 'Cooking', 'Baking'],
  'technical': ['Programming', '3D Printing', 'Arduino', 'Web Development'],
  'analytical': ['Chess', 'Puzzles', 'Reading', 'Research'],
  'outdoor': ['Hiking', 'Cycling', 'Running', 'Gardening', 'Camping'],
  'fitness': ['Yoga', 'Weightlifting', 'Swimming', 'Running', 'Dancing'],
  'travel': ['Travel', 'Photography', 'Learning Languages'],
  'music': ['Music', 'Podcasting', 'Vlogging'],
  'gaming': ['Video Games', 'Board Games', 'Chess'],
  'art': ['Painting', 'Drawing', 'Photography', 'Digital Art'],
  'cooking': ['Cooking', 'Baking', 'Gardening'],
  'reading': ['Reading', 'Writing', 'Blogging'],
  'writing': ['Writing', 'Blogging', 'Journaling'],
  'photography': ['Photography', 'Travel', 'Digital Art'],
  'volunteer': ['Volunteering', 'Mentoring', 'Community Service'],
  'sports': ['Team Sports', 'Individual Sports', 'Fitness Activities'],
  'technology': ['Programming', 'Web Development', 'AI/ML Projects'],
  'languages': ['Learning Languages', 'Travel', 'International'],
  'research': ['Research', 'Reading', 'Analytical Activities'],
};

// Helper functions to get options by category
export const getPositionsByCategory = (category: PositionCategory): PositionOption[] => {
  return POSITION_OPTIONS.filter(option => option.category === category);
};

export const getHobbiesByCategory = (category: HobbyCategory): HobbyOption[] => {
  return HOBBY_OPTIONS.filter(option => option.category === category);
};

export const getPopularHobbies = (): HobbyOption[] => {
  return HOBBY_OPTIONS.filter(option => option.isPopular);
};

export const getResumeBasedHobbies = (resumeText: string): string[] => {
  const suggestions: string[] = [];
  const lowerText = resumeText.toLowerCase();
  
  Object.entries(RESUME_HOBBY_KEYWORDS).forEach(([keyword, hobbies]) => {
    if (lowerText.includes(keyword)) {
      suggestions.push(...hobbies);
    }
  });
  
  // Remove duplicates and return unique suggestions
  return [...new Set(suggestions)].slice(0, 8);
};

// Default onboarding configuration
export const DEFAULT_ONBOARDING_CONFIG = {
  maxPositions: 3,
  maxHobbies: 10,
  maxResumeSize: 5 * 1024 * 1024, // 5MB
  allowedResumeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  autoRedirectDelay: 5000, // 5 seconds
}; 