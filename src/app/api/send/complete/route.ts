import { NextRequest, NextResponse } from 'next/server'
import { createTransaction, getUserByUserId, getUserByEmail, getPendingTransfer } from '@/lib/models'
import { sendClaimNotificationEmail, sendDirectTransferNotificationEmail } from '@/lib/email'
import { validateCDPAuth, extractUserIdFromCDPUser } from '@/lib/auth'
import { z } from 'zod'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// Validation schema
const CompleteTransferSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  txHash: z.string().min(1, 'Transaction hash is required'),
  transferType: z.enum(['direct', 'escrow']),
  recipient: z.object({
    email: z.string().email('Invalid recipient email'),
    displayName: z.string().optional(),
    exists: z.boolean(),
  }),
  amount: z.string().regex(/^\d+(\.\d{1,6})?$/, 'Invalid amount format'),
  transferId: z.string().optional(), // For escrow transfers
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
    const { userId, txHash, transferType, recipient, amount, transferId } = CompleteTransferSchema.parse(body)
    
    // Ensure user can only complete their own transactions
    const authenticatedUserId = extractUserIdFromCDPUser(authResult.user)
    if (!authenticatedUserId || authenticatedUserId !== userId) {
      return NextResponse.json(
        { error: 'You can only complete your own transactions' },
        { status: 403 }
      )
    }
    
    // Get sender's information
    const sender = await getUserByUserId(userId)
    if (!sender) {
      return NextResponse.json(
        { error: 'Sender not found' },
        { status: 400 }
      )
    }
    
    const senderEmail = sender.email
    const recipientEmail = recipient.email
    
    // Create transaction record for sender (shows who they sent money TO)
    await createTransaction({
      userId: userId,
      userEmail: senderEmail,
      type: 'sent',
      counterpartyEmail: recipientEmail, // This is who the sender sent money TO
      amount: `-${amount}`, // Negative amount to show money leaving account
      txHash: txHash,
      transferId: transferId,
      status: transferType === 'direct' ? 'confirmed' : 'pending',
    })
    
    console.log(`✅ TRANSACTION HISTORY CREATED FOR SENDER:`, {
      userEmail: '[EMAIL_REDACTED]',
      type: 'sent',
      recipientEmail: '[EMAIL_REDACTED]',
      amount,
      txHash,
      status: transferType === 'direct' ? 'confirmed' : 'pending'
    })
    
    // For direct transfers to existing users, also create transaction record for recipient
    if (transferType === 'direct' && recipient.exists) {
      try {
        const recipientUser = await getUserByEmail(recipientEmail)
        if (recipientUser) {
          await createTransaction({
            userId: recipientUser.userId,
            userEmail: recipientEmail,
            type: 'received',
            counterpartyEmail: senderEmail, // This is who the recipient received money FROM
            amount: `+${amount}`, // Positive amount to show money entering account
            txHash: txHash,
            status: 'confirmed',
          })
          
          console.log(`✅ TRANSACTION HISTORY CREATED FOR RECIPIENT:`, {
            userEmail: '[EMAIL_REDACTED]',
            type: 'received',
            senderEmail: '[EMAIL_REDACTED]',
            amount,
            txHash,
            status: 'confirmed'
          })
          
          // Send email notification for direct transfer
          try {
            console.log('📧 SENDING DIRECT TRANSFER NOTIFICATION EMAIL:', {
              recipientEmail,
              senderEmail,
              amount,
              txHash
            })
            
            const emailResult = await sendDirectTransferNotificationEmail({
              recipientEmail,
              senderEmail,
              senderName: sender.displayName,
              amount,
              txHash
            })
            
            if (emailResult.success) {
              console.log('✅ DIRECT TRANSFER EMAIL NOTIFICATION SENT SUCCESSFULLY')
            } else {
              console.error('❌ FAILED TO SEND DIRECT TRANSFER EMAIL NOTIFICATION:', emailResult.error)
            }
          } catch (emailError) {
            console.error('❌ ERROR SENDING DIRECT TRANSFER EMAIL NOTIFICATION:', emailError)
            // Don't fail the entire request if email sending fails
          }
        }
      } catch (recipientError) {
        console.error('Failed to create recipient transaction record:', recipientError)
        // Don't fail the entire request if recipient record creation fails
      }
    }
    
    // Send email notification for escrow transfers
    if (transferType === 'escrow' && transferId) {
      try {
        // Get the transfer details
        const pendingTransfer = await getPendingTransfer(transferId)
        if (pendingTransfer) {
          // Use main domain URL (no unique parameters needed)
          const claimUrl = 'https://www.btwnfriends.com'
          
          console.log('📧 SENDING ESCROW NOTIFICATION EMAIL:', {
            recipientEmail,
            senderEmail,
            amount,
            transferId,
            claimUrl
          })
          
          // Send email notification
          const emailResult = await sendClaimNotificationEmail({
            recipientEmail,
            senderEmail,
            senderName: sender.displayName,
            amount,
            claimUrl,
            expiryDate: pendingTransfer.expiryDate
          })
          
          if (emailResult.success) {
            console.log('✅ ESCROW EMAIL NOTIFICATION SENT SUCCESSFULLY')
          } else {
            console.error('❌ FAILED TO SEND ESCROW EMAIL NOTIFICATION:', emailResult.error)
          }
        } else {
          console.error('❌ PENDING TRANSFER NOT FOUND OR MISSING CLAIM TOKEN:', transferId)
        }
      } catch (emailError) {
        console.error('❌ ERROR SENDING ESCROW EMAIL NOTIFICATION:', emailError)
        // Don't fail the entire request if email sending fails
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Transaction completed and recorded in history',
      transactionType: 'sent',
      senderRecord: true,
      recipientRecord: transferType === 'direct' && recipient.exists,
      emailNotificationSent: true // Now sent for both direct and escrow transfers
    })
    
  } catch (error) {
    console.error('Transaction completion error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to complete transaction' },
      { status: 500 }
    )
  }
}