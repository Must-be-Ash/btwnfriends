import { NextRequest, NextResponse } from 'next/server'
import { getUserByWalletAddress } from '@/lib/models'
import { validateCDPAuth, extractUserIdFromCDPUser } from '@/lib/auth'
import { checkWalletLookupRateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

// Validation schema for wallet address
const WalletAddressSchema = z.object({
  address: z.string()
    .min(40, 'Invalid wallet address length')
    .max(42, 'Invalid wallet address length')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format')
})

// GET - Lookup user by wallet address (authenticated & rate limited)
export async function GET(request: NextRequest) {
  try {
    // 1. Validate CDP authentication
    const authResult = await validateCDPAuth(request)
    if (authResult.error || !authResult.user) {
      console.log('❌ API: Wallet lookup failed - unauthenticated request')
      return NextResponse.json(
        { error: authResult.error || 'Authentication required' },
        { status: authResult.status || 401 }
      )
    }

    const authenticatedUserId = extractUserIdFromCDPUser(authResult.user)
    if (!authenticatedUserId) {
      console.log('❌ API: Wallet lookup failed - could not extract userId from token')
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      )
    }

    // 2. Check rate limit
    const rateLimitResult = checkWalletLookupRateLimit(authenticatedUserId)
    if (!rateLimitResult.allowed) {
      const resetInMinutes = Math.ceil(rateLimitResult.resetTime / 60000)
      console.log(`⚠️ API: Rate limit exceeded for user ${authenticatedUserId}. Reset in ${resetInMinutes}m`)
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `You have reached the maximum of 10 wallet lookups per hour. Try again in ${resetInMinutes} minutes.`,
          remaining: 0,
          resetTime: rateLimitResult.resetTime
        },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    console.log('🔍 API: Received wallet address lookup request:', {
      address,
      userId: authenticatedUserId,
      remaining: rateLimitResult.remaining
    })

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address parameter is required' },
        { status: 400 }
      )
    }

    // Validate wallet address format
    const validation = WalletAddressSchema.safeParse({ address })
    if (!validation.success) {
      console.log('❌ API: Invalid wallet address format:', address)
      return NextResponse.json(
        {
          error: 'Invalid wallet address format',
          details: validation.error.errors
        },
        { status: 400 }
      )
    }

    // 3. Look up user by wallet address
    const user = await getUserByWalletAddress(address)

    if (user) {
      // Audit log: Successful lookup
      console.log('✅ API: Wallet lookup successful:', {
        requestedBy: authenticatedUserId,
        walletAddress: address,
        foundUser: user.userId,
        timestamp: new Date().toISOString(),
        remaining: rateLimitResult.remaining - 1
      })

      return NextResponse.json({
        success: true,
        user: {
          userId: user.userId,
          email: user.email,
          displayName: user.displayName,
          walletAddress: user.walletAddress
        }
      })
    } else {
      // Audit log: Address not found
      console.log('ℹ️ API: Wallet lookup - no user found:', {
        requestedBy: authenticatedUserId,
        walletAddress: address,
        timestamp: new Date().toISOString(),
        remaining: rateLimitResult.remaining - 1
      })

      return NextResponse.json({
        success: true,
        user: null,
        message: 'No user found with this wallet address'
      })
    }
  } catch (error) {
    console.error('❌ API: Wallet address lookup error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Lookup user by wallet address (authenticated & rate limited)
export async function POST(request: NextRequest) {
  try {
    // 1. Validate CDP authentication
    const authResult = await validateCDPAuth(request)
    if (authResult.error || !authResult.user) {
      console.log('❌ API: POST wallet lookup failed - unauthenticated request')
      return NextResponse.json(
        { error: authResult.error || 'Authentication required' },
        { status: authResult.status || 401 }
      )
    }

    const authenticatedUserId = extractUserIdFromCDPUser(authResult.user)
    if (!authenticatedUserId) {
      console.log('❌ API: POST wallet lookup failed - could not extract userId from token')
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      )
    }

    // 2. Check rate limit
    const rateLimitResult = checkWalletLookupRateLimit(authenticatedUserId)
    if (!rateLimitResult.allowed) {
      const resetInMinutes = Math.ceil(rateLimitResult.resetTime / 60000)
      console.log(`⚠️ API: Rate limit exceeded for user ${authenticatedUserId}. Reset in ${resetInMinutes}m`)
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `You have reached the maximum of 10 wallet lookups per hour. Try again in ${resetInMinutes} minutes.`,
          remaining: 0,
          resetTime: rateLimitResult.resetTime
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { address } = body

    console.log('🔍 API: Received POST wallet address lookup:', {
      address,
      userId: authenticatedUserId,
      remaining: rateLimitResult.remaining
    })

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required in request body' },
        { status: 400 }
      )
    }

    // Validate wallet address format
    const validation = WalletAddressSchema.safeParse({ address })
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid wallet address format',
          details: validation.error.errors
        },
        { status: 400 }
      )
    }

    // 3. Look up user by wallet address
    const user = await getUserByWalletAddress(address)

    if (user) {
      // Audit log: Successful POST lookup
      console.log('✅ API: POST wallet lookup successful:', {
        requestedBy: authenticatedUserId,
        walletAddress: address,
        foundUser: user.userId,
        timestamp: new Date().toISOString(),
        remaining: rateLimitResult.remaining - 1
      })

      return NextResponse.json({
        success: true,
        user: {
          userId: user.userId,
          email: user.email,
          displayName: user.displayName,
          walletAddress: user.walletAddress
        }
      })
    } else {
      // Audit log: POST address not found
      console.log('ℹ️ API: POST wallet lookup - no user found:', {
        requestedBy: authenticatedUserId,
        walletAddress: address,
        timestamp: new Date().toISOString(),
        remaining: rateLimitResult.remaining - 1
      })

      return NextResponse.json({
        success: true,
        user: null,
        message: 'No user found with this wallet address'
      })
    }
  } catch (error) {
    console.error('❌ API: POST wallet address lookup error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}