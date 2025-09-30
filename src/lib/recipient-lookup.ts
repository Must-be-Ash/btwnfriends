// Recipient lookup utilities

export interface RecipientInfo {
  email: string
  exists: boolean
  displayName?: string
  walletAddress?: string
  transferType: 'direct' | 'escrow'
}


export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function getTransferType(recipientExists: boolean, recipientHasWallet: boolean): 'direct' | 'escrow' {
  return recipientExists && recipientHasWallet ? 'direct' : 'escrow'
}


// Server-side versions for API routes (don't make HTTP calls)
import { getUserByEmail } from './models'

export async function lookupRecipientServer(email: string): Promise<RecipientInfo> {
  try {
    console.log('🔍 SERVER LOOKUP for:', email.toLowerCase())
    const user = await getUserByEmail(email.toLowerCase())
    console.log('🔍 USER FOUND:', {
      user: user ? { 
        userId: user.userId,
        email: user.email,
        displayName: user.displayName,
        walletAddress: user.walletAddress,
        hasWallet: !!user.walletAddress
      } : null
    })
    
    if (user && user.walletAddress) {
      const result = {
        email: email.toLowerCase(),
        exists: true,
        displayName: user.displayName,
        walletAddress: user.walletAddress,
        transferType: 'direct' as const
      }
      console.log('🔍 RETURNING DIRECT TRANSFER:', result)
      return result
    } else {
      const result = {
        email: email.toLowerCase(),
        exists: !!user,
        transferType: 'escrow' as const
      }
      console.log('🔍 RETURNING ESCROW TRANSFER:', result)
      return result
    }
  } catch (error) {
    console.error('Server lookup error:', error)
    return {
      email: email.toLowerCase(),
      exists: false,
      transferType: 'escrow'
    }
  }
}

export async function lookupMultipleRecipientsServer(emails: string[]): Promise<RecipientInfo[]> {
  return Promise.all(emails.map(email => lookupRecipientServer(email)))
}