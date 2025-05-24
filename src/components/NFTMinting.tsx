
import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trophy, Crown, Zap, ExternalLink, Loader2, Network } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface NFTMintingProps {
  userLevel: number;
  userXP: number;
}

const NFT_LEVELS = {
  1: 'https://builder-base-level-1.testnet.nfts2.me',
  2: 'https://builder-base-level-2.testnet.nfts2.me',
  3: 'https://builder-base-level-3.testnet.nfts2.me',
  4: 'https://lovely-builder-base-level-4.testnet.nfts2.me',
  5: 'https://builder-base-level-5.testnet.nfts2.me',
};

export const NFTMinting = ({ userLevel, userXP }: NFTMintingProps) => {
  const { account, isConnected, currentNetwork, switchToNetwork } = useWeb3();
  const [mintingLevel, setMintingLevel] = useState<number | null>(null);

  const handleMintNFT = async (level: number) => {
    if (!isConnected || !account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint NFTs",
        variant: "destructive",
      });
      return;
    }

    // Check if user is on OpBNB testnet, switch if not
    if (!currentNetwork?.toLowerCase().includes('opbnb')) {
      try {
        await switchToNetwork('opbnb');
        toast({
          title: "Network Switched",
          description: "Switched to OpBNB Testnet for optimal NFT minting",
        });
      } catch (error) {
        toast({
          title: "Network Switch Failed",
          description: "Please manually switch to OpBNB Testnet",
          variant: "destructive",
        });
        return;
      }
    }

    setMintingLevel(level);
    
    try {
      // Open the NFT minting page in a new tab
      const nftUrl = NFT_LEVELS[level as keyof typeof NFT_LEVELS];
      window.open(nftUrl, '_blank');
      
      toast({
        title: "NFT Minting Started",
        description: `Opening Level ${level} NFT minting page on OpBNB Testnet. Complete the process on the new tab.`,
      });
    } catch (error) {
      console.error('Error opening NFT minting:', error);
      toast({
        title: "Error",
        description: "Failed to open NFT minting page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setMintingLevel(null);
    }
  };

  const getLevelIcon = (level: number) => {
    if (level >= 5) return <Crown className="h-6 w-6" />;
    if (level >= 3) return <Trophy className="h-6 w-6" />;
    return <Zap className="h-6 w-6" />;
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'from-blue-400 to-blue-600';
      case 2: return 'from-green-400 to-green-600';
      case 3: return 'from-purple-400 to-purple-600';
      case 4: return 'from-orange-400 to-orange-600';
      case 5: return 'from-pink-400 to-pink-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const isLevelUnlocked = (level: number) => {
    return userLevel >= level;
  };

  if (!isConnected) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="h-6 w-6 text-purple-600" />
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Unlock Your Builder Character NFTs
          </span>
        </CardTitle>
        <p className="text-gray-600">
          Mint exclusive NFTs on OpBNB Testnet based on your coding achievements and level up your builder status
        </p>
        {currentNetwork && (
          <div className="flex items-center space-x-2">
            <Network className="h-4 w-4 text-blue-600" />
            <Badge variant="outline" className="text-xs">
              Connected: {currentNetwork}
            </Badge>
            {!currentNetwork.toLowerCase().includes('opbnb') && (
              <Badge variant="destructive" className="text-xs">
                Switch to OpBNB for better experience
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Level Display */}
        <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-blue-400/10 animate-pulse"></div>
          <div className={`w-20 h-20 bg-gradient-to-r ${getLevelColor(userLevel)} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce`}>
            <div className="text-white font-bold text-xl">L{userLevel}</div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Level {userLevel} Builder</h3>
          <p className="text-gray-600 mb-4">{userXP.toLocaleString()} XP Earned</p>
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white animate-pulse">
            {userLevel >= 5 ? 'Master Builder' : `${1000 - (userXP % 1000)} XP to next level`}
          </Badge>
        </div>

        {/* NFT Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((level) => {
            const unlocked = isLevelUnlocked(level);
            const isMinting = mintingLevel === level;
            
            return (
              <Card 
                key={level} 
                className={`relative overflow-hidden transition-all duration-300 transform ${
                  unlocked 
                    ? 'bg-gradient-to-br from-white to-gray-50 border-2 border-purple-200 hover:shadow-xl hover:scale-105 hover:-rotate-1' 
                    : 'bg-gray-100 border-gray-200 opacity-60 grayscale'
                }`}
              >
                <CardContent className="p-4 text-center">
                  {unlocked && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 bg-gradient-to-r ${getLevelColor(level)} rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-300 ${unlocked ? 'shadow-md hover:scale-110' : 'grayscale'}`}>
                    {getLevelIcon(level)}
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Level {level} NFT</h4>
                  <p className="text-xs text-gray-600 mb-3">
                    {level === 1 && 'Beginner Builder Badge'}
                    {level === 2 && 'Emerging Coder Certificate'}
                    {level === 3 && 'Skilled Developer Token'}
                    {level === 4 && 'Expert Builder Medal'}
                    {level === 5 && 'Master Creator Crown'}
                  </p>
                  
                  {unlocked ? (
                    <Button 
                      onClick={() => handleMintNFT(level)}
                      disabled={isMinting}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transform transition-all duration-200 hover:scale-105"
                      size="sm"
                    >
                      {isMinting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Opening...
                        </>
                      ) : (
                        <>
                          <Crown className="mr-2 h-4 w-4" />
                          Mint on OpBNB
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-2">Requires Level {level}</p>
                      <Badge variant="outline" className="text-xs">
                        {level * 1000} XP needed
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Info Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <ExternalLink className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">OpBNB Testnet NFT Minting</h4>
              <p className="text-sm text-blue-700 mb-2">
                Your Builder NFTs are minted on OpBNB Testnet for fast, low-cost transactions. 
                Each level unlocks a unique NFT that represents your coding achievements.
              </p>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Connect your wallet to OpBNB Testnet</li>
                <li>• Complete the minting transaction (very low fees!)</li>
                <li>• Your NFT will appear in your wallet instantly</li>
                <li>• Display your achievements on your profile</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
