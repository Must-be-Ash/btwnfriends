/**
 * Session Restoration Hook for Mobile Browsers
 * Provides additional session restoration mechanisms for mobile browsers
 * where CDP session persistence may be unreliable
 */

import { useEffect, useRef, useState } from 'react'
import { useIsInitialized, useIsSignedIn, useGetAccessToken } from '@coinbase/cdp-hooks'
import { getStorageItem, setStorageItem, removeStorageItem } from '@/lib/storage'

const SESSION_BACKUP_KEY = 'cdp_session_backup'
const SESSION_RESTORE_ATTEMPTED_KEY = 'cdp_session_restore_attempted'

export function useSessionRestore() {
  const { isInitialized } = useIsInitialized()
  const { isSignedIn } = useIsSignedIn()
  const { getAccessToken } = useGetAccessToken()
  
  const [isRestoring, setIsRestoring] = useState(false)
  const restoreAttempted = useRef(false)

  // Attempt to restore session when CDP is initialized
  useEffect(() => {
    const attemptSessionRestore = async () => {
      // Only attempt restore once per session
      if (restoreAttempted.current || !isInitialized) return
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
          setIsRestoring(true)
          
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
      } finally {
        setIsRestoring(false)
      }
    }

    // Attempt restore after CDP is initialized
    if (isInitialized) {
      const timeoutId = setTimeout(attemptSessionRestore, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [isInitialized, isSignedIn, getAccessToken])

  // Clear restore flag when user signs in
  useEffect(() => {
    if (isSignedIn) {
      removeStorageItem(SESSION_RESTORE_ATTEMPTED_KEY)
    }
  }, [isSignedIn])

  return {
    isRestoring,
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
    }
  }
}
