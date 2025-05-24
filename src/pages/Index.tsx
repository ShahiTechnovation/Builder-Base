
import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Code2, Brain, Users, Trophy, Zap, Github, ArrowRight } from 'lucide-react';

const Index = () => {
  const { isConnected } = useWeb3();

  const features = [
    {
      icon: <Code2 className="h-8 w-8 text-blue-600" />,
      title: "Builder Hub",
      description: "Submit your GitHub repositories, get AI analysis, and earn XP & NFTs based on project complexity and innovation.",
      color: "border-blue-200 bg-blue-50"
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "AI-Powered Analysis",
      description: "Advanced AI analyzes your projects to create personalized learning paths and roadmaps for beginners.",
      color: "border-purple-200 bg-purple-50"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Learning Paths",
      description: "Follow step-by-step guides to rebuild amazing projects and level up your development skills.",
      color: "border-green-200 bg-green-50"
    },
    {
      icon: <Trophy className="h-8 w-8 text-orange-600" />,
      title: "NFT Rewards",
      description: "Earn unique NFTs and tokens for contributions, achievements, and learning milestones.",
      color: "border-orange-200 bg-orange-50"
    }
  ];

  const stats = [
    { label: "Active Builders", value: "250+", icon: <Code2 className="h-4 w-4" /> },
    { label: "Learning Paths", value: "150+", icon: <Brain className="h-4 w-4" /> },
    { label: "Projects Analyzed", value: "500+", icon: <Github className="h-4 w-4" /> },
    { label: "NFTs Minted", value: "1.2K+", icon: <Trophy className="h-4 w-4" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center py-16 max-w-4xl mx-auto">
        <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          🚀 Web3 Learning Platform
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
          Mint Your Mind.<br />Build Forever.
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          The ultimate Web3 platform where developers showcase projects, AI creates learning paths, 
          and beginners level up through hands-on building. Earn NFTs and tokens for every milestone.
        </p>
        
        {!isConnected ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-3">
              <Zap className="mr-2 h-5 w-5" />
              Connect Wallet to Start
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              <Github className="mr-2 h-5 w-5" />
              View Demo Projects
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/builder">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3">
                <Code2 className="mr-2 h-5 w-5" />
                Start Building
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/learner">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                <Users className="mr-2 h-5 w-5" />
                Start Learning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-6">
              <div className="flex justify-center mb-2 text-purple-600">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {features.map((feature, index) => (
          <Card key={index} className={`${feature.color} border-2 hover:shadow-lg transition-shadow`}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                {feature.icon}
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-700 text-base">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How It Works */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 mb-16">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-4">How Builder Base Works</CardTitle>
          <CardDescription className="text-lg max-w-2xl mx-auto">
            A simple 3-step process to revolutionize how developers share knowledge and beginners learn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Submit & Analyze</h3>
              <p className="text-gray-600">Builders submit GitHub repos. AI analyzes complexity, tech stack, and creates learning paths.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn & Build</h3>
              <p className="text-gray-600">Beginners follow step-by-step paths to rebuild projects and gain real-world experience.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn & Grow</h3>
              <p className="text-gray-600">Both builders and learners earn NFTs, tokens, and level up their profiles on the platform.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center">
        <CardContent className="p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers building the future of Web3 education
          </p>
          {!isConnected ? (
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              <Zap className="mr-2 h-5 w-5" />
              Connect Wallet Now
            </Button>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link to="/explore">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  Explore Projects
                </Button>
              </Link>
              <Link to="/profile">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-purple-600">
                  View Profile
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
