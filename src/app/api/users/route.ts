import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail, getUserByUserId, updateUser, updateUserByEmail, getPendingTransfersByRecipient } from '@/lib/models'
import { CreateUserData, UpdateUserData } from '@/types'
import { validateCDPAuth, extractEmailFromCDPUser, requireEmailMatch, extractUserIdFromCDPUser } from '@/lib/auth'
import { z } from 'zod'

// Validation schemas
const CreateUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  email: z.string().email('Invalid email address'),
  walletAddress: z.string().min(1, 'Wallet address is required'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50, 'Display name too long'),
  profileSetupComplete: z.boolean().optional(),
})

const UpdateUserSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  profileSetupComplete: z.boolean().optional(),
})

// POST - Create new user
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
    
    // Validate request body
    const validatedData = CreateUserSchema.parse(body)
    
    // Ensure user can only create account for themselves
    const authenticatedUserId = extractUserIdFromCDPUser(authResult.user)
    if (!authenticatedUserId || authenticatedUserId !== validatedData.userId) {
      return NextResponse.json(
        { error: 'You can only create an account for yourself' },
        { status: 403 }
      )
    }
    
    // SECURITY: Verify the email matches the authenticated user's email from CDP
    const authenticatedEmail = extractEmailFromCDPUser(authResult.user)
    if (!authenticatedEmail) {
      return NextResponse.json(
        { error: 'Unable to verify authenticated email address' },
        { status: 403 }
      )
    }
    
    if (!requireEmailMatch(authenticatedEmail, validatedData.email)) {
      return NextResponse.json(
        { error: 'You can only create an account with your verified email address' },
        { status: 403 }
      )
    }
    
    // Check if user already exists by userId or email
    const existingUserByUserId = await getUserByUserId(validatedData.userId)
    const existingUserByEmail = await getUserByEmail(validatedData.email.toLowerCase())
    
    if (existingUserByUserId || existingUserByEmail) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Create user
    const userData: CreateUserData = {
      userId: validatedData.userId,
      email: validatedData.email.toLowerCase(),
      walletAddress: validatedData.walletAddress,
      displayName: validatedData.displayName,
      profileSetupComplete: validatedData.profileSetupComplete ?? false,
    }

    const user = await createUser(userData)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }
    
    // Check for pending transfers for this new user
    const pendingTransfers = await getPendingTransfersByRecipient(validatedData.email.toLowerCase())
    const pendingClaims = pendingTransfers
      .filter(transfer => transfer.status === 'pending')
      .map(transfer => ({
        transferId: transfer.transferId,
        amount: transfer.amount,
        senderEmail: transfer.senderEmail,
        expiryDate: transfer.expiryDate,
        createdAt: transfer.createdAt,
        claimToken: transfer.claimToken
      }))
    
    return NextResponse.json({
      success: true,
      user: {
        userId: user.userId,
        email: user.email,
        walletAddress: user.walletAddress,
        displayName: user.displayName,
        profileSetupComplete: user.profileSetupComplete,
        createdAt: user.createdAt,
      },
      pendingClaims: pendingClaims.length > 0 ? pendingClaims : undefined
    })
  } catch (error) {
    console.error('User creation error:', error)
    
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

// GET - Get user by email or userId (from query params)
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
    const email = searchParams.get('email')
    const userId = searchParams.get('userId')
    
    if (!email && !userId) {
      return NextResponse.json(
        { error: 'Email or userId parameter is required' },
        { status: 400 }
      )
    }

    // Ensure user can only access their own data
    const authenticatedUserIdGet = extractUserIdFromCDPUser(authResult.user)
    const requestedUserId = userId || (email ? (await getUserByEmail(email.toLowerCase()))?.userId : null)
    if (requestedUserId && (!authenticatedUserIdGet || authenticatedUserIdGet !== requestedUserId)) {
      return NextResponse.json(
        { error: 'You can only access your own user data' },
        { status: 403 }
      )
    }

    let user = null
    if (userId) {
      user = await getUserByUserId(userId)
    } else if (email) {
      user = await getUserByEmail(email.toLowerCase())
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        userId: user.userId,
        email: user.email,
        walletAddress: user.walletAddress,
        displayName: user.displayName,
        profileSetupComplete: user.profileSetupComplete,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      }
    })
  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update user
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
    const { userId, email, ...updateData } = body
    
    if (!userId && !email) {
      return NextResponse.json(
        { error: 'UserId or email is required' },
        { status: 400 }
      )
    }

    // Validate update data
    const validatedData = UpdateUserSchema.parse(updateData)
    
    // Check if user exists
    let existingUser = null
    if (userId) {
      existingUser = await getUserByUserId(userId)
    } else if (email) {
      existingUser = await getUserByEmail(email.toLowerCase())
    }
    
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Ensure user can only update their own data
    const authenticatedUserIdPut = extractUserIdFromCDPUser(authResult.user)
    if (!authenticatedUserIdPut || authenticatedUserIdPut !== existingUser.userId) {
      return NextResponse.json(
        { error: 'You can only update your own user data' },
        { status: 403 }
      )
    }

    // Update user
    const updateUserData: UpdateUserData = {
      ...validatedData,
      lastLoginAt: new Date(),
    }

    if (userId) {
      await updateUser(userId, updateUserData)
    } else {
      await updateUserByEmail(email.toLowerCase(), updateUserData)
    }
    
    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    })
  } catch (error) {
    console.error('User update error:', error)
    
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