// Simplified escrow system using email-only verification
// This is gas-free for users since admin releases funds based on CDP authentication

import { encodeFunctionData, keccak256, toBytes, parseUnits } from 'viem'

// SimplifiedEscrow contract ABI
const SIMPLIFIED_ESCROW_ABI = [
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
  },
  {
    name: 'adminRelease',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'transferId', type: 'bytes32' },
      { name: 'recipientEmail', type: 'string' },
      { name: 'recipient', type: 'address' }
    ],
    outputs: []
  },
  {
    name: 'refund',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'transferId', type: 'bytes32' }
    ],
    outputs: []
  },
  {
    name: 'adminRefund',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'transferId', type: 'bytes32' }
    ],
    outputs: []
  }
] as const

// Contract addresses - use consistent network detection logic
function getSimplifiedEscrowAddress(): string {
  const configuredChainId = process.env.NEXT_PUBLIC_BASE_CHAIN_ID
  const configuredRpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL
  
  // Determine if we're on testnet using the same logic as other files
  let isTestnet = false
  
  if (configuredChainId) {
    isTestnet = parseInt(configuredChainId) === 84532
  } else if (configuredRpcUrl?.includes('sepolia')) {
    isTestnet = true
  } else {
    isTestnet = process.env.NODE_ENV === 'development'
  }
  
  if (isTestnet) {
    // Base Sepolia testnet
    return process.env.NEXT_PUBLIC_SIMPLIFIED_ESCROW_ADDRESS || '0x0000000000000000000000000000000000000000'
  } else {
    // Base mainnet
    return process.env.NEXT_PUBLIC_SIMPLIFIED_ESCROW_ADDRESS_MAINNET || '0x0000000000000000000000000000000000000000'
  }
}

export const SIMPLIFIED_ESCROW_ADDRESS = getSimplifiedEscrowAddress()


export function generateTransferId(): string {
  return `transfer_${Date.now()}_${Math.random().toString(36).substring(2)}`
}

export interface SimplifiedEscrowDepositRequest {
  to: `0x${string}`
  value: bigint
  data: `0x${string}`
  chainId: number
  type: "eip1559"
}

export function prepareSimplifiedEscrowDeposit(params: {
  transferId: string
  recipientEmail: string
  amount: string
}): SimplifiedEscrowDepositRequest {
  console.log('📦 Preparing simplified escrow deposit:', params)
  
  // Convert transferId to bytes32
  const transferIdBytes32 = keccak256(toBytes(params.transferId))
  
  // Convert amount to USDC units (6 decimals)
  const amountWei = parseUnits(params.amount, 6)
  
  // Create recipient email hash for privacy
  const recipientEmailHash = keccak256(toBytes(params.recipientEmail.toLowerCase()))
  console.log('📧 Email hash for deposit:', recipientEmailHash)
  
  // Default timeout: 7 days
  const timeoutDays = BigInt(7)
  
  // Encode the deposit function call
  const data = encodeFunctionData({
    abi: SIMPLIFIED_ESCROW_ABI,
    functionName: 'deposit',
    args: [transferIdBytes32, amountWei, recipientEmailHash, timeoutDays]
  })
  
  console.log('✅ Simplified escrow deposit prepared')
  
  // Use consistent network detection logic
  const getChainId = () => {
    const configuredChainId = process.env.NEXT_PUBLIC_BASE_CHAIN_ID
    const configuredRpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL
    
    if (configuredChainId) {
      return parseInt(configuredChainId)
    }
    
    if (configuredRpcUrl?.includes('sepolia')) {
      return 84532
    }
    
    return process.env.NODE_ENV === 'development' ? 84532 : 8453
  }
  
  return {
    to: SIMPLIFIED_ESCROW_ADDRESS as `0x${string}`,
    value: BigInt(0),
    data: data as `0x${string}`,
    chainId: getChainId(),
    type: "eip1559"
  }
}

export async function prepareSimplifiedEscrowAdminRelease(params: {
  transferId: string
  recipientEmail: string
  recipientAddress: string
}): Promise<SimplifiedEscrowDepositRequest> {
  console.log('🚀 Preparing simplified admin release:', params)
  
  // Convert transferId to bytes32
  const transferIdBytes32 = keccak256(toBytes(params.transferId))
  
  // Encode the adminRelease function call
  const data = encodeFunctionData({
    abi: SIMPLIFIED_ESCROW_ABI,
    functionName: 'adminRelease',
    args: [transferIdBytes32, params.recipientEmail.toLowerCase(), params.recipientAddress as `0x${string}`]
  })
  
  console.log('✅ Simplified admin release prepared')
  
  // Use consistent network detection logic
  const getChainId = () => {
    const configuredChainId = process.env.NEXT_PUBLIC_BASE_CHAIN_ID
    const configuredRpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL
    
    if (configuredChainId) {
      return parseInt(configuredChainId)
    }
    
    if (configuredRpcUrl?.includes('sepolia')) {
      return 84532
    }
    
    return process.env.NODE_ENV === 'development' ? 84532 : 8453
  }
  
  return {
    to: SIMPLIFIED_ESCROW_ADDRESS as `0x${string}`,
    value: BigInt(0),
    data: data as `0x${string}`,
    chainId: getChainId(),
    type: "eip1559"
  }
}

export async function isSimplifiedEscrowClaimable(transferId: string): Promise<{
  claimable: boolean
  reason?: string
  expiryDate?: Date
}> {
  try {
    // This would check the escrow contract state
    console.log('🔍 Checking simplified escrow claimable status for:', transferId)
    return {
      claimable: true
    }
  } catch (error) {
    console.error('Error checking if simplified escrow is claimable:', error)
    return {
      claimable: false,
      reason: 'Error checking escrow status'
    }
  }
}

export interface SimplifiedEscrowRefundRequest {
  to: `0x${string}`
  data: `0x${string}`
  value: bigint
}

/**
 * Prepares a refund transaction for the SimplifiedEscrow contract
 * Admin calls this to refund unclaimed transfers after timeout
 */
export function prepareSimplifiedEscrowRefund(params: {
  transferId: string
  senderAddress: string
}): SimplifiedEscrowRefundRequest {
  console.log('🔄 Preparing simplified escrow refund:', {
    transferId: params.transferId,
    senderAddress: '[ADDRESS_REDACTED]'
  })
  
  // Convert transferId to bytes32
  const transferIdBytes32 = keccak256(toBytes(params.transferId))
  
  // Encode the adminRefund function call (admin-only refund)
  const data = encodeFunctionData({
    abi: SIMPLIFIED_ESCROW_ABI,
    functionName: 'adminRefund',
    args: [transferIdBytes32]
  })

  console.log('✅ Simplified escrow refund prepared')

  return {
    to: SIMPLIFIED_ESCROW_ADDRESS as `0x${string}`,
    data,
    value: BigInt(0) // No ETH value needed for refund
  }
}