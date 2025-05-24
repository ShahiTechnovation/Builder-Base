
import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Wallet, LogOut, AlertCircle } from 'lucide-react';

export const WalletConnection = () => {
  const { account, isConnected, connect, disconnect, loading } = useWeb3();

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
            <div className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Connected</p>
                <p className="text-xs text-green-600">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={disconnect}
              className="hover:bg-red-50 hover:border-red-200"
            >
              <LogOut className="h-4 w-4" />
            </Button>
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
    <Button 
      onClick={connect}
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
    >
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
};
