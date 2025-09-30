import { NextRequest, NextResponse } from 'next/server'
import { getPendingTransfer, updatePendingTransferStatus, createTransaction, getUserByUserId, updateTransaction } from '@/lib/models'
import { prepareSimplifiedEscrowAdminRelease } from '@/lib/simplified-escrow'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { validateCDPAuth, requireUserMatch, requireEmailMatch, extractEmailFromCDPUser, extractUserIdFromCDPUser } from '@/lib/auth'
import { z } from 'zod'
import { Address, createWalletClient, createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base, baseSepolia } from 'viem/chains'

// CDP User type with smart accounts
interface CDPUser {
  userId?: string
  email?: string
  evmSmartAccounts?: string[]
}

// Validation schema (simplified - no claim token needed)
const AdminReleaseRequestSchema = z.object({
  transferId: z.string().min(1, 'Transfer ID is required'),
  userId: z.string().min(1, 'User ID is required'),
})

// Admin wallet configuration
const ADMIN_PRIVATE_KEY = process.env.ADMIN_WALLET_PRIVATE_KEY
if (!ADMIN_PRIVATE_KEY) {
  console.error('ADMIN_WALLET_PRIVATE_KEY not set in environment variables')
}

/**
 * Simplified Admin Release API - Handles gasless claiming
 * This endpoint is called when users click "Claim" - admin wallet pays gas, user receives USDC
 * Uses CDP email authentication only (no claim tokens/secrets)
 * Security: CDP proves email ownership, admin releases funds to authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    // Validate CDP authentication first
    const authResult = await validateCDPAuth(request)
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication required' },
        { status: authResult.status || 401 }
      )
    }

    if (!ADMIN_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'Admin wallet not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    
    // Validate request (simplified - no claim token needed)
    const { transferId, userId } = AdminReleaseRequestSchema.parse(body)
    
    // Verify the authenticated user matches the request
    const authenticatedUserId = extractUserIdFromCDPUser(authResult.user)
    if (!authenticatedUserId || !requireUserMatch(authenticatedUserId, userId)) {
      return NextResponse.json(
        { error: 'Authentication mismatch - you can only claim your own transfers' },
        { status: 403 }
      )
    }
    
    // Get user info
    const claimer = await getUserByUserId(userId)
    if (!claimer) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 400 }
      )
    }
    
    // Get pending transfer
    const transfer = await getPendingTransfer(transferId)
    if (!transfer) {
      return NextResponse.json(
        { error: 'Transfer not found' },
        { status: 404 }
      )
    }
    
    // Verify this transfer is for this user
    if (transfer.recipientEmail.toLowerCase() !== claimer.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Transfer not intended for this user' },
        { status: 403 }
      )
    }
    
    // SECURITY: Verify the authenticated user's email matches the transfer recipient
    const authenticatedEmail = extractEmailFromCDPUser(authResult.user)
    if (!authenticatedEmail) {
      return NextResponse.json(
        { error: 'Unable to verify authenticated email address' },
        { status: 403 }
      )
    }
    
    if (!requireEmailMatch(authenticatedEmail, transfer.recipientEmail)) {
      return NextResponse.json(
        { error: 'Authenticated email does not match transfer recipient' },
        { status: 403 }
      )
    }
    
    // No claim token verification needed - CDP authentication is our security layer
    
    // Check if transfer is still pending
    if (transfer.status !== 'pending') {
      return NextResponse.json(
        { error: 'Transfer has already been claimed or expired' },
        { status: 400 }
      )
    }
    
    // Check if not expired
    const now = new Date()
    if (transfer.expiryDate && now > transfer.expiryDate) {
      return NextResponse.json(
        { error: 'Transfer has expired' },
        { status: 400 }
      )
    }
    
    // Get smart account address from CDP authentication
    const cdpUser = authResult.user as CDPUser
    const userSmartAccounts = cdpUser?.evmSmartAccounts
    if (!userSmartAccounts || userSmartAccounts.length === 0) {
      return NextResponse.json(
        { error: 'User does not have a smart account set up' },
        { status: 400 }
      )
    }

    // Use the first smart account (users only have smart accounts now)
    const recipientAddress = userSmartAccounts[0]
    console.log('📱 Releasing funds to smart account:', recipientAddress)

    try {
      // Set up admin wallet and public client for gas estimation
      const adminAccount = privateKeyToAccount(ADMIN_PRIVATE_KEY as `0x${string}`)
      // Use consistent network detection logic
      const getChainConfig = () => {
        const configuredChainId = process.env.NEXT_PUBLIC_BASE_CHAIN_ID
        const configuredRpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL
        
        if (configuredChainId) {
          return parseInt(configuredChainId) === 84532 ? baseSepolia : base
        }
        
        if (configuredRpcUrl?.includes('sepolia')) {
          return baseSepolia
        }
        
        return process.env.NODE_ENV === 'development' ? baseSepolia : base
      }
      
      const chainConfig = getChainConfig()
      
      const publicClient = createPublicClient({
        chain: chainConfig,
        transport: http(),
      })
      
      const adminClient = createWalletClient({
        account: adminAccount,
        chain: chainConfig,
        transport: http(),
      })

      // Prepare the simplified admin release transaction
      // Use email-only verification (no claim secrets needed)
      console.log('📧 Releasing to authenticated email:', transfer.recipientEmail)
      const transaction = await prepareSimplifiedEscrowAdminRelease({
        transferId,
        recipientEmail: transfer.recipientEmail,
        recipientAddress: recipientAddress as Address
      })

      // Send transaction from admin wallet (admin pays gas!)
      // Get current gas prices for Base network
      const gasPrice = await publicClient.getGasPrice()
      const feeData = await publicClient.estimateFeesPerGas()
      
      const txHash = await adminClient.sendTransaction({
        to: transaction.to as Address,
        data: transaction.data,
        value: transaction.value,
        gas: BigInt(200000), // Set higher gas limit for admin release
        maxFeePerGas: feeData.maxFeePerGas ? (feeData.maxFeePerGas * BigInt(12)) / BigInt(10) : gasPrice * BigInt(2), // 1.2x or 2x
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? (feeData.maxPriorityFeePerGas * BigInt(12)) / BigInt(10) : BigInt(1000000000), // 1.2x or 1 gwei
      })

      // Update transfer status in database
      await updatePendingTransferStatus(transferId, 'claimed', txHash)

      // Record the transaction for the recipient
      await createTransaction({
        userId: claimer.userId,
        userEmail: claimer.email,
        type: 'received',
        counterpartyEmail: transfer.senderEmail, // Who they received money FROM
        amount: `+${transfer.amount}`, // Positive for money entering account
        txHash: txHash,
        transferId,
        status: 'confirmed',
      })

      // Update sender's transaction status from 'pending' to 'confirmed'
      await updateTransaction(transferId, {
        status: 'confirmed',
        txHash: txHash
      })

      return NextResponse.json({
        success: true,
        txHash: txHash,
        amount: transfer.amount,
        message: `Successfully claimed ${transfer.amount} USDC! Funds have been sent to your wallet.`,
        gasFreeClaim: true
      })
      
    } catch (error) {
      console.error('Error executing admin release:', error)
      
      // Provide helpful error messages
      if (error instanceof Error) {
        if (error.message.includes('insufficient funds')) {
          return NextResponse.json(
            { error: 'Admin wallet has insufficient ETH for gas. Please contact support.' },
            { status: 500 }
          )
        }
        if (error.message.includes('SimpleEscrow contract not deployed')) {
          return NextResponse.json(
            { error: 'Escrow system is not ready. Please contact support.' },
            { status: 501 }
          )
        }
        if (error.message.includes('Email mismatch')) {
          return NextResponse.json(
            { error: 'Email verification failed. This transfer is not for your email address.' },
            { status: 403 }
          )
        }
      }
      
      return NextResponse.json(
        { error: 'Failed to release funds. Please contact support if the issue persists.' },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Admin release request error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint removed for security reasons - was exposing admin wallet address
// If admin monitoring is needed, implement with proper authentication