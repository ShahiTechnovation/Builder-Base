
import { GitHubRepo, ProjectAnalysis, TechStack } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

export const fetchUserRepos = async (username: string): Promise<GitHubRepo[]> => {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=100`
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const repos = await response.json();
    return repos.filter((repo: any) => !repo.fork); // Filter out forks
  } catch (error) {
    console.error('Error fetching repos:', error);
    throw error;
  }
};

export const analyzeRepository = async (repo: GitHubRepo): Promise<ProjectAnalysis> => {
  // This is a simplified AI analysis simulation
  // In production, you'd send repo data to an AI service
  
  const techStack = extractTechStack(repo);
  const complexity = determineComplexity(repo, techStack);
  const estimatedHours = calculateEstimatedHours(complexity, repo.size);
  const xpReward = calculateXPReward(complexity, repo.stargazers_count, techStack);
  const learningPath = generateLearningPath(repo, techStack, complexity);

  return {
    complexity,
    techStack,
    estimatedHours,
    learningPath,
    xpReward,
  };
};

const extractTechStack = (repo: GitHubRepo): TechStack => {
  const languages = [repo.language].filter(Boolean);
  const frameworks: string[] = [];
  const databases: string[] = [];
  const tools: string[] = [];

  // Simple tech stack detection based on repo topics and language
  repo.topics.forEach(topic => {
    if (['react', 'vue', 'angular', 'nextjs', 'express', 'fastapi'].includes(topic)) {
      frameworks.push(topic);
    }
    if (['mongodb', 'postgresql', 'mysql', 'sqlite'].includes(topic)) {
      databases.push(topic);
    }
    if (['docker', 'kubernetes', 'github-actions', 'vercel'].includes(topic)) {
      tools.push(topic);
    }
  });

  return { languages, frameworks, databases, tools };
};

const determineComplexity = (repo: GitHubRepo, techStack: TechStack): 'Beginner' | 'Intermediate' | 'Advanced' => {
  let score = 0;
  
  // Size factor
  if (repo.size > 10000) score += 3;
  else if (repo.size > 1000) score += 2;
  else score += 1;
  
  // Tech stack complexity
  const totalTech = techStack.languages.length + techStack.frameworks.length + 
                   techStack.databases.length + techStack.tools.length;
  
  if (totalTech > 6) score += 3;
  else if (totalTech > 3) score += 2;
  else score += 1;
  
  // Stars and forks (community validation)
  if (repo.stargazers_count > 50) score += 2;
  else if (repo.stargazers_count > 10) score += 1;
  
  if (score >= 7) return 'Advanced';
  if (score >= 4) return 'Intermediate';
  return 'Beginner';
};

const calculateEstimatedHours = (complexity: string, size: number): number => {
  const baseHours = {
    'Beginner': 8,
    'Intermediate': 20,
    'Advanced': 40
  };
  
  const sizeMultiplier = Math.min(size / 1000, 3); // Cap at 3x
  return Math.round(baseHours[complexity as keyof typeof baseHours] * (1 + sizeMultiplier));
};

const calculateXPReward = (complexity: string, stars: number, techStack: TechStack): number => {
  const baseXP = {
    'Beginner': 100,
    'Intermediate': 250,
    'Advanced': 500
  };
  
  const starBonus = Math.min(stars * 10, 200); // Cap at 200 bonus XP
  const techBonus = (techStack.languages.length + techStack.frameworks.length + 
                    techStack.databases.length + techStack.tools.length) * 25;
  
  return baseXP[complexity as keyof typeof baseXP] + starBonus + techBonus;
};

const generateLearningPath = (repo: GitHubRepo, techStack: TechStack, complexity: string) => {
  const steps = [
    {
      id: '1',
      title: 'Project Overview & Setup',
      description: `Understand the ${repo.name} project structure and set up your development environment`,
      estimatedTime: '1-2 hours',
      resources: [`${repo.html_url}`, 'Setup documentation'],
      completed: false
    },
    {
      id: '2',
      title: 'Core Technologies',
      description: `Learn ${techStack.languages.join(', ')} and ${techStack.frameworks.join(', ')}`,
      estimatedTime: complexity === 'Beginner' ? '4-6 hours' : '8-12 hours',
      resources: ['Official documentation', 'Tutorial videos'],
      completed: false
    },
    {
      id: '3',
      title: 'Build Core Features',
      description: 'Implement the main functionality of the application',
      estimatedTime: complexity === 'Beginner' ? '6-8 hours' : '15-20 hours',
      resources: ['Code examples', 'Best practices guide'],
      completed: false
    },
    {
      id: '4',
      title: 'Testing & Deployment',
      description: 'Add tests and deploy your version of the project',
      estimatedTime: '2-4 hours',
      resources: ['Testing frameworks', 'Deployment guides'],
      completed: false
    }
  ];

  return steps;
};
