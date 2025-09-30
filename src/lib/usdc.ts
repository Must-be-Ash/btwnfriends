import { createPublicClient, http, formatUnits, parseUnits } from 'viem'
import { base, baseSepolia } from 'viem/chains'

// USDC contract addresses
const USDC_BASE_MAINNET = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const USDC_BASE_SEPOLIA = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'

// Get the appropriate chain and USDC address based on environment variables
const getNetworkConfig = () => {
  const configuredChainId = process.env.NEXT_PUBLIC_BASE_CHAIN_ID
  const configuredRpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL
  
  // If chain ID is explicitly configured, use it
  if (configuredChainId) {
    const chainId = parseInt(configuredChainId)
    return {
      chain: chainId === 84532 ? baseSepolia : base,
      usdcAddress: chainId === 84532 ? USDC_BASE_SEPOLIA : USDC_BASE_MAINNET,
      isTestnet: chainId === 84532
    }
  }
  
  // If RPC URL contains sepolia, use testnet
  if (configuredRpcUrl?.includes('sepolia')) {
    return {
      chain: baseSepolia,
      usdcAddress: USDC_BASE_SEPOLIA,
      isTestnet: true
    }
  }
  
  // Default fallback based on NODE_ENV
  const isDevelopment = process.env.NODE_ENV === 'development'
  return {
    chain: isDevelopment ? baseSepolia : base,
    usdcAddress: isDevelopment ? USDC_BASE_SEPOLIA : USDC_BASE_MAINNET,
    isTestnet: isDevelopment
  }
}

const networkConfig = getNetworkConfig()
const chain = networkConfig.chain
const usdcAddress = networkConfig.usdcAddress

// Create public client
const publicClient = createPublicClient({
  chain,
  transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || (networkConfig.isTestnet ? 'https://sepolia.base.org' : 'https://mainnet.base.org'))
})

// USDC has 6 decimals
const USDC_DECIMALS = 6

export async function getUSDCBalance(address: string): Promise<string> {
  try {
    const balance = await publicClient.readContract({
      address: usdcAddress as `0x${string}`,
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
    })

    return formatUnits(balance as bigint, USDC_DECIMALS)
  } catch (error) {
    console.error('Error fetching USDC balance:', error)
    return '0'
  }
}

export function parseUSDCAmount(amount: string): bigint {
  return parseUnits(amount, USDC_DECIMALS)
}

export function formatUSDCAmount(amount: bigint): string {
  return formatUnits(amount, USDC_DECIMALS)
}

export const USDC_CONTRACT_ADDRESS = usdcAddress
export const USDC_CHAIN = chain

// Export publicClient for other modules
export { publicClient }

export interface USDCTransactionRequest {
  to: string
  value: bigint
  data: string
  chainId: number
  type: "eip1559"
}

export async function getCurrentGasPrice(): Promise<bigint> {
  try {
    const gasPrice = await publicClient.getGasPrice()
    return gasPrice
  } catch (error) {
    console.error('Error getting gas price:', error)
    return parseUnits('20', 9) // 20 gwei fallback
  }
}

export async function hasSufficientBalance(address: string, amount: string): Promise<boolean> {
  try {
    const balance = await getUSDCBalance(address)
    console.log('🔍 BALANCE CHECK:', {
      address,
      balance,
      requiredAmount: amount,
      hasSufficient: parseFloat(balance) >= parseFloat(amount)
    })
    return parseFloat(balance) >= parseFloat(amount)
  } catch (error) {
    console.error('Error checking balance:', error)
    return false
  }
}

export async function getETHBalance(address: string): Promise<string> {
  try {
    const balance = await publicClient.getBalance({
      address: address as `0x${string}`
    })
    return formatUnits(balance, 18) // ETH has 18 decimals
  } catch (error) {
    console.error('Error fetching ETH balance:', error)
    return '0'
  }
}

export async function hasSufficientETHForGas(address: string, gasLimit: bigint, maxFeePerGas: bigint): Promise<boolean> {
  try {
    const ethBalance = await getETHBalance(address)
    const requiredETH = gasLimit * maxFeePerGas
    const requiredETHFormatted = formatUnits(requiredETH, 18)
    
    console.log('🔍 ETH BALANCE CHECK:', {
      address,
      ethBalance,
      requiredETH: requiredETHFormatted,
      hasSufficient: parseFloat(ethBalance) >= parseFloat(requiredETHFormatted)
    })
    
    return parseFloat(ethBalance) >= parseFloat(requiredETHFormatted)
  } catch (error) {
    console.error('Error checking ETH balance:', error)
    return false
  }
}

export async function hasSufficientAllowance(
  owner: string, 
  spender: string, 
  amount: string
): Promise<boolean> {
  try {
    const allowance = await publicClient.readContract({
      address: usdcAddress as `0x${string}`,
      abi: [
        {
          name: 'allowance',
          type: 'function',
          stateMutability: 'view',
          inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' }
          ],
          outputs: [{ name: '', type: 'uint256' }],
        },
      ],
      functionName: 'allowance',
      args: [owner as `0x${string}`, spender as `0x${string}`],
    })

    const allowanceAmount = formatUnits(allowance as bigint, USDC_DECIMALS)
    return parseFloat(allowanceAmount) >= parseFloat(amount)
  } catch (error) {
    console.error('Error checking allowance:', error)
    return false
  }
}

export function prepareUSDCTransfer(senderAddress: string, recipientAddress: string, amount: string): USDCTransactionRequest {
  const amountWei = parseUnits(amount, USDC_DECIMALS)
  const data = `0xa9059cbb${recipientAddress.slice(2).padStart(64, '0')}${amountWei.toString(16).padStart(64, '0')}`
  
  return {
    to: usdcAddress,
    value: BigInt(0),
    data,
    chainId: chain.id,
    type: "eip1559"
  }
}

export function prepareUSDCApproval(_senderAddress: string, spender: string, amount: string): USDCTransactionRequest {
  const amountWei = parseUnits(amount, USDC_DECIMALS)
  const data = `0x095ea7b3${spender.slice(2).padStart(64, '0')}${amountWei.toString(16).padStart(64, '0')}`
  
  
  return {
    to: usdcAddress,
    value: BigInt(0),
    data,
    chainId: chain.id,
    type: "eip1559"
  }
}