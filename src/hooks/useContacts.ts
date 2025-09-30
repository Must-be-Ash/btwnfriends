'use client'

import { useState, useEffect, useCallback } from 'react'
import { useGetAccessToken } from '@coinbase/cdp-hooks'
import { Contact, CreateContactData } from '@/types'

interface UseContactsReturn {
  contacts: Contact[]
  isLoading: boolean
  error: string | null
  searchResults: Contact[]
  isSearching: boolean
  refreshContacts: () => Promise<void>
  createContact: (contactData: Omit<CreateContactData, 'ownerUserId'>) => Promise<boolean>
  updateContact: (contactEmail: string, updateData: Partial<Contact>) => Promise<boolean>
  deleteContact: (contactEmail: string) => Promise<boolean>
  toggleFavorite: (contactEmail: string) => Promise<boolean>
  searchContacts: (query: string) => Promise<void>
  clearSearch: () => void
}

export function useContacts(ownerUserId: string | null): UseContactsReturn {
  const { getAccessToken } = useGetAccessToken()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<Contact[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const fetchContacts = useCallback(async (query?: string) => {
    if (!ownerUserId || typeof window === 'undefined') return

    try {
      setIsLoading(!query) // Don't show main loading for search
      setIsSearching(!!query)
      setError(null)

      const url = new URL('/api/contacts', typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
      url.searchParams.set('ownerUserId', ownerUserId)
      if (query) {
        url.searchParams.set('query', query)
      }

      const accessToken = await getAccessToken()
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch contacts')
      }

      const contactsData = data.contacts || []
      
      if (query) {
        setSearchResults(contactsData)
      } else {
        setContacts(contactsData)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      console.error('Error fetching contacts:', err)
    } finally {
      setIsLoading(false)
      setIsSearching(false)
    }
  }, [ownerUserId, getAccessToken])

  const refreshContacts = useCallback(async () => {
    await fetchContacts()
  }, [fetchContacts])

  const createContact = useCallback(async (contactData: Omit<CreateContactData, 'ownerUserId'>): Promise<boolean> => {
    if (!ownerUserId || typeof window === 'undefined') return false

    try {
      const accessToken = await getAccessToken()
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...contactData,
          ownerUserId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create contact')
      }

      // Add the new contact to local state
      setContacts(prev => [data.contact, ...prev])
      return true
    } catch (err) {
      console.error('Error creating contact:', err)
      setError(err instanceof Error ? err.message : 'Failed to create contact')
      return false
    }
  }, [ownerUserId, getAccessToken])

  const updateContact = useCallback(async (contactEmail: string, updateData: Partial<Contact>): Promise<boolean> => {
    if (!ownerUserId || typeof window === 'undefined') return false

    try {
      const accessToken = await getAccessToken()
      const response = await fetch('/api/contacts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ownerUserId,
          contactEmail,
          ...updateData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update contact')
      }

      // Update local state
      setContacts(prev => 
        prev.map(contact => 
          contact.contactEmail === contactEmail 
            ? { ...contact, ...updateData }
            : contact
        )
      )
      
      return true
    } catch (err) {
      console.error('Error updating contact:', err)
      setError(err instanceof Error ? err.message : 'Failed to update contact')
      return false
    }
  }, [ownerUserId, getAccessToken])

  const deleteContact = useCallback(async (contactEmail: string): Promise<boolean> => {
    if (!ownerUserId || typeof window === 'undefined') return false

    try {
      const accessToken = await getAccessToken()
      const response = await fetch('/api/contacts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ownerUserId,
          contactEmail
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete contact')
      }

      // Remove from local state
      setContacts(prev => prev.filter(contact => contact.contactEmail !== contactEmail))
      setSearchResults(prev => prev.filter(contact => contact.contactEmail !== contactEmail))
      
      return true
    } catch (err) {
      console.error('Error deleting contact:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete contact')
      return false
    }
  }, [ownerUserId, getAccessToken])

  const toggleFavorite = useCallback(async (contactEmail: string): Promise<boolean> => {
    if (!ownerUserId || typeof window === 'undefined') return false

    try {
      const accessToken = await getAccessToken()
      const response = await fetch('/api/contacts/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ownerUserId,
          contactEmail
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle favorite')
      }

      // Update local state
      setContacts(prev => 
        prev.map(contact => 
          contact.contactEmail === contactEmail 
            ? { ...contact, favorite: !contact.favorite }
            : contact
        ).sort((a, b) => {
          // Re-sort with favorites first
          if (a.favorite && !b.favorite) return -1
          if (!a.favorite && b.favorite) return 1
          return new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime()
        })
      )
      
      return true
    } catch (err) {
      console.error('Error toggling favorite:', err)
      setError(err instanceof Error ? err.message : 'Failed to toggle favorite')
      return false
    }
  }, [ownerUserId, getAccessToken])

  const searchContacts = useCallback(async (query: string) => {
    if (!query.trim() || typeof window === 'undefined') {
      setSearchResults([])
      return
    }

    await fetchContacts(query.trim())
  }, [fetchContacts])

  const clearSearch = useCallback(() => {
    setSearchResults([])
  }, [])

  // Load contacts when ownerUserId becomes available
  useEffect(() => {
    if (ownerUserId) {
      refreshContacts()
    }
  }, [ownerUserId, refreshContacts])

  return {
    contacts,
    isLoading,
    error,
    searchResults,
    isSearching,
    refreshContacts,
    createContact,
    updateContact,
    deleteContact,
    toggleFavorite,
    searchContacts,
    clearSearch
  }
}