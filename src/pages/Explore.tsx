
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { BuilderProfile } from '../types';
import { Search, Star, GitFork, ExternalLink, Calendar, Code, Trophy, Users, Filter } from 'lucide-react';

const Explore = () => {
  const [builders, setBuilders] = useState<BuilderProfile[]>([]);
  const [filteredBuilders, setFilteredBuilders] = useState<BuilderProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [sortBy, setSortBy] = useState('xp');

  useEffect(() => {
    loadBuilders();
  }, []);

  useEffect(() => {
    filterAndSortBuilders();
  }, [builders, searchTerm, languageFilter, levelFilter, sortBy]);

  const loadBuilders = () => {
    const builderProfiles: BuilderProfile[] = [];
    
    // Load all builder profiles from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('builder_')) {
        const profile = JSON.parse(localStorage.getItem(key)!);
        if (profile.repositories?.length > 0) {
          builderProfiles.push(profile);
        }
      }
    }

    setBuilders(builderProfiles);
  };

  const filterAndSortBuilders = () => {
    let filtered = [...builders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(builder => 
        builder.githubUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
        builder.repositories.some(repo => 
          repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Language filter
    if (languageFilter !== 'all') {
      filtered = filtered.filter(builder =>
        builder.repositories.some(repo => repo.language === languageFilter)
      );
    }

    // Level filter
    if (levelFilter !== 'all') {
      const level = parseInt(levelFilter);
      filtered = filtered.filter(builder => builder.level >= level);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'xp':
          return b.xp - a.xp;
        case 'level':
          return b.level - a.level;
        case 'projects':
          return b.totalProjects - a.totalProjects;
        case 'recent':
          return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredBuilders(filtered);
  };

  const getAllLanguages = () => {
    const languages = new Set<string>();
    builders.forEach(builder => {
      builder.repositories.forEach(repo => {
        if (repo.language) {
          languages.add(repo.language);
        }
      });
    });
    return Array.from(languages).sort();
  };

  const getComplexityColor = (stars: number) => {
    if (stars >= 50) return 'bg-red-100 text-red-800';
    if (stars >= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getComplexityLabel = (stars: number) => {
    if (stars >= 50) return 'Advanced';
    if (stars >= 10) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Projects</h1>
        <p className="text-gray-600">
          Discover amazing projects from our community of builders
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search builders or projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {getAllLanguages().map(lang => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Builder Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="1">Level 1+</SelectItem>
                <SelectItem value="3">Level 3+</SelectItem>
                <SelectItem value="5">Level 5+</SelectItem>
                <SelectItem value="8">Level 8+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xp">Highest XP</SelectItem>
                <SelectItem value="level">Highest Level</SelectItem>
                <SelectItem value="projects">Most Projects</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{builders.length}</div>
            <div className="text-sm text-gray-600">Total Builders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Code className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {builders.reduce((sum, builder) => sum + builder.totalProjects, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{getAllLanguages().length}</div>
            <div className="text-sm text-gray-600">Languages</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {builders.reduce((sum, builder) => 
                sum + builder.repositories.reduce((repoSum, repo) => repoSum + repo.stargazers_count, 0), 0
              )}
            </div>
            <div className="text-sm text-gray-600">Total Stars</div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {filteredBuilders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Results Found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or search terms to find more projects.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredBuilders.map((builder) => (
            <Card key={builder.address} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>@{builder.githubUsername}</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        Level {builder.level}
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                      <span className="flex items-center">
                        <Trophy className="h-4 w-4 mr-1" />
                        {builder.xp.toLocaleString()} XP
                      </span>
                      <span className="flex items-center">
                        <Code className="h-4 w-4 mr-1" />
                        {builder.totalProjects} projects
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Joined {new Date(builder.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">#{builder.level}</div>
                    <div className="text-xs text-gray-500">Builder Rank</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {builder.repositories.slice(0, 6).map((repo) => (
                    <Card key={repo.id} className="p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold truncate">{repo.name}</h4>
                        <a 
                          href={repo.html_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 ml-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {repo.description || 'No description available'}
                      </p>
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            {repo.stargazers_count}
                          </span>
                          <span className="flex items-center">
                            <GitFork className="h-3 w-3 mr-1" />
                            {repo.forks_count}
                          </span>
                        </div>
                        <Badge className={getComplexityColor(repo.stargazers_count)}>
                          {getComplexityLabel(repo.stargazers_count)}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {repo.language && (
                          <Badge variant="outline" className="text-xs">
                            {repo.language}
                          </Badge>
                        )}
                        {repo.topics.slice(0, 2).map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
                
                {builder.repositories.length > 6 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline">
                      View All {builder.repositories.length} Projects
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
