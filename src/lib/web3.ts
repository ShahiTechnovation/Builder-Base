
import { ethers } from 'ethers';

// OpBNB Testnet configuration (default)
export const OPBNB_TESTNET_CONFIG = {
  chainId: '0x15EB', // 5611 in decimal
  chainName: 'opBNB Testnet',
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
    decimals: 18,
  },
  rpcUrls: ['https://opbnb-testnet-rpc.bnbchain.org'],
  blockExplorerUrls: ['https://testnet.opbnbscan.com/'],
};

// BNB Testnet configuration (fallback)
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

// Supported networks
export const SUPPORTED_NETWORKS = {
  opbnb: OPBNB_TESTNET_CONFIG,
  bnb: BNB_TESTNET_CONFIG,
};

export const connectWallet = async (preferredNetwork: keyof typeof SUPPORTED_NETWORKS = 'opbnb') => {
  console.log('connectWallet called with preferred network:', preferredNetwork);
  
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

    const targetNetwork = SUPPORTED_NETWORKS[preferredNetwork];
    
    // Check if we're on the preferred network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log('Current chain ID:', chainId, 'Target:', targetNetwork.chainId);
    
    if (chainId !== targetNetwork.chainId) {
      console.log(`Switching to ${targetNetwork.chainName}...`);
      // Switch to preferred network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetNetwork.chainId }],
        });
      } catch (switchError: any) {
        console.log('Switch error:', switchError);
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          console.log(`Adding ${targetNetwork.chainName}...`);
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [targetNetwork],
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
      network: targetNetwork.chainName,
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

export const switchNetwork = async (networkKey: keyof typeof SUPPORTED_NETWORKS) => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask not installed');
  }

  const targetNetwork = SUPPORTED_NETWORKS[networkKey];
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetNetwork.chainId }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [targetNetwork],
      });
    } else {
      throw switchError;
    }
  }
};
