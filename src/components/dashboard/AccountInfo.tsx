"use client";

import { useState } from 'react'
import { formatAddress } from '@/lib/cdp'
import { copyToClipboard } from '@/lib/utils'

interface UserProfile {
  userId: string
  email: string
  displayName: string
  profileSetupComplete: boolean
  walletAddress?: string
}

interface AccountInfoProps {
  user: UserProfile | null
  walletAddress: string
}

export function AccountInfo({ user, walletAddress }: AccountInfoProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    }
  }

  if (!user) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Info</h3>
      
      <div className="space-y-4">
        {/* Display Name */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Display Name</p>
          <p className="text-gray-900">{user.displayName}</p>
        </div>

        {/* Email */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
          <div className="flex items-center justify-between">
            <p className="text-gray-900">{user.email}</p>
            <button
              onClick={() => handleCopy(user.email, 'email')}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Copy email"
            >
              {copiedField === 'email' ? (
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Wallet Address */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Wallet Address</p>
          <div className="flex items-center justify-between">
            <p className="text-gray-900 font-mono text-sm">
              {formatAddress(walletAddress)}
            </p>
            <button
              onClick={() => handleCopy(walletAddress, 'address')}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Copy wallet address"
            >
              {copiedField === 'address' ? (
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {copiedField && (
        <div className="mt-3 text-sm text-green-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Copied to clipboard!
        </div>
      )}
    </div>
  )
}