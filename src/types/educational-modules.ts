// Educational Modules Type Definitions
// Requirements: 1.1, 2.1, 3.1, 4.1

// Module identifiers
export type ModuleId = 'nutrition' | 'digital-parenting' | 'internet-safety' | 'healthy-habits';

// Age groups for content adaptation
export type AgeGroup = '0-2' | '3-5' | '6-12' | '13+';

// Section types within modules
export type SectionType = 'story' | 'interactive' | 'facts' | 'activities' | 'quiz' | 'resources';

// Difficulty levels for activities
export type DifficultyLevel = 'easy' | 'medium' | 'challenging';

// Resource types
export type ResourceType = 'pdf' | 'checklist' | 'contract' | 'guide' | 'template';

// Achievement types
export type AchievementType = 'module_complete' | 'all_modules' | 'quiz_perfect' | 'streak' | 'first_module';

// Wonder Fact - engaging educational facts
export interface WonderFact {
  id: string;
  fact: string;
  explanation: string;
  visual: string; // emoji or icon
  source?: string;
  ageGroup?: AgeGroup;
}

// Activity - hands-on exercises for parents and children
export interface Activity {
  id: string;
  title: string;
  description: string;
  materials: string[];
  steps: string[];
  ageRange: string;
  duration: string;
  learningGoal: string;
  difficulty: DifficultyLevel;
}

// Resource - downloadable materials
export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  downloadUrl: string;
  description: string;
  fileSize?: string;
}

// Quiz Question
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
}

// Feature item for interactive sections
export interface Feature {
  name: string;
  description: string;
  icon?: string;
}

// Section content structure
export interface SectionContent {
  narrative?: string;
  wonderFact?: string;
  visual?: string;
  interactive?: boolean;
  features?: Feature[];
  facts?: WonderFact[];
  activities?: Activity[];
  quiz?: QuizQuestion[];
  resources?: Resource[];
}

// Module Section
export interface ModuleSection {
  id: string;
  title: string;
  type: SectionType;
  content: SectionContent;
  ageAdaptations?: Record<AgeGroup, string>;
}

// Educational Module - main module structure
export interface EducationalModule {
  id: ModuleId;
  title: string;
  subtitle: string;
  description: string;
  icon: string; // emoji
  gradient: string; // tailwind gradient classes
  character: string; // emoji character
  duration: string;
  sections: ModuleSection[];
  wonderFacts: WonderFact[];
  activities: Activity[];
  resources: Resource[];
}

// Module Progress - tracks user progress through a module
export interface ModuleProgress {
  id: string;
  userId: string;
  moduleId: ModuleId;
  completedSections: string[];
  currentSection: number;
  quizScores: Record<string, number>;
  startedAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
}

// User Achievement - badges and rewards
export interface UserAchievement {
  id: string;
  userId: string;
  type: AchievementType;
  moduleId?: ModuleId;
  earnedAt: Date;
  metadata?: Record<string, unknown>;
}

// Module with progress - for displaying in UI
export interface ModuleWithProgress extends EducationalModule {
  progress?: ModuleProgress;
  completionPercentage: number;
  isCompleted: boolean;
  isCached: boolean;
}

// Quiz Result
export interface QuizResult {
  moduleId: ModuleId;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: Record<string, number>; // questionId -> selected answer index
  completedAt: Date;
}

// Age-adapted content response
export interface AgeAdaptedContent {
  content: SectionContent;
  ageGroup: AgeGroup;
  adaptedNarrative?: string;
}

// Module summary for hub display
export interface ModuleSummary {
  id: ModuleId;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  duration: string;
  sectionCount: number;
  completionPercentage: number;
  isCompleted: boolean;
}

// All modules response
export interface AllModulesResponse {
  modules: ModuleSummary[];
  totalProgress: number;
  completedCount: number;
  achievements: UserAchievement[];
}

// Progress update request
export interface ProgressUpdateRequest {
  sectionId: string;
  quizScore?: number;
}

// Progress update response
export interface ProgressUpdateResponse {
  progress: ModuleProgress;
  newAchievements?: UserAchievement[];
}
