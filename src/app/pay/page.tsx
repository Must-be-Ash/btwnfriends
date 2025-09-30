"use client";

// Force dynamic rendering for this page to avoid SSR issues
export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useIsSignedIn, useCurrentUser } from '@coinbase/cdp-hooks'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { formatUSDCWithSymbol } from '@/lib/utils'
import { ExternalLink, Download, Copy, CheckCircle } from 'lucide-react'

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

function PayPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isSignedIn } = useIsSignedIn()
  const { } = useCurrentUser()

  const [isLoading, setIsLoading] = useState(true)
  const [isPWAStandalone, setIsPWAStandalone] = useState(false)
  const [recipientUser, setRecipientUser] = useState<UserLookupResult['user'] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [urlCopied, setUrlCopied] = useState(false)

  // Extract parameters from URL
  const walletAddress = searchParams.get('to') || searchParams.get('address')
  const amount = searchParams.get('amount')
  const message = searchParams.get('message') || searchParams.get('memo')
  const name = searchParams.get('name') || searchParams.get('displayName')

  // Detect PWA standalone mode
  const detectPWAMode = useCallback(() => {
    if (typeof window === 'undefined') return false

    // Check if running in PWA standalone mode
    const isStandalone =
      (window.navigator as unknown as { standalone?: boolean }).standalone || // iOS Safari PWA
      window.matchMedia('(display-mode: standalone)').matches || // Android Chrome PWA
      window.matchMedia('(display-mode: fullscreen)').matches

    console.log('🔍 PWA Detection:', {
      isStandalone,
      navigator_standalone: (window.navigator as unknown as { standalone?: boolean }).standalone,
      display_mode_standalone: window.matchMedia('(display-mode: standalone)').matches,
      display_mode_fullscreen: window.matchMedia('(display-mode: fullscreen)').matches,
      userAgent: navigator.userAgent
    })

    return isStandalone
  }, [])

  // Lookup user by wallet address
  const lookupUserByWalletAddress = useCallback(async (address: string): Promise<UserLookupResult> => {
    try {
      console.log('🔍 Looking up user by wallet address:', address)

      const response = await fetch(`/api/users/lookup-by-address?address=${encodeURIComponent(address)}`, {
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

  // Handle PWA routing logic
  const handlePWARouting = useCallback(async () => {
    console.log('🎯 Starting PWA routing logic...')

    const standalone = detectPWAMode()
    setIsPWAStandalone(standalone)

    // Validate wallet address
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      setError('Invalid or missing wallet address in payment request')
      setIsLoading(false)
      return
    }

    // Lookup recipient user
    try {
      const userLookup = await lookupUserByWalletAddress(walletAddress)

      if (!userLookup.success) {
        setError(userLookup.message || 'Failed to lookup recipient')
        setIsLoading(false)
        return
      }

      setRecipientUser(userLookup.user || null)

      // If user is signed in, redirect directly to send flow (like QR code scanning)
      if (isSignedIn && userLookup.user) {
        console.log('✅ Signed in user - redirecting to send flow')

        const sendParams = new URLSearchParams()
        sendParams.set('contactEmail', userLookup.user.email)
        sendParams.set('displayName', userLookup.user.displayName)

        if (amount) sendParams.set('amount', amount)
        if (message) sendParams.set('message', message)

        router.replace(`/send?${sendParams.toString()}`)
        return
      }

      setIsLoading(false)
    } catch (error) {
      console.error('❌ Error in PWA routing:', error)
      setError('Failed to process payment request')
      setIsLoading(false)
    }
  }, [walletAddress, amount, message, isSignedIn, detectPWAMode, lookupUserByWalletAddress, router])

  // Initialize on mount
  useEffect(() => {
    handlePWARouting()
  }, [handlePWARouting])

  // Handle opening in PWA
  const handleOpenInPWA = useCallback(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href
      console.log('🔗 Attempting to open in PWA:', currentUrl)

      // Try to open in installed PWA - simplified approach
      window.location.href = currentUrl
    }
  }, [])

  // Handle PWA installation
  const handleInstallPWA = useCallback(() => {
    // Redirect to main page where install prompt can be triggered
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }, [])

  // Copy URL to clipboard
  const handleCopyUrl = useCallback(async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href)
        setUrlCopied(true)
        setTimeout(() => setUrlCopied(false), 2000)
      }
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen message="Loading payment request..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center p-4">
        <div className="bg-[#2A2A2A] border border-[#4A4A4A] rounded-3xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Payment Request Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-3 px-6 bg-[#5CB0FF] text-white rounded-xl font-semibold hover:bg-[#4A9DE8] transition-colors"
          >
            Go to Between Friends
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#222222] flex items-center justify-center p-4">
      <div className="bg-[#2A2A2A] border border-[#4A4A4A] rounded-3xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Payment Request</h1>
          <p className="text-gray-300">from Between Friends</p>
        </div>

        {/* Payment Details */}
        <div className="space-y-6 mb-8">
          {/* Recipient */}
          <div className="bg-[#333333] rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Send to</h3>
            {recipientUser ? (
              <div>
                <p className="text-lg font-semibold text-white">{recipientUser.displayName}</p>
                <p className="text-sm text-gray-400">{recipientUser.email}</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-semibold text-white">{name || 'Unknown User'}</p>
                <p className="text-sm text-gray-400 font-mono">
                  {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-6)}
                </p>
              </div>
            )}
          </div>

          {/* Amount */}
          {amount && (
            <div className="bg-[#333333] rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Amount</h3>
              <p className="text-2xl font-bold text-[#5CB0FF]">{formatUSDCWithSymbol(amount)}</p>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className="bg-[#333333] rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Message</h3>
              <p className="text-white italic">&ldquo;{message}&rdquo;</p>
            </div>
          )}

          {/* Network Info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <h3 className="text-sm font-medium text-blue-400 mb-2">Network</h3>
            <p className="text-white">Base Network • USDC</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isSignedIn && isPWAStandalone ? (
            // User is signed in and in PWA - direct action
            <button
              onClick={handlePWARouting}
              className="w-full py-4 px-6 bg-[#5CB0FF] text-white rounded-xl font-semibold hover:bg-[#4A9DE8] transition-colors flex items-center justify-center gap-2"
            >
              <span>Send Payment</span>
            </button>
          ) : isPWAStandalone ? (
            // In PWA but not signed in
            <button
              onClick={() => router.push('/')}
              className="w-full py-4 px-6 bg-[#5CB0FF] text-white rounded-xl font-semibold hover:bg-[#4A9DE8] transition-colors"
            >
              Sign In to Send Payment
            </button>
          ) : (
            // Not in PWA - show install/open options
            <>
              <button
                onClick={handleOpenInPWA}
                className="w-full py-4 px-6 bg-[#5CB0FF] text-white rounded-xl font-semibold hover:bg-[#4A9DE8] transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Open in Between Friends</span>
              </button>

              <button
                onClick={handleInstallPWA}
                className="w-full py-3 px-6 border border-gray-600 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Install Between Friends</span>
              </button>

              <button
                onClick={handleCopyUrl}
                className="w-full py-3 px-6 border border-gray-600 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                {urlCopied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Powered by <span className="text-[#5CB0FF]">Between Friends</span> &bull; Secure USDC transfers on Base
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PayPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Loading payment request..." />}>
      <PayPageContent />
    </Suspense>
  )
}