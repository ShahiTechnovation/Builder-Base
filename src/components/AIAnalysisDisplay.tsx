
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { ReadmeViewer } from './ReadmeViewer';
import { 
  Brain, 
  Clock, 
  Target, 
  Code2, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Star,
  Zap,
  BookOpen,
  Wrench,
  FileText
} from 'lucide-react';
import { AIAnalysisResult } from '../lib/aiSimulation';

interface AIAnalysisDisplayProps {
  analysis: AIAnalysisResult;
  repositoryName: string;
  repositoryUrl?: string;
  onStartLearning?: () => void;
}

export const AIAnalysisDisplay: React.FC<AIAnalysisDisplayProps> = ({
  analysis,
  repositoryName,
  repositoryUrl,
  onStartLearning
}) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFeatureComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'High': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-purple-600" />
              <div>
                <CardTitle className="text-2xl">AI Analysis Complete</CardTitle>
                <p className="text-gray-600">Detailed roadmap for {repositoryName}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={getComplexityColor(analysis.projectOverview.complexity)}>
                {analysis.projectOverview.complexity} Level
              </Badge>
              <p className="text-sm text-gray-600 mt-1">+{analysis.xpReward} XP</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* README Viewer */}
      <ReadmeViewer 
        content={analysis.readmeContent} 
        repositoryName={repositoryName}
        repositoryUrl={repositoryUrl}
      />

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Project Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-gray-700">{analysis.projectOverview.description}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Main Purpose</h4>
            <p className="text-gray-700">{analysis.projectOverview.mainPurpose}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Target Audience</h4>
            <p className="text-gray-700">{analysis.projectOverview.targetAudience}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Difficulty Justification</h4>
            <p className="text-gray-700 text-sm">{analysis.difficultyJustification}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code2 className="h-5 w-5 text-green-600" />
            <span>Technology Stack</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.techStack.languages.map((lang) => (
                  <Badge key={lang} variant="outline">{lang}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Frameworks</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.techStack.frameworks.map((fw) => (
                  <Badge key={fw} variant="secondary">{fw}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Architecture</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.techStack.architecture.map((arch) => (
                  <Badge key={arch} className="bg-purple-100 text-purple-700">{arch}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Tools</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.techStack.tools.map((tool) => (
                  <Badge key={tool} className="bg-blue-100 text-blue-700">{tool}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-orange-600" />
            <span>Learning Roadmap</span>
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {analysis.learningRoadmap.estimatedTotalHours} hours total
            </span>
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {analysis.learningRoadmap.phases.length} phases
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prerequisites */}
          <div>
            <h4 className="font-semibold mb-2">Prerequisites</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.learningRoadmap.prerequisites.map((prereq, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {prereq}
                </Badge>
              ))}
            </div>
          </div>

          {/* Phases */}
          <div className="space-y-4">
            {analysis.learningRoadmap.phases.map((phase, index) => (
              <Card key={phase.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-semibold text-lg">
                        Phase {phase.id}: {phase.title}
                      </h5>
                      <p className="text-gray-600 text-sm">{phase.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {phase.estimatedHours}h
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">Deliverable:</p>
                    <p className="text-sm text-gray-700">{phase.deliverable}</p>
                  </div>

                  <div className="space-y-2">
                    {phase.steps.slice(0, 2).map((step) => (
                      <div key={step.id} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{step.title}</span>
                        <span className="text-gray-500">({step.estimatedTime})</span>
                      </div>
                    ))}
                    {phase.steps.length > 2 && (
                      <p className="text-xs text-gray-500">
                        +{phase.steps.length - 2} more steps...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Core Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wrench className="h-5 w-5 text-purple-600" />
            <span>Core Features to Build</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.buildingGuide.coreFeatures.map((feature, index) => (
              <Card key={index} className="p-4 border">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-semibold">{feature.name}</h5>
                  <div className="flex items-center space-x-2">
                    <Badge className={getFeatureComplexityColor(feature.complexity)}>
                      {feature.complexity}
                    </Badge>
                    <span className="text-sm text-gray-600">{feature.estimatedHours}h</span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">{feature.description}</p>
                <div className="flex flex-wrap gap-1">
                  {feature.keyComponents.map((component, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {component}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills You'll Gain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-600" />
            <span>Skills You'll Gain</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {analysis.skillsGained.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{skill}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      {onStartLearning && (
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Ready to Start Building?</h3>
            <p className="mb-4 opacity-90">
              Follow this AI-generated roadmap and earn {analysis.xpReward} XP!
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={onStartLearning}
              className="text-blue-600"
            >
              <Zap className="mr-2 h-5 w-5" />
              Start Learning Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
