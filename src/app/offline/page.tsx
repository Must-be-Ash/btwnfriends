"use client";

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'

export default function OfflinePage() {
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(true)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Check initial status
    updateOnlineStatus()

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const handleRetry = async () => {
    setIsRetrying(true)
    
    // Try to fetch a small resource to check connectivity
    try {
      await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-cache' })
      // If successful, redirect to home
      router.push('/')
    } catch (error) {
      // Still offline, show feedback
      setTimeout(() => setIsRetrying(false), 1000)
    }
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#222222] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-[#3B3B3B] rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Status Icon */}
          <div className="mb-6">
            {isOnline ? (
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <Wifi className="w-8 h-8 text-green-400" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <WifiOff className="w-8 h-8 text-red-400" />
              </div>
            )}
          </div>

          {/* Title and Message */}
          <h1 className="text-2xl font-bold text-white mb-4">
            {isOnline ? 'Connection Restored' : 'You\'re Offline'}
          </h1>
          
          <p className="text-white/70 mb-8 leading-relaxed">
            {isOnline 
              ? 'Your internet connection has been restored. You can now access all features of Between Friends.'
              : 'Don\'t worry! You can still view your recent transaction history and prepare transfers. We\'ll sync everything when you\'re back online.'
            }
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            {isOnline ? (
              <button
                onClick={handleGoHome}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-colors"
              >
                Continue to App
              </button>
            ) : (
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Checking Connection...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleGoHome}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-2xl transition-colors"
            >
              View Cached Data
            </button>
          </div>

          {/* Offline Features */}
          {!isOnline && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-white font-medium mb-4">Available Offline:</h3>
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>View recent transactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Access contact information</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Prepare transfers for later</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}