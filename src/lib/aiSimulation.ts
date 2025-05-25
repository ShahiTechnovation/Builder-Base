
import { GitHubRepo, ProjectAnalysis, LearningStep, TechStack } from '../types';

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

const GITHUB_API_BASE = 'https://api.github.com';

export const fetchRepositoryReadme = async (repo: GitHubRepo): Promise<string> => {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${repo.full_name}/contents/README.md`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch README: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.content) {
      // Decode base64 content
      return atob(data.content.replace(/\s/g, ''));
    }
    
    throw new Error('No README content found');
  } catch (error) {
    console.error('Error fetching README:', error);
    // Fallback to basic analysis without README
    return '';
  }
};

export const simulateAIAnalysis = async (repo: GitHubRepo): Promise<AIAnalysisResult> => {
  console.log(`🤖 Starting AI simulation for ${repo.name}...`);
  
  // Fetch README content
  const readmeContent = await fetchRepositoryReadme(repo);
  
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Analyze the repository based on available data
  const analysis = analyzeRepositoryContent(repo, readmeContent);
  
  console.log(`✅ AI analysis complete for ${repo.name}`);
  return analysis;
};

const analyzeRepositoryContent = (repo: GitHubRepo, readmeContent: string): AIAnalysisResult => {
  // Extract information from README and repository metadata
  const complexity = determineComplexityFromContent(repo, readmeContent);
  const techStack = extractTechStackFromContent(repo, readmeContent);
  const projectOverview = generateProjectOverview(repo, readmeContent, complexity);
  const learningRoadmap = generateLearningRoadmap(repo, complexity, techStack);
  const buildingGuide = generateBuildingGuide(repo, complexity, techStack);
  const skillsGained = generateSkillsList(techStack, complexity);
  const xpReward = calculateXPReward(complexity, repo.stargazers_count, techStack);
  
  return {
    projectOverview,
    techStack,
    learningRoadmap,
    buildingGuide,
    skillsGained,
    xpReward,
    difficultyJustification: generateDifficultyJustification(complexity, techStack, repo)
  };
};

const determineComplexityFromContent = (repo: GitHubRepo, readme: string): 'Beginner' | 'Intermediate' | 'Advanced' => {
  let score = 0;
  
  // Repository size and activity
  if (repo.size > 10000) score += 3;
  else if (repo.size > 1000) score += 2;
  else score += 1;
  
  // README complexity indicators
  const complexityKeywords = {
    advanced: ['microservices', 'kubernetes', 'docker', 'ci/cd', 'testing', 'deployment', 'scalability'],
    intermediate: ['api', 'database', 'authentication', 'components', 'routing', 'state management'],
    beginner: ['tutorial', 'getting started', 'basic', 'simple', 'introduction']
  };
  
  const readmeLower = readme.toLowerCase();
  
  complexityKeywords.advanced.forEach(keyword => {
    if (readmeLower.includes(keyword)) score += 2;
  });
  
  complexityKeywords.intermediate.forEach(keyword => {
    if (readmeLower.includes(keyword)) score += 1;
  });
  
  // Tech stack complexity
  const totalTech = repo.topics.length;
  if (totalTech > 6) score += 2;
  else if (totalTech > 3) score += 1;
  
  // Community validation
  if (repo.stargazers_count > 100) score += 2;
  else if (repo.stargazers_count > 20) score += 1;
  
  if (score >= 8) return 'Advanced';
  if (score >= 4) return 'Intermediate';
  return 'Beginner';
};

const extractTechStackFromContent = (repo: GitHubRepo, readme: string): TechStack & { architecture: string[]; designPatterns: string[] } => {
  const languages = [repo.language].filter(Boolean);
  const frameworks: string[] = [];
  const databases: string[] = [];
  const tools: string[] = [];
  const architecture: string[] = [];
  const designPatterns: string[] = [];
  
  const content = (readme + ' ' + repo.topics.join(' ')).toLowerCase();
  
  // Framework detection
  const frameworkMap = {
    'react': ['react', 'jsx', 'react.js'],
    'vue': ['vue', 'vue.js'],
    'angular': ['angular', '@angular'],
    'next.js': ['nextjs', 'next.js'],
    'express': ['express', 'express.js'],
    'fastapi': ['fastapi', 'fast api'],
    'django': ['django'],
    'flask': ['flask'],
    'spring': ['spring', 'spring boot'],
    'laravel': ['laravel']
  };
  
  Object.entries(frameworkMap).forEach(([framework, keywords]) => {
    if (keywords.some(keyword => content.includes(keyword))) {
      frameworks.push(framework);
    }
  });
  
  // Database detection
  const dbKeywords = ['mongodb', 'postgresql', 'mysql', 'sqlite', 'redis', 'firebase'];
  dbKeywords.forEach(db => {
    if (content.includes(db)) databases.push(db);
  });
  
  // Tools detection
  const toolKeywords = ['docker', 'kubernetes', 'github actions', 'vercel', 'netlify', 'aws'];
  toolKeywords.forEach(tool => {
    if (content.includes(tool)) tools.push(tool);
  });
  
  // Architecture patterns
  const archKeywords = ['microservices', 'monolith', 'serverless', 'spa', 'pwa', 'rest api', 'graphql'];
  archKeywords.forEach(arch => {
    if (content.includes(arch)) architecture.push(arch);
  });
  
  // Design patterns
  const patternKeywords = ['mvc', 'component-based', 'state management', 'routing', 'authentication'];
  patternKeywords.forEach(pattern => {
    if (content.includes(pattern)) designPatterns.push(pattern);
  });
  
  return { languages, frameworks, databases, tools, architecture, designPatterns };
};

const generateProjectOverview = (repo: GitHubRepo, readme: string, complexity: string) => {
  const description = repo.description || extractDescriptionFromReadme(readme) || 'A software project';
  
  return {
    description,
    mainPurpose: generateMainPurpose(repo, readme),
    targetAudience: getTargetAudience(complexity),
    complexity: complexity as 'Beginner' | 'Intermediate' | 'Advanced'
  };
};

const extractDescriptionFromReadme = (readme: string): string => {
  const lines = readme.split('\n').filter(line => line.trim());
  const firstParagraph = lines.find(line => !line.startsWith('#') && line.length > 20);
  return firstParagraph || '';
};

const generateMainPurpose = (repo: GitHubRepo, readme: string): string => {
  const purposes = [
    'Educational tool for learning modern web development',
    'Production-ready application demonstrating best practices',
    'Prototype showcasing innovative development techniques',
    'Full-stack application with real-world features',
    'Component library for reusable UI elements'
  ];
  
  // Simple heuristic based on repo name and topics
  if (repo.name.includes('tutorial') || readme.toLowerCase().includes('learn')) {
    return purposes[0];
  }
  if (repo.topics.includes('library') || repo.topics.includes('component')) {
    return purposes[4];
  }
  if (repo.stargazers_count > 50) {
    return purposes[1];
  }
  
  return purposes[Math.floor(Math.random() * purposes.length)];
};

const getTargetAudience = (complexity: string): string => {
  switch (complexity) {
    case 'Beginner': return 'New developers learning fundamentals';
    case 'Intermediate': return 'Developers with 1-2 years experience';
    case 'Advanced': return 'Senior developers and architects';
    default: return 'All skill levels';
  }
};

const generateLearningRoadmap = (repo: GitHubRepo, complexity: string, techStack: any) => {
  const baseHours = { 'Beginner': 20, 'Intermediate': 40, 'Advanced': 80 };
  const totalHours = baseHours[complexity as keyof typeof baseHours];
  
  const phases: LearningPhase[] = [
    {
      id: '1',
      title: 'Project Setup & Environment',
      description: 'Set up development environment and understand project structure',
      estimatedHours: Math.round(totalHours * 0.15),
      steps: [
        {
          id: '1-1',
          title: 'Development Environment Setup',
          description: 'Install necessary tools and dependencies',
          estimatedTime: '2-3 hours',
          resources: ['Official documentation', 'Setup guides'],
          completed: false
        },
        {
          id: '1-2',
          title: 'Project Structure Analysis',
          description: 'Understand the codebase organization and file structure',
          estimatedTime: '1-2 hours',
          resources: [repo.html_url, 'Architecture documentation'],
          completed: false
        }
      ],
      prerequisites: ['Basic programming knowledge'],
      deliverable: 'Working development environment'
    },
    {
      id: '2',
      title: 'Core Technologies Deep Dive',
      description: `Master ${techStack.languages.join(', ')} and key frameworks`,
      estimatedHours: Math.round(totalHours * 0.3),
      steps: [
        {
          id: '2-1',
          title: 'Language Fundamentals',
          description: `Learn ${techStack.languages.join(', ')} concepts and syntax`,
          estimatedTime: complexity === 'Beginner' ? '8-10 hours' : '4-6 hours',
          resources: ['Official tutorials', 'Interactive coding platforms'],
          completed: false
        },
        {
          id: '2-2',
          title: 'Framework Mastery',
          description: `Understand ${techStack.frameworks.join(', ')} patterns and best practices`,
          estimatedTime: complexity === 'Beginner' ? '6-8 hours' : '4-5 hours',
          resources: ['Framework documentation', 'Video tutorials'],
          completed: false
        }
      ],
      prerequisites: ['Completed Phase 1'],
      deliverable: 'Basic application with core functionality'
    },
    {
      id: '3',
      title: 'Feature Implementation',
      description: 'Build the main features and functionality',
      estimatedHours: Math.round(totalHours * 0.4),
      steps: [
        {
          id: '3-1',
          title: 'Core Features Development',
          description: 'Implement the primary features of the application',
          estimatedTime: complexity === 'Advanced' ? '20-25 hours' : '10-15 hours',
          resources: ['Code examples', 'Best practices guides'],
          completed: false
        },
        {
          id: '3-2',
          title: 'User Interface Polish',
          description: 'Refine the user experience and visual design',
          estimatedTime: '3-5 hours',
          resources: ['Design systems', 'UI libraries'],
          completed: false
        }
      ],
      prerequisites: ['Completed Phase 2'],
      deliverable: 'Functional application with main features'
    },
    {
      id: '4',
      title: 'Testing & Deployment',
      description: 'Add tests, optimize performance, and deploy',
      estimatedHours: Math.round(totalHours * 0.15),
      steps: [
        {
          id: '4-1',
          title: 'Testing Implementation',
          description: 'Write unit tests and integration tests',
          estimatedTime: '2-4 hours',
          resources: ['Testing frameworks', 'Testing best practices'],
          completed: false
        },
        {
          id: '4-2',
          title: 'Production Deployment',
          description: 'Deploy the application to a production environment',
          estimatedTime: '2-3 hours',
          resources: ['Deployment guides', 'Platform documentation'],
          completed: false
        }
      ],
      prerequisites: ['Completed Phase 3'],
      deliverable: 'Deployed, tested application'
    }
  ];
  
  return {
    phases,
    estimatedTotalHours: totalHours,
    prerequisites: getPrerequisites(complexity)
  };
};

const getPrerequisites = (complexity: string): string[] => {
  const basePrereqs = ['Basic programming knowledge', 'Understanding of web development concepts'];
  
  if (complexity === 'Intermediate') {
    return [...basePrereqs, 'Experience with at least one programming language', 'Basic understanding of databases'];
  }
  
  if (complexity === 'Advanced') {
    return [...basePrereqs, 'Strong programming background', 'Experience with multiple frameworks', 'Understanding of software architecture'];
  }
  
  return basePrereqs;
};

const generateBuildingGuide = (repo: GitHubRepo, complexity: string, techStack: any) => {
  const coreFeatures: CoreFeature[] = [
    {
      name: 'Project Foundation',
      description: 'Basic project structure and configuration',
      complexity: 'Low',
      estimatedHours: 3,
      dependencies: [],
      keyComponents: ['Package configuration', 'Build setup', 'Development tools']
    },
    {
      name: 'User Interface',
      description: 'Main user interface components and layouts',
      complexity: 'Medium',
      estimatedHours: 8,
      dependencies: ['Project Foundation'],
      keyComponents: ['Components', 'Styling', 'Responsive design']
    },
    {
      name: 'Core Logic',
      description: 'Business logic and data processing',
      complexity: 'High',
      estimatedHours: 12,
      dependencies: ['User Interface'],
      keyComponents: ['State management', 'API integration', 'Data validation']
    },
    {
      name: 'Advanced Features',
      description: 'Additional functionality and optimizations',
      complexity: 'High',
      estimatedHours: 8,
      dependencies: ['Core Logic'],
      keyComponents: ['Performance optimization', 'Advanced interactions', 'Error handling']
    }
  ];
  
  return {
    coreFeatures,
    implementationOrder: [
      'Set up development environment',
      'Create basic project structure',
      'Implement core UI components',
      'Add business logic and state management',
      'Integrate external APIs and services',
      'Add advanced features and optimizations',
      'Implement testing and error handling',
      'Optimize for production deployment'
    ],
    testingStrategy: [
      'Unit tests for core functions',
      'Component testing for UI elements',
      'Integration tests for API calls',
      'End-to-end testing for user workflows'
    ]
  };
};

const generateSkillsList = (techStack: any, complexity: string): string[] => {
  const skills = [
    ...techStack.languages.map((lang: string) => `${lang} programming`),
    ...techStack.frameworks.map((fw: string) => `${fw} development`),
    'Version control with Git',
    'Project structure and organization',
    'Debugging and problem-solving'
  ];
  
  if (techStack.databases.length > 0) {
    skills.push('Database design and management');
  }
  
  if (complexity === 'Intermediate' || complexity === 'Advanced') {
    skills.push('API design and integration', 'Testing and quality assurance');
  }
  
  if (complexity === 'Advanced') {
    skills.push('Software architecture', 'Performance optimization', 'DevOps and deployment');
  }
  
  return skills;
};

const calculateXPReward = (complexity: string, stars: number, techStack: any): number => {
  const baseXP = {
    'Beginner': 150,
    'Intermediate': 300,
    'Advanced': 600
  };
  
  const starBonus = Math.min(stars * 5, 150);
  const techBonus = (techStack.languages.length + techStack.frameworks.length + 
                    techStack.databases.length + techStack.tools.length) * 20;
  
  return baseXP[complexity as keyof typeof baseXP] + starBonus + techBonus;
};

const generateDifficultyJustification = (complexity: string, techStack: any, repo: GitHubRepo): string => {
  const factors = [];
  
  if (techStack.languages.length > 1) {
    factors.push(`Multiple programming languages (${techStack.languages.join(', ')})`);
  }
  
  if (techStack.frameworks.length > 0) {
    factors.push(`Framework complexity (${techStack.frameworks.join(', ')})`);
  }
  
  if (repo.size > 5000) {
    factors.push('Large codebase size');
  }
  
  if (repo.stargazers_count > 50) {
    factors.push('Community validation and complexity');
  }
  
  if (techStack.architecture.length > 0) {
    factors.push(`Architectural patterns (${techStack.architecture.join(', ')})`);
  }
  
  return `Classified as ${complexity} due to: ${factors.join(', ')}`;
};
