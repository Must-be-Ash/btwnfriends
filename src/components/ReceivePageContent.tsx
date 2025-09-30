"use client";

// import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useIsSignedIn, useEvmAddress } from '@coinbase/cdp-hooks'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { SimpleReceive } from '@/components/receive/SimpleReceive'

export default function ReceivePageContent() {
  const router = useRouter()
  const { isSignedIn } = useIsSignedIn()
  const { evmAddress } = useEvmAddress()

  // Redirect if not signed in
  if (!isSignedIn) {
    router.push('/')
    return <LoadingScreen message="Redirecting..." />
  }

  // Wait for address to load
  if (!evmAddress) {
    return <LoadingScreen message="Loading wallet..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 safe-area-inset">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 mr-3 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Receive Money</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <SimpleReceive address={evmAddress} />
      </div>

      {/* Bottom spacing for mobile navigation */}
      <div className="h-20"></div>
    </div>
  )
}