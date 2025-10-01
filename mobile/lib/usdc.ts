import { createPublicClient, http, formatUnits } from 'viem';
import { baseSepolia } from 'viem/chains';

// USDC contract address on Base Sepolia
const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

// Create public client
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.EXPO_PUBLIC_BASE_RPC_URL || 'https://sepolia.base.org')
});

// USDC has 6 decimals
const USDC_DECIMALS = 6;

export async function getUSDCBalance(address: string): Promise<string> {
  try {
    const balance = await publicClient.readContract({
      address: USDC_ADDRESS as `0x${string}`,
      abi: [
        {
          name: 'balanceOf',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ name: 'account', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }],
        },
      ],
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    });

    return formatUnits(balance as bigint, USDC_DECIMALS);
  } catch (error) {
    console.error('Error fetching USDC balance:', error);
    return '0';
  }
}
