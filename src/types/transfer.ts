import { ObjectId } from 'mongodb'

export interface Contact {
  _id: ObjectId
  ownerUserId: string        // Contact list owner (using userId instead of email)
  contactEmail: string       // Contact's email
  displayName: string        // Friendly name
  firstName?: string         // For device contacts
  lastName?: string          // For device contacts
  phoneNumber?: string       // For device contacts
  avatar?: string            // Avatar URL or base64 image
  hasAccount: boolean        // Cache if contact has account
  lastUsedAt: Date          // For sorting by recency
  source: 'manual' | 'device' | 'transaction' // How contact was added
  favorite: boolean         // User marked as favorite
  createdAt: Date
}

export interface CreateContactData {
  ownerUserId: string
  contactEmail: string
  displayName: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  avatar?: string
  hasAccount: boolean
  source?: 'manual' | 'device' | 'transaction'
  favorite?: boolean
}

export interface DeviceContact {
  id: string
  firstName?: string
  lastName?: string
  displayName: string
  emails: string[]
  phoneNumbers: string[]
  avatar?: string
}

export interface PendingTransfer {
  _id: ObjectId
  transferId: string         // UUID for escrow contract
  senderEmail: string        // Who sent the money
  recipientEmail: string     // Who should receive it
  amount: string             // USDC amount as string
  claimToken: string         // Secure token for claiming
  expiryDate: Date          // When transfer expires
  status: 'pending' | 'claimed' | 'refunded' | 'expired'
  txHashDeposit?: string     // Escrow deposit transaction
  txHashClaim?: string       // Claim transaction
  txHashRefund?: string      // Refund transaction
  createdAt: Date
  claimedAt?: Date
}

export interface CreatePendingTransferData {
  transferId: string
  senderEmail: string
  recipientEmail: string
  amount: string
  claimToken: string
  expiryDate: Date
  txHashDeposit?: string
}

export interface Transaction {
  _id: ObjectId
  userEmail: string          // Transaction owner
  type: 'sent' | 'received' | 'received_claim' | 'refund'
  recipientEmail?: string    // For sent transactions
  senderEmail?: string       // For received transactions
  amount: string             // USDC amount
  txHash?: string           // Blockchain transaction hash
  transferId?: string       // Link to pending transfer if applicable
  status: 'confirmed' | 'pending' | 'failed'
  createdAt: Date
}

export interface CreateTransactionData {
  userEmail: string
  type: Transaction['type']
  recipientEmail?: string
  senderEmail?: string
  amount: string
  txHash?: string
  transferId?: string
  status: Transaction['status']
}