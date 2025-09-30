"use client";

import { useState } from 'react'
import { copyToClipboard } from '@/lib/utils'

interface WalletAddressDisplayProps {
  address: string
  onCreateQR: () => void
}

export function WalletAddressDisplay({ address, onCreateQR }: WalletAddressDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(address)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: 'My Between Friends Wallet Address',
      text: `Send me USDC at my wallet address: ${address}`,
      url: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/send?to=${address}`
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        // Fallback to clipboard if sharing fails
        await copyToClipboard(`Send me USDC at my wallet address: ${address}`)
      }
    } else {
      // Fallback to clipboard for desktop
      await copyToClipboard(`Send me USDC at my wallet address: ${address}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Wallet Address Card */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Wallet Address</h3>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-3">
              <p className="text-sm text-gray-600 mb-1">Base Network Address</p>
              <p className="font-mono text-sm text-gray-900 break-all">
                {address}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                copied 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
              }`}
              aria-label="Copy address"
            >
              {copied ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
          
          {copied && (
            <div className="mt-2">
              <p className="text-green-600 text-sm font-medium">✓ Copied to clipboard!</p>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600 space-y-2">
          <p className="flex items-start">
            <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Share this address to receive USDC on Base Network
          </p>
          <p className="flex items-start">
            <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Only accept USDC transfers to avoid losing funds
          </p>
          <p className="flex items-start">
            <svg className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Double-check the network is Base before sending
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleShare}
          className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </div>
          <span className="font-medium text-gray-900 text-sm">Share Address</span>
          <span className="text-gray-500 text-xs mt-1">Send via message</span>
        </button>

        <button
          onClick={onCreateQR}
          className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <span className="font-medium text-gray-900 text-sm">Show QR Code</span>
          <span className="text-gray-500 text-xs mt-1">For in-person</span>
        </button>
      </div>

      {/* Network Information */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div className="ml-4">
            <h4 className="font-medium text-blue-900 mb-1">Base Network Information</h4>
            <div className="text-blue-800 text-sm space-y-1">
              <p>• This address only receives USDC on Base Network</p>
              <p>• Transfers from other networks will be lost</p>
              <p>• Gas fees are paid automatically by the sender</p>
              <p>• Transactions are typically confirmed in seconds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Address Usage */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Address Usage</h3>
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm">No recent activity</p>
          <p className="text-xs mt-1">Incoming transfers will appear here</p>
        </div>
      </div>
    </div>
  )
}