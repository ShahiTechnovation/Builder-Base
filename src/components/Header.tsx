
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletConnection } from './WalletConnection';
import { useWeb3 } from '../contexts/Web3Context';
import { Button } from './ui/button';
import { Code, Users, Compass, User } from 'lucide-react';

export const Header = () => {
  const { isConnected } = useWeb3();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              NeuralForge
            </span>
          </Link>

          {isConnected && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/explore">
                <Button 
                  variant={isActive('/explore') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2"
                >
                  <Compass className="h-4 w-4" />
                  <span>Explore</span>
                </Button>
              </Link>
              <Link to="/builder">
                <Button 
                  variant={isActive('/builder') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2"
                >
                  <Code className="h-4 w-4" />
                  <span>Builder</span>
                </Button>
              </Link>
              <Link to="/learner">
                <Button 
                  variant={isActive('/learner') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>Learner</span>
                </Button>
              </Link>
              <Link to="/profile">
                <Button 
                  variant={isActive('/profile') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Button>
              </Link>
            </nav>
          )}

          <WalletConnection />
        </div>
      </div>
    </header>
  );
};
