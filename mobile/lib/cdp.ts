import { parseUnits, encodeFunctionData, keccak256, toBytes } from 'viem';

export const CONTRACT_ADDRESSES = {
  USDC: {
    8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base Mainnet
    84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia
  },
  SIMPLIFIED_ESCROW: {
    8453: '0x0000000000000000000000000000000000000000', // Base Mainnet - to be deployed
    84532: '0x1C182dDa2DE61c349bc516Fa8a63a371cA4CE184', // Base Sepolia
  }
};

export const CURRENT_NETWORK = (() => {
  const configuredChainId = process.env.EXPO_PUBLIC_BASE_CHAIN_ID;
  const configuredRpcUrl = process.env.EXPO_PUBLIC_BASE_RPC_URL;

  if (configuredChainId) {
    return parseInt(configuredChainId);
  }

  if (configuredRpcUrl?.includes('sepolia')) {
    return 84532;
  }

  // Always use Base Sepolia (testnet) for now
  return 84532;
})();

export function getCDPNetworkName(chainId?: number): 'base' | 'base-sepolia' {
  const networkId = chainId || CURRENT_NETWORK;
  switch (networkId) {
    case 8453:
      return 'base';
    case 84532:
      return 'base-sepolia';
    default:
      return __DEV__ ? 'base-sepolia' : 'base';
  }
}

export type SmartAccountCall = {
  to: `0x${string}`;
  value: bigint;
  data: `0x${string}`;
};

export function prepareUSDCTransferCall(
  recipientAddress: string,
  amount: string
): SmartAccountCall {
  const amountWei = parseUnits(amount, 6);
  
  const transferData = encodeFunctionData({
    abi: [
      {
        name: 'transfer',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }]
      }
    ],
    functionName: 'transfer',
    args: [recipientAddress as `0x${string}`, amountWei]
  });
  
  return {
    to: CONTRACT_ADDRESSES.USDC[CURRENT_NETWORK as keyof typeof CONTRACT_ADDRESSES.USDC] as `0x${string}`,
    value: BigInt(0),
    data: transferData
  };
}

export function prepareUSDCApprovalCall(
  spenderAddress: string,
  amount: string
): SmartAccountCall {
  const amountWei = parseUnits(amount, 6);
  
  const approveData = encodeFunctionData({
    abi: [
      {
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }]
      }
    ],
    functionName: 'approve',
    args: [spenderAddress as `0x${string}`, amountWei]
  });
  
  return {
    to: CONTRACT_ADDRESSES.USDC[CURRENT_NETWORK as keyof typeof CONTRACT_ADDRESSES.USDC] as `0x${string}`,
    value: BigInt(0),
    data: approveData
  };
}

export function prepareEscrowDepositCall(
  transferId: string,
  amount: string,
  recipientEmailHash: string,
  escrowAddress?: string,
  timeoutDays: number = 7
): SmartAccountCall {
  const amountWei = parseUnits(amount, 6);
  const transferIdBytes32 = keccak256(toBytes(transferId));

  const formattedEmailHash = recipientEmailHash.startsWith('0x')
    ? recipientEmailHash as `0x${string}`
    : `0x${recipientEmailHash}` as `0x${string}`;

  const depositData = encodeFunctionData({
    abi: [
      {
        name: 'deposit',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'transferId', type: 'bytes32' },
          { name: 'amount', type: 'uint256' },
          { name: 'recipientEmailHash', type: 'bytes32' },
          { name: 'timeoutDays', type: 'uint256' }
        ],
        outputs: []
      }
    ],
    functionName: 'deposit',
    args: [transferIdBytes32, amountWei, formattedEmailHash, BigInt(timeoutDays)]
  });

  const escrowContractAddress = escrowAddress || 
    CONTRACT_ADDRESSES.SIMPLIFIED_ESCROW[CURRENT_NETWORK as keyof typeof CONTRACT_ADDRESSES.SIMPLIFIED_ESCROW];

  return {
    to: escrowContractAddress as `0x${string}`,
    value: BigInt(0),
    data: depositData
  };
}

export function getBlockExplorerUrl(txHash: string, chainId?: number): string {
  const networkId = chainId || CURRENT_NETWORK;
  const baseUrl = networkId === 8453 ? 'https://basescan.org' : 'https://sepolia.basescan.org';
  return `${baseUrl}/tx/${txHash}`;
}
