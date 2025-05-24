import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { HabitTracker } from '../components/HabitTracker';
import { NFTMinting } from '../components/NFTMinting';
import { fetchUserRepos, analyzeRepository } from '../lib/github';
import { GitHubRepo, ProjectAnalysis, BuilderProfile } from '../types';
import { Github, Star, GitFork, Calendar, Trophy, Zap, Plus, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Builder = () => {
  const { account, isConnected } = useWeb3();
  const [githubUsername, setGithubUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<BuilderProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [analyses, setAnalyses] = useState<{ [key: number]: ProjectAnalysis }>({});

  useEffect(() => {
    if (account) {
      loadProfile();
    }
  }, [account]);

  const loadProfile = () => {
    const savedProfile = localStorage.getItem(`builder_${account}`);
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      setRepos(parsed.repositories || []);
      setGithubUsername(parsed.githubUsername || '');
    }
  };

  const saveProfile = (updatedProfile: BuilderProfile) => {
    localStorage.setItem(`builder_${account}`, JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
  };

  const handleSubmitGithub = async () => {
    if (!githubUsername.trim() || !account) return;

    setLoading(true);
    try {
      const userRepos = await fetchUserRepos(githubUsername);
      setRepos(userRepos);

      // Analyze each repository
      const newAnalyses: { [key: number]: ProjectAnalysis } = {};
      let totalXP = 0;

      for (const repo of userRepos) {
        const analysis = await analyzeRepository(repo);
        newAnalyses[repo.id] = analysis;
        totalXP += analysis.xpReward;
      }

      setAnalyses(newAnalyses);

      // Calculate level (every 1000 XP = 1 level)
      const level = Math.floor(totalXP / 1000) + 1;
      const nftRewards = [];
      
      // NFT rewards based on level (you'll provide actual NFT links)
      for (let i = 1; i <= Math.min(level, 10); i++) {
        nftRewards.push(`https://example.com/nft-level-${i}`);
      }

      const newProfile: BuilderProfile = {
        address: account,
        githubUsername,
        level,
        xp: totalXP,
        totalProjects: userRepos.length,
        repositories: userRepos,
        nftRewards,
        joinedAt: profile?.joinedAt || new Date().toISOString(),
      };

      saveProfile(newProfile);

      toast({
        title: "Profile Updated!",
        description: `Analyzed ${userRepos.length} repositories. You earned ${totalXP} XP!`,
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch GitHub data. Please check the username and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getComplexityColor = (complexity: string) => {
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
              Please connect your wallet to access the Builder Dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Builder Dashboard</h1>
        <p className="text-gray-600">
          Submit your GitHub repositories, get AI analysis, and earn XP & NFT rewards
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* NFT Minting Section */}
          {profile && (
            <NFTMinting userLevel={profile.level} userXP={profile.xp} />
          )}

          {/* GitHub Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Github className="h-5 w-5" />
                <span>GitHub Integration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your GitHub username"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSubmitGithub}
                  disabled={loading || !githubUsername.trim()}
                  className="min-w-32"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
              {githubUsername && (
                <p className="text-sm text-gray-600">
                  We'll analyze your public repositories and create learning paths for beginners
                </p>
              )}
            </CardContent>
          </Card>

          {/* Repositories */}
          {repos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Repositories ({repos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {repos.map((repo) => {
                    const analysis = analyses[repo.id];
                    return (
                      <Card key={repo.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg">{repo.name}</h3>
                              <a 
                                href={repo.html_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{repo.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Star className="h-4 w-4 mr-1" />
                                {repo.stargazers_count}
                              </span>
                              <span className="flex items-center">
                                <GitFork className="h-4 w-4 mr-1" />
                                {repo.forks_count}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(repo.updated_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {analysis && (
                            <div className="text-right">
                              <Badge className={getComplexityColor(analysis.complexity)}>
                                {analysis.complexity}
                              </Badge>
                              <p className="text-sm text-gray-600 mt-1">
                                +{analysis.xpReward} XP
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {repo.language && (
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{repo.language}</Badge>
                            {repo.topics.slice(0, 3).map((topic) => (
                              <Badge key={topic} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {analysis && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Estimated Time:</span>
                                <span className="ml-2">{analysis.estimatedHours}h</span>
                              </div>
                              <div>
                                <span className="font-medium">Learning Steps:</span>
                                <span className="ml-2">{analysis.learningPath.length}</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="font-medium text-sm">Tech Stack:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {analysis.techStack.languages.map((lang) => (
                                  <Badge key={lang} variant="outline" className="text-xs">
                                    {lang}
                                  </Badge>
                                ))}
                                {analysis.techStack.frameworks.map((fw) => (
                                  <Badge key={fw} variant="secondary" className="text-xs">
                                    {fw}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <HabitTracker />
        </div>

        {/* Profile Sidebar */}
        <div className="space-y-6">
          {profile && (
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-orange-600" />
                  <span>Builder Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-xl">L{profile.level}</span>
                  </div>
                  <h3 className="font-semibold text-lg">@{profile.githubUsername}</h3>
                  <p className="text-sm text-gray-600">Builder Level {profile.level}</p>
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
                    <span className="text-sm text-gray-600">Projects:</span>
                    <span className="font-semibold">{profile.totalProjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">NFT Rewards:</span>
                    <span className="font-semibold">{profile.nftRewards.length}</span>
                  </div>
                </div>

                {profile.nftRewards.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Achievement NFTs</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {profile.nftRewards.slice(0, 6).map((nft, index) => (
                        <div key={index} className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                          L{index + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Github className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Share More Projects</p>
                  <p className="text-xs text-gray-600">Add more repos to increase your XP</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Trophy className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-sm">Earn NFT Rewards</p>
                  <p className="text-xs text-gray-600">Reach level 10 for exclusive NFTs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Builder;
