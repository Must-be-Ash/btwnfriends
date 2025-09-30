import { ObjectId } from 'mongodb'

export interface User {
  _id: ObjectId
  userId: string             // CDP userId (primary identifier)
  email: string              // Email used for CDP auth
  walletAddress: string      // CDP generated address  
  displayName: string        // Required display name
  createdAt: Date
  lastLoginAt: Date
  profileSetupComplete: boolean // Track if user completed profile setup
}

export interface CreateUserData {
  userId: string
  email: string
  walletAddress: string
  displayName: string
  profileSetupComplete?: boolean
}

export interface UpdateUserData {
  displayName?: string
  lastLoginAt?: Date
  profileSetupComplete?: boolean
}