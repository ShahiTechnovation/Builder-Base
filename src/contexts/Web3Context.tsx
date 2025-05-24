
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { connectWallet, getProvider } from '../lib/web3';

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  loading: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [loading, setLoading] = useState(true);

  const connect = async () => {
    try {
      setLoading(true);
      const walletData = await connectWallet();
      setAccount(walletData.account);
      setProvider(walletData.provider);
      setSigner(walletData.signer);
      
      // Store connection in localStorage
      localStorage.setItem('walletConnected', 'true');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    localStorage.removeItem('walletConnected');
  };

  useEffect(() => {
    const initializeWallet = async () => {
      const wasConnected = localStorage.getItem('walletConnected');
      if (wasConnected && typeof window.ethereum !== 'undefined') {
        try {
          const provider = getProvider();
          if (provider) {
            const accounts = await provider.listAccounts();
            if (accounts.length > 0) {
              const signer = await provider.getSigner();
              setAccount(accounts[0].address);
              setProvider(provider);
              setSigner(signer);
            }
          }
        } catch (error) {
          console.error('Failed to reconnect wallet:', error);
        }
      }
      setLoading(false);
    };

    initializeWallet();

    // Listen for account changes
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        isConnected: !!account,
        connect,
        disconnect,
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
