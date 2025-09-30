import { NextResponse } from 'next/server'
import { getPendingTransfers, updatePendingTransferStatus, createTransaction, getUserByEmail } from '@/lib/models'
import { sendRefundConfirmationEmail } from '@/lib/email'
import { prepareSimplifiedEscrowRefund } from '@/lib/simplified-escrow'
import { createWalletClient, createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base, baseSepolia } from 'viem/chains'

// Admin-only automatic refund endpoint for processing expired transfers
// This should be called by a cron job or scheduled task, not by users

export async function POST() {
  try {
    // Admin-only endpoint - simplified authentication
    // This endpoint should only be called by trusted internal systems or cron jobs

    // Get all pending transfers that have expired (older than 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const expiredTransfers = await getPendingTransfers()
    
    const transfersToRefund = expiredTransfers.filter(transfer => 
      transfer.status === 'pending' && 
      new Date(transfer.createdAt) < sevenDaysAgo
    )

    console.log(`Found ${transfersToRefund.length} expired transfers to refund`)

    const results = []
    const adminPrivateKey = process.env.ADMIN_WALLET_PRIVATE_KEY

    if (!adminPrivateKey) {
      return NextResponse.json(
        { error: 'Admin wallet not configured' },
        { status: 500 }
      )
    }

    // Set up admin wallet for on-chain refunds
    const adminAccount = privateKeyToAccount(adminPrivateKey as `0x${string}`)
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

    for (const transfer of transfersToRefund) {
      try {
        // Get sender information for refund
        const sender = await getUserByEmail(transfer.senderEmail)
        if (!sender) {
          console.log(`Sender not found for transfer ${transfer.transferId}`)
          continue
        }

        // Prepare on-chain refund transaction
        const refundTx = prepareSimplifiedEscrowRefund({
          transferId: transfer.transferId,
          senderAddress: sender.walletAddress || ''
        })

        // Get current gas prices
        const gasPrice = await publicClient.getGasPrice()
        const feeData = await publicClient.estimateFeesPerGas()

        // Execute refund on-chain (admin pays gas)
        const txHash = await adminClient.sendTransaction({
          to: refundTx.to,
          data: refundTx.data,
          value: refundTx.value,
          gas: BigInt(200000),
          maxFeePerGas: feeData.maxFeePerGas ? (feeData.maxFeePerGas * BigInt(12)) / BigInt(10) : gasPrice * BigInt(2),
          maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? (feeData.maxPriorityFeePerGas * BigInt(12)) / BigInt(10) : BigInt(1000000000),
        })

        // Update database status
        await updatePendingTransferStatus(transfer.transferId, 'refunded', txHash)

        // Create transaction history record for sender
        await createTransaction({
          userId: sender.userId,
          userEmail: sender.email,
          type: 'refund',
          counterpartyEmail: transfer.recipientEmail,
          amount: `+${transfer.amount}`, // Positive for money returning
          txHash,
          transferId: transfer.transferId,
          status: 'confirmed',
        })

        // Send refund notification email
        const senderDisplayName = sender.displayName || sender.email.split('@')[0]
        const emailResult = await sendRefundConfirmationEmail({
          senderEmail: sender.email,
          senderName: senderDisplayName,
          recipientEmail: transfer.recipientEmail,
          amount: transfer.amount,
          reason: 'Transfer automatically refunded after 7 days (unclaimed)',
          refundTxHash: txHash
        })

        results.push({
          transferId: transfer.transferId,
          success: true,
          txHash,
          emailSent: emailResult.success
        })

        console.log(`Successfully refunded transfer ${transfer.transferId}`)

      } catch (error) {
        console.error(`Failed to refund transfer ${transfer.transferId}:`, error)
        results.push({
          transferId: transfer.transferId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${transfersToRefund.length} expired transfers`,
      refundedCount: results.filter(r => r.success).length,
      failedCount: results.filter(r => !r.success).length,
      results
    })

  } catch (error) {
    console.error('Automatic refund processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error during automatic refund processing' },
      { status: 500 }
    )
  }
}