"use client";

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
import { formatUSDCWithSymbol, copyToClipboard } from '@/lib/utils'

interface PaymentRequest {
  amount?: string
  message?: string
  walletAddress: string
  userEmail?: string
  displayName?: string
}

interface QRCodeDisplayProps {
  paymentRequest: PaymentRequest
  onBack: () => void
  onEditRequest: () => void
}

export function QRCodeDisplay({ paymentRequest, onBack, onEditRequest }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [paymentUrl, setPaymentUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(true)

  const generateQRCode = useCallback(async () => {
    setIsGenerating(true)
    try {
      // Create universal payment URL that works for both in-app scanning and external cameras
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
      const params = new URLSearchParams()

      // Add wallet address - this is the primary identifier
      params.set('to', paymentRequest.walletAddress)

      // Add amount if specified
      if (paymentRequest.amount) {
        params.set('amount', paymentRequest.amount)
      }

      // Add message if specified
      if (paymentRequest.message) {
        params.set('message', paymentRequest.message)
      }

      // Add user info if available
      if (paymentRequest.displayName) {
        params.set('name', paymentRequest.displayName)
      }

      // Add user email for direct contact lookup (privacy consideration: this exposes email in QR)
      if (paymentRequest.userEmail) {
        params.set('email', paymentRequest.userEmail)
      }

      // Use /pay route for universal compatibility - handles both PWA and external scanning
      const fullPaymentUrl = `${baseUrl}/pay?${params.toString()}`
      setPaymentUrl(fullPaymentUrl)
      
      // Generate QR code for the payment URL
      const qrUrl = await QRCode.toDataURL(fullPaymentUrl, {
        width: 280,
        margin: 2,
        color: {
          dark: '#111827', // gray-900
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      })
      
      setQrCodeUrl(qrUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [paymentRequest])

  useEffect(() => {
    generateQRCode()
  }, [generateQRCode])

  const handleCopyUrl = async () => {
    const success = await copyToClipboard(paymentUrl)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    const shareText = paymentRequest.amount 
      ? `Send me ${formatUSDCWithSymbol(paymentRequest.amount)} USDC${paymentRequest.message ? ` for ${paymentRequest.message}` : ''}`
      : 'Send me USDC'

    const shareData = {
      title: 'Between Friends Payment Request',
      text: shareText,
      url: paymentUrl
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        // Fallback to clipboard if sharing fails
        await copyToClipboard(`${shareText}\n${paymentUrl}`)
      }
    } else {
      // Fallback to clipboard for desktop
      await copyToClipboard(`${shareText}\n${paymentUrl}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {paymentRequest.amount ? 'Payment Request QR Code' : 'Wallet QR Code'}
        </h2>
        <p className="text-gray-600">
          {paymentRequest.amount 
            ? `Request for ${formatUSDCWithSymbol(paymentRequest.amount)}`
            : 'Scan to send USDC to your wallet'
          }
        </p>
      </div>

      {/* QR Code Card */}
      <div className="card">
        <div className="text-center">
          {isGenerating ? (
            <div className="flex flex-col items-center py-16">
              <div className="w-16 h-16 border-4 border-[#4A4A4A] border-t-[#B8B8B8] rounded-full animate-spin mb-4"></div>
              <p className="text-[#B8B8B8]">Generating QR code...</p>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 rounded-xl border-2 border-gray-100 inline-block mb-4">
                <Image 
                  src={qrCodeUrl} 
                  alt="Payment QR Code"
                  width={256}
                  height={256}
                  className="w-64 h-64 mx-auto"
                />
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                Scan with any wallet app that supports Base Network
              </p>
              
              {paymentRequest.message && (
                <div className="bg-blue-50 rounded-lg p-3 mt-4">
                  <p className="text-blue-800 text-sm font-medium">Message:</p>
                  <p className="text-blue-700 text-sm italic">&quot;{paymentRequest.message}&quot;</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Payment Details */}
      <div className="card bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Network:</span>
            <span className="font-medium text-gray-900">Base</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Token:</span>
            <span className="font-medium text-gray-900">USDC</span>
          </div>
          
          {paymentRequest.amount && (
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold text-gray-900">{formatUSDCWithSymbol(paymentRequest.amount)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-start">
            <span className="text-gray-600 flex-shrink-0">Address:</span>
            <span className="font-mono text-xs text-gray-900 break-all text-right ml-2">
              {paymentRequest.walletAddress}
            </span>
          </div>
        </div>
      </div>

      {/* Share Options */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleCopyUrl}
          className={`flex flex-col items-center p-4 rounded-xl border transition-colors ${
            copied 
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
            copied ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            {copied ? (
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <span className="font-medium text-gray-900 text-sm">
            {copied ? 'Copied!' : 'Copy Link'}
          </span>
          <span className="text-gray-500 text-xs mt-1">Payment URL</span>
        </button>

        <button
          onClick={handleShare}
          className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </div>
          <span className="font-medium text-gray-900 text-sm">Share Request</span>
          <span className="text-gray-500 text-xs mt-1">Via message/email</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {paymentRequest.amount && (
          <button
            onClick={onEditRequest}
            className="w-full py-3 px-6 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit Request Amount
          </button>
        )}
        
        <button
          onClick={onBack}
          className="w-full py-3 px-6 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
        >
          Back to Options
        </button>
      </div>

      {/* Usage Instructions */}
      <div className="card bg-blue-50 border-blue-200">
        <h4 className="font-medium text-blue-900 mb-3">How to Use This QR Code</h4>
        <div className="text-blue-800 text-sm space-y-2">
          <p>• <strong>In-App:</strong> Long press the QR icon in navigation to scan codes</p>
          <p>• <strong>Show & Scan:</strong> Others can scan with their phone camera</p>
          <p>• <strong>Share Link:</strong> Send via text message or email</p>
          <p>• Works with any QR scanner - automatically opens Between Friends</p>
          <p>• Base Network USDC transfers only</p>
        </div>
      </div>
    </div>
  )
}