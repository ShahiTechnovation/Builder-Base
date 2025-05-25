
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { FileText, Copy, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReadmeViewerProps {
  content: string;
  repositoryName: string;
  repositoryUrl?: string;
}

export const ReadmeViewer: React.FC<ReadmeViewerProps> = ({
  content,
  repositoryName,
  repositoryUrl
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "README content copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy content to clipboard",
        variant: "destructive",
      });
    }
  };

  const formatReadmeContent = (text: string) => {
    // Simple markdown-like formatting for better readability
    return text
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold mt-6 mb-3 text-gray-900">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-semibold mt-5 mb-2 text-gray-800">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-medium mt-4 mb-2 text-gray-700">{line.slice(4)}</h3>;
        }
        
        // Code blocks
        if (line.startsWith('```')) {
          return <div key={index} className="bg-gray-100 p-2 rounded my-2 font-mono text-sm border-l-4 border-blue-500"></div>;
        }
        
        // Bullet points
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={index} className="flex items-start mb-1">
              <span className="text-blue-600 mr-2">•</span>
              <span className="text-gray-700">{line.slice(2)}</span>
            </div>
          );
        }
        
        // Links (simple detection)
        if (line.includes('http')) {
          const parts = line.split(/(https?:\/\/[^\s]+)/g);
          return (
            <p key={index} className="mb-2 text-gray-700">
              {parts.map((part, i) => 
                part.startsWith('http') ? (
                  <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                    {part}
                  </a>
                ) : part
              )}
            </p>
          );
        }
        
        // Regular paragraphs
        if (line.trim()) {
          return <p key={index} className="mb-2 text-gray-700 leading-relaxed">{line}</p>;
        }
        
        // Empty lines
        return <div key={index} className="mb-2"></div>;
      });
  };

  if (!content) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No README Available</h3>
          <p className="text-gray-500">This repository doesn't have a README file or it couldn't be fetched.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle className="text-xl">Project Documentation</CardTitle>
              <p className="text-gray-600 text-sm">README.md from {repositoryName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {content.length} characters
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Expand
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            Read the original project documentation to understand the implementation details and requirements.
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            {repositoryUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={repositoryUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View on GitHub
                </a>
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className={`rounded-lg border bg-gray-50 p-4 ${isExpanded ? 'h-96' : 'h-48'}`}>
          <div className="prose prose-sm max-w-none">
            {formatReadmeContent(content)}
          </div>
        </ScrollArea>
        
        {!isExpanded && content.length > 500 && (
          <div className="mt-3 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              Show full README ({Math.round(content.length / 1000)}k characters)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
