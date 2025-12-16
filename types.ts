export enum ViewState {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  IDE = 'IDE'
}

export type Theme = 'neon' | 'pastel';

// Exported for global use in App and Layout
export type DesktopViewMode = 'split' | 'theory';
export type MobileTab = 'theory' | 'code';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface LessonSegment {
  id: string;
  title: string;
  content: string; // Markdown/HTML supported
  codeSnippet?: string; // Initial code for the editor
  solution?: string; // Expected output or regex check
  hint?: string; // Static hint for the user
  type: 'theory' | 'practice' | 'quiz';
  quizData?: QuizQuestion[]; // Optional data for quiz type
  xpReward: number;
  trinketId?: string; // ID for specific trinket environment
}

export interface Course {
  id: string;
  title: string;
  description: string;
  segments: LessonSegment[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name or unicode char
  color: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  currentLessonId: string;
  badges: string[]; // List of badge IDs
  completedSegments: string[];
}