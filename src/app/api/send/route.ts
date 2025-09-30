import { NextRequest, NextResponse } from 'next/server'
import { lookupRecipientServer } from '@/lib/recipient-lookup'
import { prepareUSDCTransfer, hasSufficientBalance, hasSufficientAllowance, prepareUSDCApproval, hasSufficientETHForGas, getCurrentGasPrice } from '@/lib/usdc'
import { generateTransferId as generateSimpleTransferId } from '@/lib/simplified-escrow'
import { createPendingTransfer, getUserByUserId } from '@/lib/models'
import { calculateExpiryDate } from '@/lib/cdp'
import { validateCDPAuth, extractUserIdFromCDPUser } from '@/lib/auth'
import { z } from 'zod'
import { Address } from 'viem'

// calculateExpiryDate is imported from @/lib/cdp

// Helper function to recursively serialize BigInt values
function serializeBigInt(obj: unknown): unknown {
  if (typeof obj === 'bigint') {
    return obj.toString()
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt)
  }
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeBigInt(value)
    }
    return result
  }
  return obj
}

// Validation schema
const SendRequestSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  senderAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid sender address'),
  recipientEmail: z.string().email('Invalid recipient email'),
  amount: z.string().regex(/^\d+(\.\d{1,6})?$/, 'Invalid amount format'),
  smartAccountMode: z.boolean().optional(), // Flag to indicate smart account usage
})

export async function POST(request: NextRequest) {
  try {
    // Validate CDP authentication
    const authResult = await validateCDPAuth(request)
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication required' },
        { status: authResult.status || 401 }
      )
    }

    const body = await request.json()
    
    // Validate request
    const { userId, senderAddress, recipientEmail, amount, smartAccountMode = false } = SendRequestSchema.parse(body)
    
    // Ensure user can only send from their own account
    const authenticatedUserId = extractUserIdFromCDPUser(authResult.user)
    if (!authenticatedUserId || authenticatedUserId !== userId) {
      return NextResponse.json(
        { error: 'You can only send funds from your own account' },
        { status: 403 }
      )
    }
    
    // Get sender's email from userId
    const sender = await getUserByUserId(userId)
    if (!sender) {
      return NextResponse.json(
        { error: 'Sender not found' },
        { status: 400 }
      )
    }
    const senderEmail = sender.email
    
    // Validate amount range
    const amountNum = parseFloat(amount)
    if (amountNum < 0.01 || amountNum > 1000000) {
      return NextResponse.json(
        { error: 'Amount must be between $0.01 and $1,000,000' },
        { status: 400 }
      )
    }
    
    // Check if sender has sufficient balance
    const hasSufficient = await hasSufficientBalance(senderAddress as Address, amount)
    if (!hasSufficient) {
      return NextResponse.json(
        { error: 'Insufficient USDC balance' },
        { status: 400 }
      )
    }
    
    // Lookup recipient to determine transfer type
    const recipient = await lookupRecipientServer(recipientEmail)
    console.log('🔍 RECIPIENT LOOKUP RESULT:', {
      email: '[EMAIL_REDACTED]',
      transferType: recipient.transferType,
      exists: recipient.exists,
      hasWallet: !!recipient.walletAddress
    })
    
    if (recipient.transferType === 'direct') {
      // Direct transfer to existing user
      if (!recipient.walletAddress) {
        return NextResponse.json(
          { error: 'Recipient wallet address not found' },
          { status: 400 }
        )
      }

      try {
        if (smartAccountMode) {
          // For smart accounts, return simplified response - frontend handles user operations
          console.log('🔍 SMART ACCOUNT DIRECT TRANSFER REQUEST:', {
            to: '[ADDRESS_REDACTED]',
            amount,
            smartAccountMode: true
          })

          const response = {
            success: true,
            transferType: 'direct',
            smartAccountMode: true,
            recipient: {
              email: recipient.email,
              displayName: recipient.displayName,
              walletAddress: recipient.walletAddress,
            },
            message: `Ready to send ${amount} USDC directly to ${recipient.displayName || recipient.email} via smart account`
          }

          return NextResponse.json(response)
        } else {
          // For EOA users, prepare traditional transaction
          const transaction = await prepareUSDCTransfer(
            senderAddress as Address,
            recipient.walletAddress as Address,
            amount
          )

          // Check if user has sufficient ETH for gas (using dynamic gas price)
          const currentGasPrice = await getCurrentGasPrice()
          const hasETHForGas = await hasSufficientETHForGas(
            senderAddress as Address,
            BigInt(100000), // Estimated gas limit for USDC transfer
            currentGasPrice // Use current network gas price
          )

          // Convert BigInt values to strings for JSON serialization
          const serializedTransaction: Record<string, unknown> = {
            to: transaction.to,
            value: transaction.value?.toString() || '0',
            data: transaction.data,
            chainId: transaction.chainId,
            type: transaction.type || 'eip1559',
            gasSponsored: !hasETHForGas // Flag to indicate if gas is sponsored
          }

          console.log('🔍 EOA DIRECT TRANSFER TRANSACTION:', {
            to: '[ADDRESS_REDACTED]',
            value: transaction.value?.toString(),
            type: transaction.type
          })

          const response = {
            success: true,
            transferType: 'direct',
            smartAccountMode: false,
            recipient: {
              email: recipient.email,
              displayName: recipient.displayName,
              walletAddress: recipient.walletAddress,
            },
            transaction: serializedTransaction,
            message: `Ready to send ${amount} USDC directly to ${recipient.displayName || recipient.email}`
          }

          return NextResponse.json(serializeBigInt(response))
        }
      } catch (error) {
        console.error('Direct transfer preparation error:', error)
        return NextResponse.json(
          { error: 'Failed to prepare direct transfer' },
          { status: 500 }
        )
      }
    } else {
      // Escrow transfer for new user
      try {
        // Generate transfer ID for SimplifiedEscrow (no claim token needed)
        const transferId = generateSimpleTransferId()
        const expiryDate = calculateExpiryDate(7) // 7 days

        // Import SimplifiedEscrow contract address
        const { SIMPLIFIED_ESCROW_ADDRESS } = await import('@/lib/simplified-escrow')
        const escrowAddress = SIMPLIFIED_ESCROW_ADDRESS

        // Store pending transfer in database (no claimToken needed)
        await createPendingTransfer({
          transferId,
          senderUserId: userId,
          senderEmail,
          recipientEmail,
          amount,
          status: 'pending',
          type: 'escrow',
          expiryDate,
          createdAt: new Date(),
          updatedAt: new Date()
        })

        if (smartAccountMode) {
          // For smart accounts, return simplified response - frontend handles user operations
          console.log('🔍 SMART ACCOUNT ESCROW TRANSFER REQUEST:', {
            transferId,
            amount,
            smartAccountMode: true
          })

          // Check if allowance is needed (for information purposes)
          const hasAllowance = await hasSufficientAllowance(
            senderAddress as Address,
            escrowAddress as Address,
            amount
          )

          const response = {
            success: true,
            transferType: 'escrow',
            smartAccountMode: true,
            recipient: {
              email: recipient.email,
            },
            transfer: {
              transferId,
              expiryDate: expiryDate.toISOString(),
            },
            escrowAddress,
            requiresApproval: !hasAllowance,
            message: `Ready to send ${amount} USDC via escrow to ${recipient.email} using smart account. ${!hasAllowance ? 'Approval required first. ' : ''}They will receive an email to claim the funds.`
          }

          return NextResponse.json(response)
        } else {
          // For EOA users, prepare traditional transactions
          const hasAllowance = await hasSufficientAllowance(
            senderAddress as Address,
            escrowAddress as Address,
            amount
          )

          // Prepare transactions - approval first if needed, then deposit
          const transactions: Array<Record<string, unknown>> = []

          if (!hasAllowance) {
            // Prepare approval transaction for the correct escrow contract
            const approvalTx = prepareUSDCApproval(
              senderAddress as string,
              escrowAddress as string,
              amount
            )
            // Serialize BigInt values
            const serializedApprovalTx = {
              ...approvalTx,
              value: approvalTx.value.toString(),
              description: `Approve USDC for SimplifiedEscrow contract`
            }
            transactions.push(serializedApprovalTx)
          }

          // Prepare escrow deposit transaction (email hash only, no secrets)
          // Only prepare if we have allowance, otherwise just store the parameters
          if (hasAllowance) {
            // Use SimplifiedEscrow contract
            const { prepareSimplifiedEscrowDeposit } = await import('@/lib/simplified-escrow')
            const depositTx = prepareSimplifiedEscrowDeposit({
              transferId,
              recipientEmail,
              amount
            })

            // Serialize BigInt values
            const serializedDepositTx = {
              ...depositTx,
              value: depositTx.value?.toString() || '0',
              description: `Deposit USDC to SimplifiedEscrow`
            }
            transactions.push(serializedDepositTx)
          } else {
            // Store deposit parameters for later preparation after approval
            transactions.push({
              type: 'simplified_escrow_deposit',
              parameters: {
                senderAddress,
                amount,
                transferId,
                recipientEmail,
                timeoutDays: 7
              },
              description: `Deposit USDC to SimplifiedEscrow`
            })
          }

          console.log('🔍 EOA ESCROW TRANSFER TRANSACTIONS:', {
            transferId,
            requiresApproval: !hasAllowance,
            transactionCount: transactions.length
          })

          const response = {
            success: true,
            transferType: 'escrow',
            smartAccountMode: false,
            recipient: {
              email: recipient.email,
            },
            transfer: {
              transferId,
              expiryDate: expiryDate.toISOString(),
            },
            transactions,
            requiresApproval: !hasAllowance,
            message: `Ready to send ${amount} USDC via escrow to ${recipient.email}. ${!hasAllowance ? 'Approval required first. ' : ''}They will receive an email to claim the funds.`
          }

          return NextResponse.json(serializeBigInt(response))
        }
      } catch (error) {
        console.error('Escrow transfer preparation error:', error)
        return NextResponse.json(
          { error: 'Failed to prepare escrow transfer' },
          { status: 500 }
        )
      }
    }
  } catch (error) {
    console.error('Send request error:', error)
    
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

// POST - Confirm transaction (after user signs)
export async function PUT(request: NextRequest) {
  try {
    // Validate CDP authentication
    const authResult = await validateCDPAuth(request)
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication required' },
        { status: authResult.status || 401 }
      )
    }

    const body = await request.json()
    const { transferId, txHash, transferType } = body
    
    if (!transferId || !txHash || !transferType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    if (transferType === 'escrow') {
      // Update pending transfer with deposit transaction hash
      const { updatePendingTransferStatus } = await import('@/lib/models')
      await updatePendingTransferStatus(transferId, 'pending', txHash)
      
      // TODO: Send email notification to recipient
      // This will be implemented when we set up Resend
    }
    
    return NextResponse.json({
      success: true,
      message: 'Transaction confirmed'
    })
  } catch (error) {
    console.error('Transaction confirmation error:', error)
    return NextResponse.json(
      { error: 'Failed to confirm transaction' },
      { status: 500 }
    )
  }
}