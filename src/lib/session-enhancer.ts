/**
 * CDP Session Enhancer for Mobile Browsers
 * Provides additional session persistence mechanisms for mobile browsers
 * where localStorage may be unreliable
 */

import { useEffect, useRef } from 'react'
import { useIsSignedIn, useCurrentUser, useGetAccessToken } from '@coinbase/cdp-hooks'
import { setStorageItem, getStorageItem, removeStorageItem } from './storage'

// Session backup key
const SESSION_BACKUP_KEY = 'cdp_session_backup'
const SESSION_RESTORE_ATTEMPTED_KEY = 'cdp_session_restore_attempted'

/**
 * Hook that enhances CDP session persistence for mobile browsers
 * This provides additional fallbacks when localStorage is unreliable
 */
export function useSessionEnhancer() {
  const { isSignedIn } = useIsSignedIn()
  const { currentUser } = useCurrentUser()
  const { getAccessToken } = useGetAccessToken()
  const restoreAttempted = useRef(false)

  // Attempt to restore session on app initialization
  useEffect(() => {
    const attemptSessionRestore = async () => {
      // Only attempt restore once per session
      if (restoreAttempted.current) return
      restoreAttempted.current = true

      // Don't restore if already signed in
      if (isSignedIn) return

      // Check if we've already attempted restore in this session
      const alreadyAttempted = getStorageItem(SESSION_RESTORE_ATTEMPTED_KEY)
      if (alreadyAttempted) return

      try {
        const backup = getStorageItem(SESSION_BACKUP_KEY)
        if (!backup) return

        const sessionData = JSON.parse(backup)
        const isRecent = Date.now() - sessionData.timestamp < 24 * 60 * 60 * 1000 // 24 hours

        if (sessionData.hasValidToken && isRecent) {
          console.log('🔄 Attempting to restore session from backup')
          
          // Mark that we've attempted restore
          setStorageItem(SESSION_RESTORE_ATTEMPTED_KEY, 'true')
          
          // Try to validate the session by making a test API call
          // This will trigger CDP to restore the session if it's still valid
          try {
            const testToken = await getAccessToken()
            if (testToken) {
              console.log('✅ Session restored successfully')
              // Clear the restore attempted flag since we succeeded
              removeStorageItem(SESSION_RESTORE_ATTEMPTED_KEY)
            }
          } catch (error) {
            console.log('❌ Session restore failed, clearing backup')
            // Clear invalid backup
            removeStorageItem(SESSION_BACKUP_KEY)
            removeStorageItem(SESSION_RESTORE_ATTEMPTED_KEY)
          }
        } else {
          // Clear old backup
          removeStorageItem(SESSION_BACKUP_KEY)
        }
      } catch (error) {
        console.warn('Failed to restore session:', error)
        removeStorageItem(SESSION_BACKUP_KEY)
        removeStorageItem(SESSION_RESTORE_ATTEMPTED_KEY)
      }
    }

    // Attempt restore after a short delay to let CDP initialize
    const timeoutId = setTimeout(attemptSessionRestore, 1000)
    return () => clearTimeout(timeoutId)
  }, [isSignedIn, getAccessToken])

  // Backup session information when user signs in
  useEffect(() => {
    const backupSession = async () => {
      if (isSignedIn && currentUser) {
        try {
          // Get access token to verify session is valid
          const accessToken = await getAccessToken()

          if (accessToken) {
            // Create session backup
            const sessionBackup = {
              userId: currentUser.userId,
              evmAccounts: currentUser.evmAccounts,
              authMethods: currentUser.authenticationMethods,
              timestamp: Date.now(),
              hasValidToken: true
            }

            // Store backup in our safe storage
            setStorageItem(SESSION_BACKUP_KEY, JSON.stringify(sessionBackup))

            // Clear restore attempted flag since we have a fresh session
            removeStorageItem(SESSION_RESTORE_ATTEMPTED_KEY)

            console.log('🔐 Session backup created for mobile persistence')
          }
        } catch (error) {
          console.warn('Failed to backup session:', error)
        }
      }
    }

    // Only backup if we have a valid session
    if (isSignedIn && currentUser) {
      backupSession()
    }
  }, [isSignedIn, currentUser, getAccessToken])

  // Clean up session backup when user signs out
  useEffect(() => {
    if (!isSignedIn) {
      try {
        // Clear session backup when user logs out
        removeStorageItem(SESSION_BACKUP_KEY)
        removeStorageItem(SESSION_RESTORE_ATTEMPTED_KEY)
        console.log('🔐 Session backup cleared after logout')
      } catch (error) {
        console.warn('Failed to clear session backup:', error)
      }
    }
  }, [isSignedIn])

  return {
    // Utility to check if there's a session backup available
    hasSessionBackup: () => {
      try {
        const backup = getStorageItem(SESSION_BACKUP_KEY)
        if (!backup) return false

        const sessionData = JSON.parse(backup)
        const isRecent = Date.now() - sessionData.timestamp < 24 * 60 * 60 * 1000 // 24 hours

        return sessionData.hasValidToken && isRecent
      } catch {
        return false
      }
    },

    // Get session backup data
    getSessionBackup: () => {
      try {
        const backup = getStorageItem(SESSION_BACKUP_KEY)
        return backup ? JSON.parse(backup) : null
      } catch {
        return null
      }
    }
  }
}