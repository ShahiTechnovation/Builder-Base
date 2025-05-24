
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MessageCircle, Users, ExternalLink } from 'lucide-react';

const Community = () => {
  const openTelegram = () => {
    window.open('https://t.me/TheBuilderBase', '_blank');
  };

  const openWhatsApp = () => {
    window.open('https://chat.whatsapp.com/Iko7hynwsRmAl6PJu86HMJ', '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Join Our Community
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with fellow builders, share your projects, get help, and stay updated with the latest from Builder Base.
          </p>
        </div>

        {/* Community Links */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Telegram Card */}
          <Card className="border-2 border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Telegram Community</CardTitle>
              <CardDescription className="text-lg">
                Join our active Telegram group for real-time discussions, updates, and community support.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={openTelegram}
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Join Telegram
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* WhatsApp Card */}
          <Card className="border-2 border-green-200 bg-green-50 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">WhatsApp Community</CardTitle>
              <CardDescription className="text-lg">
                Connect with builders on WhatsApp for quick questions, networking, and project collaboration.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={openWhatsApp}
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Users className="mr-2 h-5 w-5" />
                Join WhatsApp
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Community Guidelines */}
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-600">Be Respectful</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Treat all members with respect and kindness</li>
                  <li>• Keep discussions constructive and helpful</li>
                  <li>• No spam, self-promotion, or off-topic content</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">Share & Learn</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Share your projects and get feedback</li>
                  <li>• Help others with their coding challenges</li>
                  <li>• Ask questions and learn from the community</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">500+</div>
              <div className="text-sm text-gray-600">Active Members</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">100+</div>
              <div className="text-sm text-gray-600">Projects Shared</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">50+</div>
              <div className="text-sm text-gray-600">Countries</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Community;
