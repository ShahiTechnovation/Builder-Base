
import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { HabitTracker } from '../components/HabitTracker';
import { BeginnerProfile, BuilderProfile, LearningStep } from '../types';
import { Users, BookOpen, CheckCircle, Clock, Star, Target, Trophy, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Learner = () => {
  const { account, isConnected } = useWeb3();
  const [profile, setProfile] = useState<BeginnerProfile | null>(null);
  const [availableProjects, setAvailableProjects] = useState<BuilderProfile[]>([]);
  const [selectedProject, setSelectedProject] = useState<BuilderProfile | null>(null);
  const [currentLearningPath, setCurrentLearningPath] = useState<LearningStep[]>([]);

  useEffect(() => {
    if (account) {
      loadProfile();
      loadAvailableProjects();
    }
  }, [account]);

  const loadProfile = () => {
    const savedProfile = localStorage.getItem(`learner_${account}`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      // Create new learner profile
      const newProfile: BeginnerProfile = {
        address: account!,
        level: 1,
        xp: 0,
        completedProjects: 0,
        currentLearningPaths: [],
        habitStreak: 0,
        lastHabitEntry: '',
        achievements: [],
        joinedAt: new Date().toISOString(),
      };
      setProfile(newProfile);
      saveProfile(newProfile);
    }
  };

  const loadAvailableProjects = () => {
    // Load all builder profiles from localStorage
    const projects: BuilderProfile[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('builder_')) {
        const profile = JSON.parse(localStorage.getItem(key)!);
        if (profile.repositories?.length > 0) {
          projects.push(profile);
        }
      }
    }
    setAvailableProjects(projects);
  };

  const saveProfile = (updatedProfile: BeginnerProfile) => {
    localStorage.setItem(`learner_${account}`, JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
  };

  const startLearningPath = (builderProfile: BuilderProfile, repoId: number) => {
    const repo = builderProfile.repositories.find(r => r.id === repoId);
    if (!repo) return;

    // Generate learning path (this would come from AI analysis in production)
    const learningPath: LearningStep[] = [
      {
        id: '1',
        title: 'Project Setup & Environment',
        description: `Set up your development environment for ${repo.name}`,
        estimatedTime: '30 minutes',
        resources: [repo.html_url, 'Environment setup guide'],
        completed: false
      },
      {
        id: '2',
        title: 'Understanding the Codebase',
        description: 'Explore the project structure and understand the main components',
        estimatedTime: '1 hour',
        resources: ['Code walkthrough', 'Architecture overview'],
        completed: false
      },
      {
        id: '3',
        title: 'Core Features Implementation',
        description: 'Build the main functionality step by step',
        estimatedTime: '3-5 hours',
        resources: ['Implementation guide', 'Code examples'],
        completed: false
      },
      {
        id: '4',
        title: 'Testing & Refinement',
        description: 'Test your implementation and make improvements',
        estimatedTime: '1 hour',
        resources: ['Testing guide', 'Best practices'],
        completed: false
      }
    ];

    setSelectedProject(builderProfile);
    setCurrentLearningPath(learningPath);

    // Update profile with new learning path
    if (profile) {
      const updatedProfile = {
        ...profile,
        currentLearningPaths: [...profile.currentLearningPaths, `${repo.name}_${Date.now()}`]
      };
      saveProfile(updatedProfile);
    }

    toast({
      title: "Learning Path Started!",
      description: `You've started learning ${repo.name}. Good luck!`,
    });
  };

  const completeStep = (stepId: string) => {
    const updatedPath = currentLearningPath.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    );
    setCurrentLearningPath(updatedPath);

    // Award XP for completing step
    if (profile) {
      const xpGain = 50;
      const newXP = profile.xp + xpGain;
      const newLevel = Math.floor(newXP / 500) + 1; // Level up every 500 XP

      const updatedProfile = {
        ...profile,
        xp: newXP,
        level: newLevel
      };

      // Check if all steps completed
      const allCompleted = updatedPath.every(step => step.completed);
      if (allCompleted) {
        updatedProfile.completedProjects += 1;
        updatedProfile.xp += 200; // Bonus XP for completing project
        
        toast({
          title: "Project Completed! 🎉",
          description: `You earned ${xpGain + 200} XP! Level: ${newLevel}`,
        });
      } else {
        toast({
          title: "Step Completed!",
          description: `You earned ${xpGain} XP!`,
        });
      }

      saveProfile(updatedProfile);
    }
  };

  const getDifficultyColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-4">
              Please connect your wallet to access the Learner Dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Learner Dashboard</h1>
        <p className="text-gray-600">
          Discover amazing projects, follow learning paths, and level up your skills
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Current Learning Path */}
          {selectedProject && currentLearningPath.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Current Learning Path</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Building: {selectedProject.repositories[0]?.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    by @{selectedProject.githubUsername}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>
                        {currentLearningPath.filter(step => step.completed).length} / {currentLearningPath.length}
                      </span>
                    </div>
                    <Progress 
                      value={(currentLearningPath.filter(step => step.completed).length / currentLearningPath.length) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {currentLearningPath.map((step, index) => (
                    <Card key={step.id} className={`p-4 ${step.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              step.completed ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                            }`}>
                              {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                            </div>
                            <h4 className="font-medium">{step.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {step.estimatedTime}
                            </span>
                            <span>{step.resources.length} resources</span>
                          </div>
                        </div>
                        {!step.completed && (
                          <Button 
                            size="sm" 
                            onClick={() => completeStep(step.id)}
                            className="ml-4"
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Available Projects ({availableProjects.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableProjects.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Projects Yet</h3>
                  <p className="text-gray-500">
                    Builders haven't submitted any projects yet. Check back soon!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableProjects.map((builder) => (
                    <Card key={builder.address} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">@{builder.githubUsername}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Trophy className="h-4 w-4 mr-1" />
                              Level {builder.level}
                            </span>
                            <span className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {builder.totalProjects} projects
                            </span>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {builder.xp.toLocaleString()} XP
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {builder.repositories.slice(0, 3).map((repo) => (
                          <div key={repo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium">{repo.name}</h4>
                              <p className="text-sm text-gray-600 truncate">{repo.description}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                {repo.language && (
                                  <Badge variant="outline" className="text-xs">{repo.language}</Badge>
                                )}
                                <Badge className={`text-xs ${getDifficultyColor('Intermediate')}`}>
                                  Intermediate
                                </Badge>
                                <span className="flex items-center text-xs text-gray-500">
                                  <Star className="h-3 w-3 mr-1" />
                                  {repo.stargazers_count}
                                </span>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => startLearningPath(builder, repo.id)}
                              disabled={currentLearningPath.length > 0}
                            >
                              Start Learning
                            </Button>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <HabitTracker />
        </div>

        {/* Profile Sidebar */}
        <div className="space-y-6">
          {profile && (
            <Card className="bg-gradient-to-br from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Learner Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-xl">L{profile.level}</span>
                  </div>
                  <h3 className="font-semibold text-lg">Learner</h3>
                  <p className="text-sm text-gray-600">Level {profile.level}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total XP:</span>
                    <span className="font-semibold flex items-center">
                      <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                      {profile.xp.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completed:</span>
                    <span className="font-semibold">{profile.completedProjects} projects</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Learning:</span>
                    <span className="font-semibold">{profile.currentLearningPaths.length} paths</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Habit Streak:</span>
                    <span className="font-semibold">{profile.habitStreak} days</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <h4 className="font-medium text-sm mb-2">Next Level Progress</h4>
                  <Progress value={(profile.xp % 500) / 5} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">
                    {500 - (profile.xp % 500)} XP to level {profile.level + 1}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Learning Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Start with Beginner Projects</p>
                  <p className="text-xs text-gray-600">Build confidence with simpler projects first</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Complete All Steps</p>
                  <p className="text-xs text-gray-600">Don't skip steps to maximize learning</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Trophy className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-sm">Track Your Progress</p>
                  <p className="text-xs text-gray-600">Use the habit tracker daily</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Learner;
