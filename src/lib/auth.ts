import { NextRequest, NextResponse } from 'next/server'
import { CdpClient } from '@coinbase/cdp-sdk'

// We work directly with the CDP EndUser type through unknown for flexibility

// Initialize CDP client for server-side authentication validation
let cdpClient: CdpClient | null = null

function getCdpClient(): CdpClient {
  if (!cdpClient) {
    const apiKeyId = process.env.CDP_API_KEY_ID
    const apiKeySecret = process.env.CDP_SECRET_API_KEY  // Fixed: correct env var name
    
    if (!apiKeyId || !apiKeySecret) {
      throw new Error('CDP_API_KEY_ID and CDP_SECRET_API_KEY must be set in environment variables')
    }

    cdpClient = new CdpClient({
      apiKeyId,
      apiKeySecret,
    })
  }
  
  return cdpClient
}

/**
 * Validates CDP access token from Authorization header
 * Returns authenticated user information or error
 */
export async function validateCDPAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return { 
        user: null, 
        error: 'Missing Authorization header', 
        status: 401 
      }
    }

    if (!authHeader.startsWith('Bearer ')) {
      return { 
        user: null, 
        error: 'Invalid Authorization header format. Expected: Bearer <token>', 
        status: 401 
      }
    }

    const accessToken = authHeader.replace('Bearer ', '').trim()
    
    if (!accessToken) {
      return { 
        user: null, 
        error: 'Missing access token in Authorization header', 
        status: 401 
      }
    }

    // Validate the access token with CDP
    const client = getCdpClient()
    const endUser = await client.endUser.validateAccessToken({
      accessToken,
    })

    return { 
      user: endUser as unknown, 
      error: null, 
      status: 200 
    }
  } catch (error) {
    console.error('CDP authentication error:', error)
    
    // Check for specific CDP error types
    const errorMessage = error instanceof Error ? error.message : 'Unknown authentication error'
    
    return { 
      user: null, 
      error: `Invalid or expired access token: ${errorMessage}`, 
      status: 401 
    }
  }
}

/**
 * Higher-order function to protect API routes with CDP authentication
 * Usage: export async function POST(request) { return withAuth(request, handler) }
 */
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: unknown) => Promise<Response>
): Promise<Response> {
  const authResult = await validateCDPAuth(request)
  
  if (authResult.error || !authResult.user) {
    return NextResponse.json(
      { error: authResult.error || 'Authentication failed' },
      { status: authResult.status || 401 }
    )
  }
  
  return handler(request, authResult.user)
}

/**
 * Middleware for endpoints that require specific user authorization
 * Verifies the authenticated user matches the requested userId
 */
export function requireUserMatch(authenticatedUserId: string, requestedUserId: string): boolean {
  return authenticatedUserId === requestedUserId
}

/**
 * Middleware for endpoints that require specific email authorization
 * Verifies the authenticated user's email matches the requested email
 */
export function requireEmailMatch(authenticatedEmail: string, requestedEmail: string): boolean {
  return authenticatedEmail.toLowerCase() === requestedEmail.toLowerCase()
}

/**
 * Safely extract userId from CDP endUser object
 */
export function extractUserIdFromCDPUser(user: Record<string, unknown> | unknown): string | null {
  try {
    const userObj = user as Record<string, unknown>
    const userId = userObj?.userId
    return userId ? String(userId) : null
  } catch {
    return null
  }
}

/**
 * Safely extract email from CDP endUser object
 */
export function extractEmailFromCDPUser(user: Record<string, unknown> | unknown): string | null {
  try {
    const userObj = user as Record<string, unknown>
    
    // authenticationMethods is an array of objects like: [{ email: "user@example.com", type: "email" }]
    const authMethods = userObj?.authenticationMethods as Array<Record<string, unknown>> | undefined
    
    if (authMethods && Array.isArray(authMethods)) {
      // Find the email authentication method
      const emailMethod = authMethods.find(method => method.type === 'email')
      if (emailMethod?.email) {
        return String(emailMethod.email).toLowerCase()
      }
    }
    
    // Fallback: check if email is directly on the user object
    if (userObj?.email) {
      return String(userObj.email).toLowerCase()
    }
    
    return null
  } catch (error) {
    console.error('🔍 ERROR IN extractEmailFromCDPUser:', error)
    return null
  }
}