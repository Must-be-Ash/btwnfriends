"use client";

// Force dynamic rendering for this page to avoid SSR issues
export const dynamic = 'force-dynamic'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useIsSignedIn, useCurrentUser } from '@coinbase/cdp-hooks'
import { PWAQRScanner } from '@/components/scanner/PWAQRScanner'
import { LoadingScreen } from '@/components/shared/LoadingScreen'

interface QRScanResult {
  walletAddress?: string
  amount?: string
  message?: string
  name?: string
  url?: string
}

interface UserLookupResult {
  success: boolean
  user?: {
    userId: string
    email: string
    displayName: string
    walletAddress: string
  }
  message?: string
}

export default function ScanPage() {
  const router = useRouter()
  const { isSignedIn } = useIsSignedIn()
  const { } = useCurrentUser()

  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Lookup user by wallet address
  const lookupUserByWalletAddress = useCallback(async (walletAddress: string): Promise<UserLookupResult> => {
    try {
      console.log('🔍 Looking up user by wallet address:', walletAddress)

      const response = await fetch(`/api/users/lookup-by-address?address=${encodeURIComponent(walletAddress)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ User lookup result:', result)

      return result
    } catch (error) {
      console.error('❌ Error looking up user:', error)
      return {
        success: false,
        message: 'Failed to lookup user information'
      }
    }
  }, [])

  // Handle successful QR scan
  const handleScanSuccess = useCallback(async (result: QRScanResult) => {
    console.log('🎯 QR Scan successful:', result)
    setIsProcessing(true)
    setError(null)

    try {
      // Extract wallet address from scan result
      const { walletAddress, amount, message } = result

      if (!walletAddress) {
        throw new Error('No wallet address found in QR code')
      }

      // Validate wallet address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        throw new Error('Invalid wallet address format')
      }

      // Lookup user by wallet address
      const userLookup = await lookupUserByWalletAddress(walletAddress)

      if (!userLookup.success) {
        throw new Error(userLookup.message || 'Failed to lookup user')
      }

      if (userLookup.user) {
        // User found - navigate to send page with pre-filled data
        const searchParams = new URLSearchParams()
        searchParams.set('contactEmail', userLookup.user.email)
        searchParams.set('displayName', userLookup.user.displayName)

        if (amount) {
          searchParams.set('amount', amount)
        }

        if (message) {
          searchParams.set('message', message)
        }

        console.log('✅ Redirecting to send page with user:', userLookup.user.email)
        router.push(`/send?${searchParams.toString()}`)
      } else {
        // User not found - this is an unknown wallet address
        console.log('❌ No user found for wallet address:', walletAddress)

        // For unknown recipients, we could either:
        // 1. Show an error
        // 2. Route to escrow flow
        // 3. Allow manual entry

        // For now, let's show an error with the option to continue
        setError(
          `No Between Friends user found with wallet address ${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}. ` +
          'This QR code might be from another app or an unregistered user.'
        )
      }
    } catch (error) {
      console.error('❌ Error processing QR scan:', error)
      setError(error instanceof Error ? error.message : 'Failed to process QR code')
    } finally {
      setIsProcessing(false)
    }
  }, [router, lookupUserByWalletAddress])

  // Handle scanner close
  const handleScannerClose = useCallback(() => {
    console.log('📱 Scanner closed, redirecting to dashboard')
    router.push('/')
  }, [router])

  // Handle retry after error
  const handleRetry = useCallback(() => {
    setError(null)
    setIsProcessing(false)
  }, [])

  // Redirect if not signed in
  if (!isSignedIn) {
    router.push('/')
    return <LoadingScreen message="Redirecting..." />
  }


  // Show processing state
  if (isProcessing) {
    return (
      <LoadingScreen message="Processing QR code..." />
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center p-4">
        <div className="bg-[#2A2A2A] border border-[#4A4A4A] rounded-3xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-white mb-2">QR Code Error</h2>
          <p className="text-gray-300 mb-6 text-sm leading-relaxed">{error}</p>

          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full py-3 px-6 bg-[#5CB0FF] text-white rounded-xl font-semibold hover:bg-[#4A9DE8] transition-colors"
            >
              Scan Another Code
            </button>
            <button
              onClick={handleScannerClose}
              className="w-full py-3 px-6 border border-gray-600 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show QR scanner
  return (
    <PWAQRScanner
      onScanSuccess={handleScanSuccess}
      onClose={handleScannerClose}
    />
  )
}