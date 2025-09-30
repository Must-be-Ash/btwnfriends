"use client";

import { useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useIsInitialized, useIsSignedIn } from '@coinbase/cdp-hooks'
import { AuthPage } from '@/components/auth/AuthPage'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { useSessionEnhancer } from '@/lib/session-enhancer'
import { useSessionRestore } from '@/hooks/useSessionRestore'

export function MainPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isInitialized } = useIsInitialized()
  const { isSignedIn } = useIsSignedIn()

  // Enhance session persistence for mobile browsers
  useSessionEnhancer()

  // Attempt to restore session on mobile browsers
  const { isRestoring } = useSessionRestore()

  // Lookup user by wallet address (for payment redirects)
  const lookupUserByWalletAddress = useCallback(async (address: string) => {
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

  // Handle payment redirect after authentication
  useEffect(() => {
    if (!isSignedIn || !isInitialized || isRestoring) {
      return
    }

    const handlePaymentRedirect = async () => {
      // Check if user came from /pay with payment parameters
      const walletAddress = searchParams.get('to') || searchParams.get('address')
      const amount = searchParams.get('amount')
      const message = searchParams.get('message') || searchParams.get('memo')

      if (walletAddress && /^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        console.log('🎯 Payment redirect detected, looking up user...')

        // Lookup recipient user
        const userLookup = await lookupUserByWalletAddress(walletAddress)

        if (userLookup.success && userLookup.user) {
          console.log('✅ Redirecting to send flow with user:', userLookup.user.email)

          const sendParams = new URLSearchParams()
          sendParams.set('contactEmail', userLookup.user.email)
          sendParams.set('displayName', userLookup.user.displayName)

          if (amount) sendParams.set('amount', amount)
          if (message) sendParams.set('message', message)

          router.replace(`/send?${sendParams.toString()}`)
        }
      }
    }

    handlePaymentRedirect()
  }, [isSignedIn, isInitialized, isRestoring, searchParams, router, lookupUserByWalletAddress])

  // Show loading while CDP initializes or while restoring session
  if (!isInitialized || isRestoring) {
    return <LoadingScreen message={isRestoring ? "Restoring session..." : "Loading..."} />
  }

  // Show authentication if not signed in
  if (!isSignedIn) {
    return <AuthPage />
  }

  // Show main dashboard for authenticated users
  return <Dashboard />
}