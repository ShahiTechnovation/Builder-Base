
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { connectWallet, getProvider, switchNetwork, SUPPORTED_NETWORKS } from '../lib/web3';
import { toast } from 'sonner';

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  isConnected: boolean;
  currentNetwork: string | null;
  connect: (network?: keyof typeof SUPPORTED_NETWORKS) => Promise<void>;
  disconnect: () => void;
  switchToNetwork: (network: keyof typeof SUPPORTED_NETWORKS) => Promise<void>;
  loading: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [currentNetwork, setCurrentNetwork] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const connect = async (network: keyof typeof SUPPORTED_NETWORKS = 'opbnb') => {
    try {
      setLoading(true);
      console.log('Attempting to connect wallet to:', network);
      
      if (typeof window.ethereum === 'undefined') {
        toast.error('MetaMask is not installed. Please install MetaMask to continue.');
        throw new Error('MetaMask not installed');
      }

      const walletData = await connectWallet(network);
      console.log('Wallet connected:', walletData.account, 'Network:', walletData.network);
      
      setAccount(walletData.account);
      setProvider(walletData.provider);
      setSigner(walletData.signer);
      setCurrentNetwork(walletData.network);
      
      // Store connection in localStorage
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('preferredNetwork', network);
      toast.success(`Wallet connected to ${walletData.network}!`);
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      
      if (error.code === 4001) {
        toast.error('Connection request was rejected');
      } else if (error.message?.includes('MetaMask')) {
        toast.error('Please install MetaMask to connect your wallet');
      } else {
        toast.error('Failed to connect wallet. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchToNetwork = async (network: keyof typeof SUPPORTED_NETWORKS) => {
    try {
      setLoading(true);
      await switchNetwork(network);
      const networkConfig = SUPPORTED_NETWORKS[network];
      setCurrentNetwork(networkConfig.chainName);
      localStorage.setItem('preferredNetwork', network);
      toast.success(`Switched to ${networkConfig.chainName}`);
    } catch (error) {
      console.error('Failed to switch network:', error);
      toast.error('Failed to switch network');
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    console.log('Disconnecting wallet...');
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setCurrentNetwork(null);
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('preferredNetwork');
    toast.success('Wallet disconnected');
  };

  useEffect(() => {
    const initializeWallet = async () => {
      console.log('Initializing wallet...');
      const wasConnected = localStorage.getItem('walletConnected');
      const preferredNetwork = localStorage.getItem('preferredNetwork') as keyof typeof SUPPORTED_NETWORKS || 'opbnb';
      
      if (wasConnected && typeof window.ethereum !== 'undefined') {
        try {
          const provider = getProvider();
          if (provider) {
            const accounts = await provider.listAccounts();
            console.log('Found accounts:', accounts.length);
            
            if (accounts.length > 0) {
              const signer = await provider.getSigner();
              const network = await provider.getNetwork();
              
              setAccount(accounts[0].address);
              setProvider(provider);
              setSigner(signer);
              setCurrentNetwork(network.name);
              console.log('Auto-reconnected to:', accounts[0].address);
            }
          }
        } catch (error) {
          console.error('Failed to reconnect wallet:', error);
          localStorage.removeItem('walletConnected');
        }
      }
      setLoading(false);
    };

    initializeWallet();

    // Listen for account changes
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log('Accounts changed:', accounts);
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = () => {
        console.log('Chain changed, reloading...');
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      };
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        isConnected: !!account,
        currentNetwork,
        connect,
        disconnect,
        switchToNetwork,
        loading,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
