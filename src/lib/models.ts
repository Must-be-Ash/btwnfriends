import { getDatabase } from './db'

export interface User {
  _id?: string
  userId: string
  email: string
  displayName: string
  profileSetupComplete: boolean
  walletAddress?: string
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Transfer {
  _id?: string
  transferId: string
  senderUserId: string
  senderEmail: string
  recipientEmail: string
  recipientUserId?: string
  amount: string
  txHash?: string
  status: 'pending' | 'confirmed' | 'failed' | 'claimed' | 'unclaimed'
  type: 'direct' | 'escrow'
  message?: string
  createdAt: Date
  updatedAt: Date
  claimedAt?: Date
  escrowAddress?: string
  claimToken?: string
  expiryDate?: Date
}

export interface Contact {
  _id?: string
  userId: string
  contactEmail: string
  displayName: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  avatar?: string
  hasAccount: boolean
  lastUsed: Date
  lastUsedAt?: Date  // Alias for lastUsed
  source: 'transaction' | 'manual' | 'device'
  isFavorite: boolean
  favorite?: boolean  // Alias for isFavorite
  createdAt: Date
}

export interface Transaction {
  _id?: string
  userId: string
  userEmail: string // The user who owns this transaction record
  transferId?: string
  type: 'sent' | 'received' | 'refund'
  counterpartyEmail: string // The other person in the transaction (who they sent to or received from)
  amount: string // Positive for received, negative for sent
  txHash?: string
  status: 'confirmed' | 'pending' | 'failed' | 'claimed' | 'unclaimed'
  message?: string
  createdAt: Date
}

// Database functions
export async function getUserByUserId(userId: string): Promise<User | null> {
  try {
    const db = await getDatabase()
    const user = await db.collection('users').findOne({ userId })
    return user as User | null
  } catch (error) {
    console.error('Error getting user by userId:', error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    console.log('🔍 DATABASE: Looking up user with email:', email)
    const db = await getDatabase()
    console.log('🔍 DATABASE: Connected to database:', db.databaseName)
    
    const user = await db.collection('users').findOne({ email })
    console.log('🔍 DATABASE: Query result for email', email, ':', user ? {
      _id: user._id,
      userId: user.userId,
      email: user.email,
      displayName: user.displayName,
      walletAddress: user.walletAddress
    } : null)
    
    return user as User | null
  } catch (error) {
    console.error('Error getting user by email:', error)
    return null
  }
}

export async function createTransaction(transaction: Omit<Transaction, '_id' | 'createdAt'>): Promise<boolean> {
  try {
    const db = await getDatabase()
    // Auto-add missing required fields
    const fullTransaction = {
      ...transaction,
      createdAt: new Date()
    }
    await db.collection('transactions').insertOne(fullTransaction)
    return true
  } catch (error) {
    console.error('Error creating transaction:', error)
    return false
  }
}

export async function createPendingTransfer(transfer: Omit<Transfer, '_id'>): Promise<boolean> {
  try {
    const db = await getDatabase()
    await db.collection('pending_transfers').insertOne(transfer)
    return true
  } catch (error) {
    console.error('Error creating pending transfer:', error)
    return false
  }
}

export async function getPendingTransfer(transferId: string): Promise<Transfer | null> {
  try {
    const db = await getDatabase()
    const transfer = await db.collection('pending_transfers').findOne({ transferId })
    return transfer as Transfer | null
  } catch (error) {
    console.error('Error getting pending transfer:', error)
    return null
  }
}

export async function updatePendingTransferStatus(transferId: string, status: string, txHash?: string): Promise<boolean> {
  try {
    const db = await getDatabase()
    const updateData: Record<string, unknown> = { status, updatedAt: new Date() }
    if (txHash) updateData.txHash = txHash
    if (status === 'claimed') updateData.claimedAt = new Date()
    
    await db.collection('pending_transfers').updateOne({ transferId }, { $set: updateData })
    return true
  } catch (error) {
    console.error('Error updating transfer status:', error)
    return false
  }
}

export async function getPendingTransfersBySender(senderUserId: string): Promise<Transfer[]> {
  try {
    const db = await getDatabase()
    const transfers = await db.collection('pending_transfers')
      .find({ senderUserId, status: { $in: ['pending', 'unclaimed'] } })
      .sort({ createdAt: -1 })
      .toArray()
    return transfers as unknown as Transfer[]
  } catch (error) {
    console.error('Error getting pending transfers:', error)
    return []
  }
}

export async function getContacts(userId: string): Promise<Contact[]> {
  try {
    const db = await getDatabase()
    const contacts = await db.collection('contacts')
      .find({ userId })
      .sort({ lastUsed: -1 })
      .toArray()
    return contacts as unknown as Contact[]
  } catch (error) {
    console.error('Error getting contacts:', error)
    return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function bulkCreateContacts(contactsData: { [key: string]: any }[]): Promise<boolean> {
  try {
    const db = await getDatabase()
    if (contactsData.length > 0) {
      // Convert each contact to our Contact format
      const fullContacts = contactsData.map(contactData => ({
        userId: (contactData.ownerUserId || contactData.userId) as string,
        contactEmail: contactData.contactEmail as string,
        displayName: contactData.displayName as string,
        firstName: contactData.firstName as string | undefined,
        lastName: contactData.lastName as string | undefined,
        phoneNumber: contactData.phoneNumber as string | undefined,
        avatar: contactData.avatar as string | undefined,
        hasAccount: (contactData.hasAccount as boolean) ?? false,
        lastUsed: new Date(),
        lastUsedAt: new Date(), // Alias
        source: (contactData.source as 'manual' | 'device' | 'transaction') ?? 'manual' as const,
        isFavorite: (contactData.favorite as boolean) ?? false,
        favorite: (contactData.favorite as boolean) ?? false, // Alias
        createdAt: new Date()
      }))
      
      await db.collection('contacts').insertMany(fullContacts)
    }
    return true
  } catch (error) {
    console.error('Error bulk creating contacts:', error)
    return false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createUser(userData: { [key: string]: any }): Promise<User | null> {
  try {
    const db = await getDatabase()
    
    // Convert CreateUserData to our User format
    const fullUser = {
      userId: userData.userId as string,
      email: userData.email as string,
      displayName: userData.displayName as string,
      profileSetupComplete: (userData.profileSetupComplete as boolean) ?? false,
      walletAddress: userData.walletAddress as string | undefined,
      lastLoginAt: userData.lastLoginAt as Date | undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('users').insertOne(fullUser)
    return { ...fullUser, _id: result.insertedId.toString() }
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
  try {
    const db = await getDatabase()
    await db.collection('users').updateOne({ userId }, { $set: { ...updates, updatedAt: new Date() } })
    return true
  } catch (error) {
    console.error('Error updating user:', error)
    return false
  }
}

export async function updateUserByEmail(email: string, updates: Partial<User>): Promise<boolean> {
  try {
    const db = await getDatabase()
    await db.collection('users').updateOne({ email }, { $set: { ...updates, updatedAt: new Date() } })
    return true
  } catch (error) {
    console.error('Error updating user by email:', error)
    return false
  }
}

export async function searchContacts(userId: string, query: string): Promise<Contact[]> {
  try {
    // Simple length limit to prevent ReDoS attacks
    if (!query || query.length > 50) {
      return []
    }
    
    const db = await getDatabase()
    const contacts = await db.collection('contacts')
      .find({ 
        userId, 
        $or: [
          { contactEmail: { $regex: query, $options: 'i' } },
          { displayName: { $regex: query, $options: 'i' } }
        ]
      })
      .sort({ lastUsed: -1 })
      .toArray()
    return contacts as unknown as Contact[]
  } catch (error) {
    console.error('Error searching contacts:', error)
    return []
  }
}

// Accept either our Contact interface or CreateContactData from types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createContact(contactData: { [key: string]: any }): Promise<Contact | null> {
  try {
    const db = await getDatabase()
    
    // Convert CreateContactData to our Contact format
    const fullContact = {
      userId: (contactData.ownerUserId || contactData.userId) as string,
      contactEmail: contactData.contactEmail as string,
      displayName: contactData.displayName as string,
      firstName: contactData.firstName as string | undefined,
      lastName: contactData.lastName as string | undefined,
      phoneNumber: contactData.phoneNumber as string | undefined,
      avatar: contactData.avatar as string | undefined,
      hasAccount: (contactData.hasAccount as boolean) ?? false,
      lastUsed: new Date(),
      lastUsedAt: new Date(), // Alias
      source: (contactData.source as 'manual' | 'device' | 'transaction') ?? 'manual' as const,
      isFavorite: (contactData.favorite as boolean) ?? false,
      favorite: (contactData.favorite as boolean) ?? false, // Alias
      createdAt: new Date()
    }
    
    const result = await db.collection('contacts').insertOne(fullContact)
    return { ...fullContact, _id: result.insertedId.toString() }
  } catch (error) {
    console.error('Error creating contact:', error)
    return null
  }
}

export async function updateContact(ownerUserId: string, contactEmail: string, updates: Partial<Contact>): Promise<boolean> {
  try {
    const db = await getDatabase()
    await db.collection('contacts').updateOne(
      { userId: ownerUserId, contactEmail: contactEmail.toLowerCase() }, 
      { $set: updates }
    )
    return true
  } catch (error) {
    console.error('Error updating contact:', error)
    return false
  }
}

export async function deleteContact(ownerUserId: string, contactEmail: string): Promise<boolean> {
  try {
    const db = await getDatabase()
    await db.collection('contacts').deleteOne({ 
      userId: ownerUserId, 
      contactEmail: contactEmail.toLowerCase() 
    })
    return true
  } catch (error) {
    console.error('Error deleting contact:', error)
    return false
  }
}

export async function toggleContactFavorite(userId: string, contactEmail: string): Promise<boolean> {
  try {
    const db = await getDatabase()
    const contact = await db.collection('contacts').findOne({ userId, contactEmail })
    if (contact) {
      await db.collection('contacts').updateOne(
        { userId, contactEmail }, 
        { $set: { isFavorite: !contact.isFavorite } }
      )
    }
    return true
  } catch (error) {
    console.error('Error toggling contact favorite:', error)
    return false
  }
}

export async function getPendingTransfersByRecipient(recipientEmail: string): Promise<Transfer[]> {
  try {
    const db = await getDatabase()
    const transfers = await db.collection('pending_transfers')
      .find({ recipientEmail, status: { $in: ['pending', 'unclaimed'] } })
      .sort({ createdAt: -1 })
      .toArray()
    return transfers as unknown as Transfer[]
  } catch (error) {
    console.error('Error getting pending transfers by recipient:', error)
    return []
  }
}

export async function getPendingTransfers(): Promise<Transfer[]> {
  try {
    const db = await getDatabase()
    const transfers = await db.collection('pending_transfers')
      .find({ status: { $in: ['pending', 'unclaimed'] } })
      .sort({ createdAt: -1 })
      .toArray()
    return transfers as unknown as Transfer[]
  } catch (error) {
    console.error('Error getting pending transfers:', error)
    return []
  }
}

export async function getTransactionsByUserWithFilters(
  userEmail: string,
  limit: number,
  offset: number,
  type?: string,
  status?: string,
  search?: string
): Promise<Transaction[]> {
  try {
    const db = await getDatabase()
    
    // Build the query step by step
    const query: Record<string, unknown> = { userEmail }
    
    console.log('🔍 TRANSACTION QUERY START:', {
      userEmail,
      limit,
      offset,
      type,
      status,
      search
    })
    
    // Handle type filtering - convert frontend types to database types
    if (type && type !== 'all') {
      query.type = type
    }
    
    // Handle status filtering
    if (status && status !== 'all') {
      query.status = status
    }
    
    // Handle search filtering
    if (search) {
      query.$or = [
        { counterpartyEmail: { $regex: search, $options: 'i' } },
        { txHash: { $regex: search, $options: 'i' } },
        { transferId: { $regex: search, $options: 'i' } }
      ]
    }
    
    console.log('🔍 MONGODB QUERY:', JSON.stringify(query, null, 2))
    
    // First, let's check what's actually in the database
    const allTransactionsForUser = await db.collection('transactions')
      .find({ userEmail })
      .toArray()
    
    console.log('🔍 ALL TRANSACTIONS FOR USER:', {
      userEmail,
      count: allTransactionsForUser.length,
      transactions: allTransactionsForUser.map(t => ({
        _id: t._id,
        userId: t.userId,
        userEmail: t.userEmail,
        type: t.type,
        counterpartyEmail: t.counterpartyEmail,
        amount: t.amount,
        status: t.status,
        createdAt: t.createdAt
      }))
    })
    
    const transactions = await db.collection('transactions')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit || 50)
      .skip(offset || 0)
      .toArray()
    
    console.log('🔍 FILTERED TRANSACTIONS RESULT:', {
      count: transactions.length,
      transactions: transactions.map(t => ({
        _id: t._id,
        type: t.type,
        amount: t.amount,
        counterpartyEmail: t.counterpartyEmail,
        status: t.status
      }))
    })
    
    return transactions as unknown as Transaction[]
  } catch (error) {
    console.error('Error getting transactions with filters:', error)
    return []
  }
}

export async function updateTransaction(
  transferId: string,
  updates: Partial<Transaction>
): Promise<boolean> {
  try {
    const db = await getDatabase()
    await db.collection('transactions').updateMany(
      { transferId },
      { $set: updates }
    )
    return true
  } catch (error) {
    console.error('Error updating transaction:', error)
    return false
  }
}

export async function getUserByWalletAddress(walletAddress: string): Promise<User | null> {
  try {
    console.log('🔍 DATABASE: Looking up user with wallet address:', walletAddress)
    const db = await getDatabase()
    console.log('🔍 DATABASE: Connected to database:', db.databaseName)

    // Try both the original case and lowercase for backward compatibility
    const normalizedAddress = walletAddress.toLowerCase()


    const user = await db.collection('users').findOne({
      $or: [
        { walletAddress: walletAddress },     // Original case
        { walletAddress: normalizedAddress }  // Lowercase
      ]
    })

    console.log('🔍 DATABASE: Query result for wallet address', walletAddress, ':', user ? {
      _id: user._id,
      userId: user.userId,
      email: user.email,
      displayName: user.displayName,
      walletAddress: user.walletAddress
    } : null)

    return user as User | null
  } catch (error) {
    console.error('Error getting user by wallet address:', error)
    return null
  }
}