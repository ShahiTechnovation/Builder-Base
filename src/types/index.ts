
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  topics: string[];
  size: number;
}

export interface TechStack {
  languages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
}

export interface ProjectAnalysis {
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  techStack: TechStack;
  estimatedHours: number;
  learningPath: LearningStep[];
  xpReward: number;
}

export interface LearningStep {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  resources: string[];
  completed: boolean;
}

export interface BuilderProfile {
  address: string;
  githubUsername: string;
  level: number;
  xp: number;
  totalProjects: number;
  repositories: GitHubRepo[];
  nftRewards: string[];
  joinedAt: string;
}

export interface BeginnerProfile {
  address: string;
  level: number;
  xp: number;
  completedProjects: number;
  currentLearningPaths: string[];
  habitStreak: number;
  lastHabitEntry: string;
  achievements: string[];
  joinedAt: string;
}

export interface HabitEntry {
  date: string;
  entry: string;
  mood: 'excited' | 'productive' | 'learning' | 'struggling' | 'accomplished';
}
