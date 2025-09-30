"use client";

import { useEffect, useState } from 'react'
import { useIsSignedIn, useCurrentUser } from '@coinbase/cdp-hooks'

/**
 * Session Monitor Component for Mobile Debugging
 * Helps monitor session state and storage availability on mobile devices
 */
export function SessionMonitor() {
  const { isSignedIn } = useIsSignedIn()
  const { currentUser } = useCurrentUser()
  const [storageStatus, setStorageStatus] = useState<{
    localStorage: boolean
    sessionStorage: boolean
    memoryStorage: boolean
  }>({
    localStorage: false,
    sessionStorage: false,
    memoryStorage: false
  })

  useEffect(() => {
    // Check storage availability
    const checkStorage = () => {
      try {
        const testKey = '__storage_test__'
        
        // Test localStorage
        let localStorageAvailable = false
        try {
          localStorage.setItem(testKey, 'test')
          localStorage.removeItem(testKey)
          localStorageAvailable = true
        } catch (e) {
          localStorageAvailable = false
        }

        // Test sessionStorage
        let sessionStorageAvailable = false
        try {
          window.sessionStorage.setItem(testKey, 'test')
          window.sessionStorage.removeItem(testKey)
          sessionStorageAvailable = true
        } catch (e) {
          sessionStorageAvailable = false
        }

        // Test memory storage (always available)
        const memoryStorageAvailable = true

        setStorageStatus({
          localStorage: localStorageAvailable,
          sessionStorage: sessionStorageAvailable,
          memoryStorage: memoryStorageAvailable
        })
      } catch (error) {
        console.warn('Failed to check storage status:', error)
      }
    }

    checkStorage()

    // Check storage periodically on mobile
    const interval = setInterval(checkStorage, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Only show in development or when there are storage issues
  if (process.env.NODE_ENV !== 'development' && 
      storageStatus.localStorage && 
      storageStatus.sessionStorage) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white text-xs p-2 rounded-lg backdrop-blur-sm">
      <div className="font-semibold mb-1">Session Monitor</div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isSignedIn ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>Signed In: {isSignedIn ? 'Yes' : 'No'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${currentUser ? 'bg-green-500' : 'bg-gray-500'}`} />
          <span>User: {currentUser ? 'Loaded' : 'None'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${storageStatus.localStorage ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>localStorage: {storageStatus.localStorage ? 'OK' : 'Failed'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${storageStatus.sessionStorage ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>sessionStorage: {storageStatus.sessionStorage ? 'OK' : 'Failed'}</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Device: {typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'}
        </div>
      </div>
    </div>
  )
}
