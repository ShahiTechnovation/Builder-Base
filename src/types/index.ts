
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

// AI Analysis Types
export interface AIAnalysisResult {
  projectOverview: {
    description: string;
    mainPurpose: string;
    targetAudience: string;
    complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  };
  techStack: TechStack & {
    architecture: string[];
    designPatterns: string[];
  };
  learningRoadmap: {
    phases: LearningPhase[];
    estimatedTotalHours: number;
    prerequisites: string[];
  };
  buildingGuide: {
    coreFeatures: CoreFeature[];
    implementationOrder: string[];
    testingStrategy: string[];
  };
  skillsGained: string[];
  xpReward: number;
  difficultyJustification: string;
}

export interface LearningPhase {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  steps: LearningStep[];
  prerequisites: string[];
  deliverable: string;
}

export interface CoreFeature {
  name: string;
  description: string;
  complexity: 'Low' | 'Medium' | 'High';
  estimatedHours: number;
  dependencies: string[];
  keyComponents: string[];
}
