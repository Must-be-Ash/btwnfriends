import { NextRequest, NextResponse } from 'next/server'
import { getTransactionsByUserWithFilters, getUserByUserId } from '@/lib/models'
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
    const limitParam = searchParams.get('limit')
    const offsetParam = searchParams.get('offset')
    const type = searchParams.get('type') || 'all'
    const status = searchParams.get('status') || 'all'
    const search = searchParams.get('search') || ''
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      )
    }

    // Ensure user can only access their own transaction history
    const authenticatedUserId = extractUserIdFromCDPUser(authResult.user)
    if (!authenticatedUserId || authenticatedUserId !== userId) {
      return NextResponse.json(
        { error: 'You can only access your own transaction history' },
        { status: 403 }
      )
    }

    // Get user to find email (transactions are still stored by email)
    const user = await getUserByUserId(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const limit = limitParam ? parseInt(limitParam, 10) : 20
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0

    // Validate limit and offset
    if (limit > 100) {
      return NextResponse.json(
        { error: 'Limit cannot exceed 100' },
        { status: 400 }
      )
    }

    if (limit < 1 || offset < 0) {
      return NextResponse.json(
        { error: 'Invalid limit or offset parameters' },
        { status: 400 }
      )
    }

    console.log('🔍 TRANSACTIONS QUERY:', {
      userId,
      userEmail: user.email,
      limit,
      offset,
      type,
      status,
      search
    })

    // Use enhanced query function with filtering
    const transactions = await getTransactionsByUserWithFilters(
      user.email, 
      limit, 
      offset,
      type,
      status,
      search
    )

    console.log('🔍 TRANSACTIONS FOUND:', transactions.length)

    return NextResponse.json({
      success: true,
      transactions,
      hasMore: transactions.length === limit
    })
  } catch (error) {
    console.error('Transactions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}