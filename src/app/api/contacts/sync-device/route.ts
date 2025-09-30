import { NextRequest, NextResponse } from 'next/server'
import { bulkCreateContacts, getContacts } from '@/lib/models'
import { CreateContactData } from '@/types'
import { validateCDPAuth, extractUserIdFromCDPUser } from '@/lib/auth'
import { z } from 'zod'

const DeviceContactSchema = z.object({
  id: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  displayName: z.string(),
  emails: z.array(z.string().email()),
  phoneNumbers: z.array(z.string()),
  avatar: z.string().optional()
})

const DeviceSyncSchema = z.object({
  ownerUserId: z.string().min(1, 'Owner user ID is required'),
  deviceContacts: z.array(DeviceContactSchema)
})

export const dynamic = 'force-dynamic'

// POST - Sync device contacts
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
    const validatedData = DeviceSyncSchema.parse(body)
    
    // Ensure user can only sync contacts for themselves
    const authenticatedUserId = extractUserIdFromCDPUser(authResult.user)
    if (!authenticatedUserId || authenticatedUserId !== validatedData.ownerUserId) {
      return NextResponse.json(
        { error: 'You can only sync contacts for yourself' },
        { status: 403 }
      )
    }
    
    // Get existing contacts to avoid duplicates
    const existingContacts = await getContacts(validatedData.ownerUserId)
    const existingEmails = new Set(existingContacts.map(c => c.contactEmail.toLowerCase()))
    
    // Process device contacts
    const newContacts: CreateContactData[] = []
    
    for (const deviceContact of validatedData.deviceContacts) {
      // For each email in the device contact
      for (const email of deviceContact.emails) {
        const normalizedEmail = email.toLowerCase().trim()
        
        // Skip if we already have this contact
        if (existingEmails.has(normalizedEmail)) {
          continue
        }
        
        // Create display name priority: displayName > firstName lastName > email
        let displayName = deviceContact.displayName
        if (!displayName && (deviceContact.firstName || deviceContact.lastName)) {
          displayName = [deviceContact.firstName, deviceContact.lastName]
            .filter(Boolean)
            .join(' ')
            .trim()
        }
        if (!displayName) {
          displayName = normalizedEmail.split('@')[0]
        }
        
        newContacts.push({
          ownerUserId: validatedData.ownerUserId,
          contactEmail: normalizedEmail,
          displayName,
          firstName: deviceContact.firstName,
          lastName: deviceContact.lastName,
          phoneNumber: deviceContact.phoneNumbers[0], // Take first phone number
          avatar: deviceContact.avatar,
          hasAccount: false, // We'll check this later
          source: 'device',
          favorite: false
        })
        
        // Add to existing emails set to avoid duplicates within this batch
        existingEmails.add(normalizedEmail)
      }
    }
    
    // Bulk create new contacts
    if (newContacts.length > 0) {
      await bulkCreateContacts(newContacts)
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully synced ${newContacts.length} new contacts from device`,
      newContactsCount: newContacts.length,
      totalProcessed: validatedData.deviceContacts.length
    })
  } catch (error) {
    console.error('Device contact sync error:', error)
    
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