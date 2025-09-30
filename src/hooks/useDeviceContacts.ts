'use client'

import { useState, useCallback } from 'react'
import { DeviceContact } from '@/types'

// Browser Contacts API type definitions
interface ContactProperty {
  value: string
}

interface ContactName {
  given?: string[]
  family?: string[]
  formatted?: string
}

interface BrowserContact {
  id?: string
  name?: ContactName[]
  email?: ContactProperty[]
  tel?: ContactProperty[]
}

interface ContactsManager {
  select(properties: string[], options?: { multiple?: boolean }): Promise<BrowserContact[]>
}

// Type assertion helper for navigator with contacts
declare global {
  interface Navigator {
    contacts?: ContactsManager
  }
}

interface UseDeviceContactsReturn {
  requestPermission: () => Promise<boolean>
  syncContacts: (ownerUserId: string) => Promise<{ success: boolean; message: string; newContactsCount?: number }>
  isLoading: boolean
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown'
}

export function useDeviceContacts(): UseDeviceContactsReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown')

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      // Check if contacts API is available
      if (!('contacts' in navigator)) {
        console.warn('Contacts API not available')
        setPermissionStatus('denied')
        return false
      }

      // Request permission
      const permission = await navigator.permissions.query({ name: 'contacts' } as unknown as PermissionDescriptor)
      
      if (permission.state === 'granted') {
        setPermissionStatus('granted')
        return true
      } else if (permission.state === 'denied') {
        setPermissionStatus('denied')
        return false
      } else {
        // Try to access contacts to trigger permission prompt
        try {
          await navigator.contacts!.select(['name', 'email', 'tel'], { multiple: true })
          setPermissionStatus('granted')
          return true
        } catch (error) {
          setPermissionStatus('denied')
          return false
        }
      }
    } catch (error) {
      console.error('Error requesting contacts permission:', error)
      setPermissionStatus('denied')
      return false
    }
  }, [])

  const getDeviceContacts = useCallback(async (): Promise<DeviceContact[]> => {
    if (!('contacts' in navigator)) {
      throw new Error('Contacts API not available')
    }

    try {
      const contacts = await navigator.contacts!.select(
        ['name', 'email', 'tel'],
        { multiple: true }
      )

      return contacts.map((contact: BrowserContact, index: number) => ({
        id: contact.id || `contact-${index}`,
        firstName: contact.name?.[0]?.given?.[0] || '',
        lastName: contact.name?.[0]?.family?.[0] || '',
        displayName: contact.name?.[0]?.formatted || 
                    [contact.name?.[0]?.given?.[0], contact.name?.[0]?.family?.[0]]
                      .filter(Boolean)
                      .join(' ') ||
                    contact.email?.[0]?.value ||
                    `Contact ${index + 1}`,
        emails: contact.email?.map((email: ContactProperty) => email.value) || [],
        phoneNumbers: contact.tel?.map((tel: ContactProperty) => tel.value) || [],
        avatar: undefined // Browser API doesn't typically provide avatars
      })).filter((contact: DeviceContact) => contact.emails.length > 0) // Only contacts with emails
    } catch (error) {
      console.error('Error accessing device contacts:', error)
      throw error
    }
  }, [])

  const syncContacts = useCallback(async (ownerUserId: string): Promise<{ success: boolean; message: string; newContactsCount?: number }> => {
    setIsLoading(true)
    
    try {
      // First request permission
      const hasPermission = await requestPermission()
      if (!hasPermission) {
        return {
          success: false,
          message: 'Permission denied to access contacts. Please enable contacts permission in your browser settings.'
        }
      }

      // Get device contacts
      const deviceContacts = await getDeviceContacts()
      
      if (deviceContacts.length === 0) {
        return {
          success: true,
          message: 'No contacts found on device',
          newContactsCount: 0
        }
      }

      // Send to API for processing
      const response = await fetch('/api/contacts/sync-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerUserId,
          deviceContacts
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync contacts')
      }

      return {
        success: true,
        message: data.message,
        newContactsCount: data.newContactsCount
      }
    } catch (error) {
      console.error('Contact sync error:', error)
      
      let message = 'Failed to sync contacts'
      if (error instanceof Error) {
        if (error.message.includes('not available')) {
          message = 'Contact access is not supported on this device/browser'
        } else if (error.message.includes('denied')) {
          message = 'Permission denied. Please allow contact access and try again'
        } else {
          message = error.message
        }
      }
      
      return {
        success: false,
        message
      }
    } finally {
      setIsLoading(false)
    }
  }, [requestPermission, getDeviceContacts])

  return {
    requestPermission,
    syncContacts,
    isLoading,
    permissionStatus
  }
}