import { NextRequest, NextResponse } from 'next/server'
import { lookupRecipientServer, lookupMultipleRecipientsServer } from '@/lib/recipient-lookup'
import { validateCDPAuth } from '@/lib/auth'
import { z } from 'zod'

// Validation schemas
const SingleLookupSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const MultipleLookupSchema = z.object({
  emails: z.array(z.string().email()).max(10, 'Maximum 10 emails allowed'),
})

// POST - Lookup recipient(s)
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
    
    // Check if it's single or multiple lookup
    if (body.email) {
      // Single recipient lookup
      const { email } = SingleLookupSchema.parse(body)
      const result = await lookupRecipientServer(email)
      
      return NextResponse.json({
        success: true,
        recipient: result
      })
    } else if (body.emails) {
      // Multiple recipients lookup
      const { emails } = MultipleLookupSchema.parse(body)
      const results = await lookupMultipleRecipientsServer(emails)
      
      return NextResponse.json({
        success: true,
        recipients: results
      })
    } else {
      return NextResponse.json(
        { error: 'Either email or emails array is required' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Recipient lookup error:', error)
    
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

// GET - Quick existence check via query params
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailSchema = z.string().email()
    const validatedEmail = emailSchema.parse(email)
    
    const result = await lookupRecipientServer(validatedEmail)

    return NextResponse.json({
      success: true,
      exists: result.exists,
      transferType: result.transferType
    })
  } catch (error) {
    console.error('Recipient existence check error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}