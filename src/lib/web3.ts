
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
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Check if we're on BNB Testnet
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (chainId !== BNB_TESTNET_CONFIG.chainId) {
        // Switch to BNB Testnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BNB_TESTNET_CONFIG.chainId }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [BNB_TESTNET_CONFIG],
            });
          }
        }
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      return {
        account: accounts[0],
        provider,
        signer,
      };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  } else {
    throw new Error('MetaMask not installed');
  }
};

export const getProvider = () => {
  if (typeof window.ethereum !== 'undefined') {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
};
