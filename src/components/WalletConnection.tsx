
import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Wallet, LogOut, AlertCircle, Network, ChevronDown } from 'lucide-react';
import { SUPPORTED_NETWORKS } from '../lib/web3';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const WalletConnection = () => {
  const { account, isConnected, currentNetwork, connect, disconnect, switchToNetwork, loading } = useWeb3();
  const [isNetworkSwitching, setIsNetworkSwitching] = useState(false);

  const handleNetworkSwitch = async (network: keyof typeof SUPPORTED_NETWORKS) => {
    setIsNetworkSwitching(true);
    try {
      await switchToNetwork(network);
    } finally {
      setIsNetworkSwitching(false);
    }
  };

  if (loading) {
    return (
      <Button disabled className="animate-pulse">
        <Wallet className="mr-2 h-4 w-4" />
        Connecting...
      </Button>
    );
  }

  if (isConnected && account) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wallet className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Connected</p>
                <p className="text-xs text-green-600">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </p>
                {currentNetwork && (
                  <Badge variant="outline" className="text-xs mt-1">
                    {currentNetwork}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isNetworkSwitching}
                    className="hover:bg-blue-50 hover:border-blue-200"
                  >
                    <Network className="h-4 w-4 mr-1" />
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleNetworkSwitch('opbnb')}>
                    OpBNB Testnet
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNetworkSwitch('bnb')}>
                    BNB Testnet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="sm"
                onClick={disconnect}
                className="hover:bg-red-50 hover:border-red-200"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if MetaMask is available
  if (typeof window !== 'undefined' && typeof window.ethereum === 'undefined') {
    return (
      <div className="flex items-center space-x-2">
        <Button 
          onClick={() => window.open('https://metamask.io/download/', '_blank')}
          variant="outline"
          className="text-orange-600 border-orange-200 hover:bg-orange-50"
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          Install MetaMask
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => connect('opbnb')}>
          Connect to OpBNB Testnet
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => connect('bnb')}>
          Connect to BNB Testnet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
