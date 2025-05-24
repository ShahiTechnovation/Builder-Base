
import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BuilderProfile, BeginnerProfile, HabitEntry } from '../types';
import { User, Trophy, Zap, Calendar, Github, Target, TrendingUp, Award } from 'lucide-react';

const Profile = () => {
  const { account, isConnected } = useWeb3();
  const [builderProfile, setBuilderProfile] = useState<BuilderProfile | null>(null);
  const [learnerProfile, setLearnerProfile] = useState<BeginnerProfile | null>(null);
  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([]);

  useEffect(() => {
    if (account) {
      loadProfiles();
    }
  }, [account]);

  const loadProfiles = () => {
    // Load builder profile
    const savedBuilderProfile = localStorage.getItem(`builder_${account}`);
    if (savedBuilderProfile) {
      setBuilderProfile(JSON.parse(savedBuilderProfile));
    }

    // Load learner profile
    const savedLearnerProfile = localStorage.getItem(`learner_${account}`);
    if (savedLearnerProfile) {
      setLearnerProfile(JSON.parse(savedLearnerProfile));
    }

    // Load habit entries
    const savedEntries = localStorage.getItem('habitEntries');
    if (savedEntries) {
      setHabitEntries(JSON.parse(savedEntries));
    }
  };

  const getHabitStats = () => {
    const totalEntries = habitEntries.length;
    const last7Days = habitEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    }).length;

    const moodCounts = habitEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonMood = Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0];

    return {
      totalEntries,
      last7Days,
      mostCommonMood: mostCommonMood ? mostCommonMood[0] : 'productive'
    };
  };

  const calculateTotalXP = () => {
    return (builderProfile?.xp || 0) + (learnerProfile?.xp || 0);
  };

  const calculateOverallLevel = () => {
    const totalXP = calculateTotalXP();
    return Math.floor(totalXP / 1000) + 1;
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-4">
              Please connect your wallet to view your profile
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const habitStats = getHabitStats();
  const totalXP = calculateTotalXP();
  const overallLevel = calculateOverallLevel();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-gray-600">
          Track your progress as both a builder and learner
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-900">L{overallLevel}</div>
            <div className="text-sm text-blue-700">Overall Level</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-green-900">{totalXP.toLocaleString()}</div>
            <div className="text-sm text-green-700">Total XP</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-orange-900">
              {(builderProfile?.totalProjects || 0) + (learnerProfile?.completedProjects || 0)}
            </div>
            <div className="text-sm text-orange-700">Total Projects</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-900">{habitStats.totalEntries}</div>
            <div className="text-sm text-purple-700">Habit Entries</div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="learner">Learner</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Account Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Wallet Address:</span>
                  <span className="font-mono text-sm">
                    {account?.slice(0, 6)}...{account?.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GitHub:</span>
                  <span className="font-medium">
                    {builderProfile?.githubUsername ? `@${builderProfile.githubUsername}` : 'Not connected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since:</span>
                  <span className="font-medium">
                    {builderProfile?.joinedAt 
                      ? new Date(builderProfile.joinedAt).toLocaleDateString()
                      : learnerProfile?.joinedAt 
                      ? new Date(learnerProfile.joinedAt).toLocaleDateString()
                      : 'Today'
                    }
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Progress to Next Level */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Progress to Next Level</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">Level {overallLevel}</div>
                  <Progress value={(totalXP % 1000) / 10} className="h-3" />
                  <p className="text-sm text-gray-600 mt-2">
                    {1000 - (totalXP % 1000)} XP to level {overallLevel + 1}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {habitEntries.slice(-5).reverse().map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{entry.entry}</p>
                        <p className="text-xs text-gray-500">{entry.date}</p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {entry.mood}
                      </Badge>
                    </div>
                  ))}
                  {habitEntries.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No recent activity. Start tracking your development habits!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          {builderProfile ? (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Github className="h-5 w-5" />
                    <span>Builder Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{builderProfile.level}</div>
                      <div className="text-sm text-gray-600">Builder Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{builderProfile.xp.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Builder XP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{builderProfile.totalProjects}</div>
                      <div className="text-sm text-gray-600">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{builderProfile.nftRewards.length}</div>
                      <div className="text-sm text-gray-600">NFT Rewards</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Achievement NFTs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {builderProfile.nftRewards.length > 0 ? (
                    <div className="grid grid-cols-4 gap-3">
                      {builderProfile.nftRewards.map((nft, index) => (
                        <div key={index} className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center text-white font-bold">
                          L{index + 1}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No NFT rewards yet. Keep building to earn achievements!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Github className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Builder Profile</h3>
                <p className="text-gray-500 mb-4">
                  You haven't set up your builder profile yet.
                </p>
                <Button>Go to Builder Dashboard</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="learner" className="space-y-6">
          {learnerProfile ? (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Learning Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{learnerProfile.level}</div>
                      <div className="text-sm text-gray-600">Learner Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{learnerProfile.xp.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Learning XP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{learnerProfile.completedProjects}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{learnerProfile.currentLearningPaths.length}</div>
                      <div className="text-sm text-gray-600">In Progress</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5" />
                    <span>Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {learnerProfile.achievements.length > 0 ? (
                    <div className="space-y-2">
                      {learnerProfile.achievements.map((achievement, index) => (
                        <Badge key={index} variant="secondary" className="mr-2">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No achievements yet. Complete learning paths to earn badges!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Learner Profile</h3>
                <p className="text-gray-500 mb-4">
                  You haven't started any learning paths yet.
                </p>
                <Button>Go to Learner Dashboard</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="habits" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Habit Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{habitStats.totalEntries}</div>
                    <div className="text-sm text-gray-600">Total Entries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{habitStats.last7Days}</div>
                    <div className="text-sm text-gray-600">This Week</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-purple-600 capitalize">{habitStats.mostCommonMood}</div>
                  <div className="text-sm text-gray-600">Most Common Mood</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Habit Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {habitEntries.slice(-10).reverse().map((entry, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{entry.entry}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">{entry.date}</span>
                        <Badge variant="outline" className="capitalize text-xs">
                          {entry.mood}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {habitEntries.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No habit entries yet. Start tracking your daily development!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
