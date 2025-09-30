import { NextRequest, NextResponse } from 'next/server'
import { getUserByWalletAddress } from '@/lib/models'
import { z } from 'zod'

// Validation schema for wallet address
const WalletAddressSchema = z.object({
  address: z.string()
    .min(40, 'Invalid wallet address length')
    .max(42, 'Invalid wallet address length')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format')
})

// GET - Lookup user by wallet address
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    console.log('🔍 API: Received wallet address lookup request:', address)

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

    // Look up user by wallet address
    const user = await getUserByWalletAddress(address)

    if (user) {
      console.log('✅ API: Found user for wallet address:', {
        address,
        userId: user.userId,
        email: user.email,
        displayName: user.displayName
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
      console.log('❌ API: No user found for wallet address:', address)

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

// POST - Lookup user by wallet address (alternative method)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address } = body

    console.log('🔍 API: Received POST wallet address lookup:', address)

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

    // Look up user by wallet address
    const user = await getUserByWalletAddress(address)

    if (user) {
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