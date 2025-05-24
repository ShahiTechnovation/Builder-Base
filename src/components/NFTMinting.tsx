
import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trophy, Crown, Zap, ExternalLink, Loader2 } from 'lucide-react';
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
  const { account, isConnected } = useWeb3();
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

    setMintingLevel(level);
    
    try {
      // Open the NFT minting page in a new tab
      const nftUrl = NFT_LEVELS[level as keyof typeof NFT_LEVELS];
      window.open(nftUrl, '_blank');
      
      toast({
        title: "NFT Minting Started",
        description: `Opening Level ${level} NFT minting page. Complete the process on the new tab.`,
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
            Unlock Your Builder Character
          </span>
        </CardTitle>
        <p className="text-gray-600">
          Mint exclusive NFTs based on your coding achievements and level up your builder status
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Level Display */}
        <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20">
          <div className={`w-20 h-20 bg-gradient-to-r ${getLevelColor(userLevel)} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
            <div className="text-white font-bold text-xl">L{userLevel}</div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Level {userLevel} Builder</h3>
          <p className="text-gray-600 mb-4">{userXP.toLocaleString()} XP Earned</p>
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
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
                className={`relative overflow-hidden transition-all duration-300 ${
                  unlocked 
                    ? 'bg-gradient-to-br from-white to-gray-50 border-2 border-purple-200 hover:shadow-lg hover:scale-105' 
                    : 'bg-gray-100 border-gray-200 opacity-60'
                }`}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getLevelColor(level)} rounded-full flex items-center justify-center mx-auto mb-3 ${unlocked ? 'shadow-md' : 'grayscale'}`}>
                    {getLevelIcon(level)}
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Level {level}</h4>
                  <p className="text-xs text-gray-600 mb-3">
                    {level === 1 && 'Beginner Builder'}
                    {level === 2 && 'Emerging Coder'}
                    {level === 3 && 'Skilled Developer'}
                    {level === 4 && 'Expert Builder'}
                    {level === 5 && 'Master Creator'}
                  </p>
                  
                  {unlocked ? (
                    <Button 
                      onClick={() => handleMintNFT(level)}
                      disabled={isMinting}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
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
                          Mint NFT
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

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ExternalLink className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">How NFT Minting Works</h4>
              <p className="text-sm text-blue-700 mb-2">
                Each level unlocks a unique NFT that represents your coding achievements. 
                Clicking "Mint NFT" will open the minting page in a new tab.
              </p>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Connect your wallet on the minting page</li>
                <li>• Complete the minting transaction</li>
                <li>• Your NFT will appear in your wallet</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
