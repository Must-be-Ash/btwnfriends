import { NextRequest, NextResponse } from 'next/server'
import { toggleContactFavorite } from '@/lib/models'
import { validateCDPAuth, extractUserIdFromCDPUser } from '@/lib/auth'
import { z } from 'zod'

const FavoriteToggleSchema = z.object({
  ownerUserId: z.string().min(1, 'Owner user ID is required'),
  contactEmail: z.string().email('Invalid email address')
})

export const dynamic = 'force-dynamic'

// POST - Toggle contact favorite status
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
    const validatedData = FavoriteToggleSchema.parse(body)
    
    // Ensure user can only toggle favorites for their own contacts
    const authenticatedUserId = extractUserIdFromCDPUser(authResult.user)
    if (!authenticatedUserId || authenticatedUserId !== validatedData.ownerUserId) {
      return NextResponse.json(
        { error: 'You can only toggle favorites for your own contacts' },
        { status: 403 }
      )
    }
    
    await toggleContactFavorite(
      validatedData.ownerUserId,
      validatedData.contactEmail.toLowerCase()
    )
    
    return NextResponse.json({
      success: true,
      message: 'Contact favorite status updated'
    })
  } catch (error) {
    console.error('Favorite toggle error:', error)
    
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