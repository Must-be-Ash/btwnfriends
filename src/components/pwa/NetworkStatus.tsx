"use client";

import { useState, useEffect } from 'react'
import { Wifi, WifiOff } from 'lucide-react'

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)
      
      // Show status change notification
      setShowStatus(true)
      
      // Hide after 3 seconds if online, keep visible if offline
      if (online) {
        setTimeout(() => setShowStatus(false), 3000)
      }
    }

    // Set initial status
    setIsOnline(navigator.onLine)
    
    // Only show initial status if offline
    if (!navigator.onLine) {
      setShowStatus(true)
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  // Don't show if online and timeout has passed
  if (!showStatus) {
    return null
  }

  return (
    <div className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
      showStatus ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className={`mx-auto max-w-sm rounded-2xl p-3 shadow-lg backdrop-blur-xl border ${
        isOnline 
          ? 'bg-green-500/10 border-green-500/20 text-green-400' 
          : 'bg-red-500/10 border-red-500/20 text-red-400'
      }`}>
        <div className="flex items-center gap-2 text-sm font-medium">
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4" />
              <span>Back online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span>You&apos;re offline</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}