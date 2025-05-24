
import { ethers } from 'ethers';

// BNB Testnet configuration
export const BNB_TESTNET_CONFIG = {
  chainId: '0x61', // 97 in decimal
  chainName: 'BNB Smart Chain Testnet',
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
    decimals: 18,
  },
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
  blockExplorerUrls: ['https://testnet.bscscan.com/'],
};

export const connectWallet = async () => {
  console.log('connectWallet called');
  
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask not installed');
  }

  try {
    console.log('Requesting accounts...');
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    console.log('Accounts received:', accounts);

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    // Check if we're on BNB Testnet
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log('Current chain ID:', chainId);
    
    if (chainId !== BNB_TESTNET_CONFIG.chainId) {
      console.log('Switching to BNB Testnet...');
      // Switch to BNB Testnet
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BNB_TESTNET_CONFIG.chainId }],
        });
      } catch (switchError: any) {
        console.log('Switch error:', switchError);
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          console.log('Adding BNB Testnet...');
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BNB_TESTNET_CONFIG],
          });
        } else {
          throw switchError;
        }
      }
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    console.log('Wallet connection successful');
    
    return {
      account: accounts[0],
      provider,
      signer,
    };
  } catch (error) {
    console.error('Error in connectWallet:', error);
    throw error;
  }
};

export const getProvider = () => {
  if (typeof window.ethereum !== 'undefined') {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
};
