import { NextRequest, NextResponse } from 'next/server'
import { createTransaction, getUserByUserId } from '@/lib/models'
import { validateCDPAuth, extractUserIdFromCDPUser } from '@/lib/auth'
import { z } from 'zod'

// This route handles gas-sponsored USDC transfers
// The admin wallet pays for gas, user only needs USDC balance

const SponsoredSendSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  senderAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid sender address'),
  recipientAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid recipient address'),
  recipientEmail: z.string().email('Invalid recipient email'),
  amount: z.string().regex(/^\d+(\.\d{1,6})?$/, 'Invalid amount format'),
  userSignature: z.string().min(1, 'User signature required'), // User's approval signature
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
    const { 
      userId, 
      senderAddress, 
      recipientAddress, 
      recipientEmail, 
      amount, 
      userSignature 
    } = SponsoredSendSchema.parse(body)
    
    // Ensure user can only send from their own account
    const authenticatedUserId = extractUserIdFromCDPUser(authResult.user)
    if (!authenticatedUserId || authenticatedUserId !== userId) {
      return NextResponse.json(
        { error: 'You can only send funds from your own account' },
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
    
    // Validate amount range
    const amountNum = parseFloat(amount)
    if (amountNum < 0.01 || amountNum > 1000000) {
      return NextResponse.json(
        { error: 'Amount must be between $0.01 and $1,000,000' },
        { status: 400 }
      )
    }
    
    // TODO: Implement the actual sponsored transaction logic
    // This would involve:
    // 1. Verify user's signature approving the USDC transfer
    // 2. Use admin wallet to execute transferFrom on behalf of user
    // 3. Admin pays gas costs, user provides USDC approval
    
    console.log('🎁 GAS SPONSORED TRANSFER:', {
      from: senderAddress,
      to: recipientAddress,
      amount,
      signature: userSignature.slice(0, 10) + '...',
      sponsoredBy: 'admin'
    })
    
    // For now, simulate a successful sponsored transaction
    const simulatedTxHash = '0x' + Math.random().toString(16).substring(2).padStart(64, '0')
    
    // Create transaction record
    await createTransaction({
      userId,
      userEmail: sender.email,
      type: 'sent',
      counterpartyEmail: recipientEmail, // Who they sent money TO
      amount: `-${amount}`, // Negative for money leaving account
      txHash: simulatedTxHash,
      status: 'confirmed',
    })
    
    return NextResponse.json({
      success: true,
      txHash: simulatedTxHash,
      gasSponsored: true,
      message: `Successfully sent ${amount} USDC with sponsored gas fees`
    })
    
  } catch (error) {
    console.error('Sponsored send error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to process sponsored transfer' },
      { status: 500 }
    )
  }
}