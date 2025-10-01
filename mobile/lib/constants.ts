import Constants from 'expo-constants';

// Network configuration
export const CHAIN_ID = parseInt(process.env.EXPO_PUBLIC_CHAIN_ID || '84532'); // Base Sepolia by default
export const RPC_URL = process.env.EXPO_PUBLIC_BASE_RPC_URL || 'https://sepolia.base.org';

// Contract addresses
export const CONTRACT_ADDRESSES = {
  USDC: {
    8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base Mainnet
    84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia
  },
  SIMPLE_ESCROW: {
    8453: process.env.EXPO_PUBLIC_MAINNET_ESCROW_ADDRESS || '',
    84532: process.env.EXPO_PUBLIC_TESTNET_ESCROW_ADDRESS || '',
  }
} as const;

// Get current network contract addresses
export const USDC_ADDRESS = CONTRACT_ADDRESSES.USDC[CHAIN_ID as keyof typeof CONTRACT_ADDRESSES.USDC];
export const ESCROW_ADDRESS = CONTRACT_ADDRESSES.SIMPLE_ESCROW[CHAIN_ID as keyof typeof CONTRACT_ADDRESSES.SIMPLE_ESCROW];

// App info
export const APP_NAME = 'Between Friends';
export const APP_VERSION = Constants.expoConfig?.version || '1.0.0';
