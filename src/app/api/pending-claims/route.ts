import { NextRequest, NextResponse } from 'next/server'
import { getPendingTransfersBySender, getUserByUserId } from '@/lib/models'
import { validateCDPAuth, extractUserIdFromCDPUser } from '@/lib/auth'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Validate CDP authentication
    const authResult = await validateCDPAuth(request)
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication required' },
        { status: authResult.status || 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      )
    }

    // Ensure user can only access their own pending claims
    const authenticatedUserId = extractUserIdFromCDPUser(authResult.user)
    if (!authenticatedUserId || authenticatedUserId !== userId) {
      return NextResponse.json(
        { error: 'You can only access your own pending claims' },
        { status: 403 }
      )
    }

    // Get user to find email (pending transfers are still stored by email)
    const user = await getUserByUserId(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get pending transfers sent by this user
    const pendingTransfers = await getPendingTransfersBySender(user.email)

    // Filter only pending status and format for display
    const claims = pendingTransfers
      .filter(transfer => transfer.status === 'pending')
      .map(transfer => ({
        transferId: transfer.transferId,
        amount: transfer.amount,
        recipientEmail: transfer.recipientEmail,
        expiryDate: transfer.expiryDate,
        createdAt: transfer.createdAt,
        status: transfer.status
      }))

    return NextResponse.json({
      success: true,
      claims
    })
  } catch (error) {
    console.error('Pending claims API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}