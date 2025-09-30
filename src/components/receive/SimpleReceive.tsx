"use client";

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
import { copyToClipboard, formatUSDCWithSymbol } from '@/lib/utils'
import { SendButton3D } from '@/components/ui/send-button-3d'

interface SimpleReceiveProps {
  address: string
}

export function SimpleReceive({ address }: SimpleReceiveProps) {
  const [copied, setCopied] = useState(false)
  const [amount, setAmount] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateQRCode = useCallback(async () => {
    setIsGenerating(true)
    try {
      let qrData = address
      
      // If amount is specified, create payment URL
      if (amount && parseFloat(amount) > 0) {
        // Only use window.location on client side
        const baseUrl = typeof window !== 'undefined'
          ? window.location.origin
          : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const params = new URLSearchParams()
        params.set('to', address)
        params.set('amount', amount)
        qrData = `${baseUrl}/pay?${params.toString()}`
      }
      
      const qrUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#111827',
          light: '#FFFFFF'
        }
      })
      
      setQrCodeUrl(qrUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [address, amount])

  // Generate QR code for wallet address on mount and when amount changes
  useEffect(() => {
    generateQRCode()
  }, [generateQRCode])

  const handleCopy = async () => {
    const success = await copyToClipboard(address)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleAmountChange = (value: string) => {
    // Only allow numbers and single decimal point
    const regex = /^\d*\.?\d{0,6}$/
    if (value === '' || regex.test(value)) {
      setAmount(value)
    }
  }

  const truncateAddress = (address: string) => {
    if (address.length <= 20) return address
    return `${address.slice(0, 8)}...${address.slice(-8)}`
  }

  const handleShare = async () => {
    let shareText = 'Send me USDC'
    const baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Use /pay route which handles wallet address lookups and redirects properly
    const params = new URLSearchParams()
    params.set('to', address)

    if (amount && parseFloat(amount) > 0) {
      shareText = `Send me ${formatUSDCWithSymbol(amount)} USDC`
      params.set('amount', amount)
    }

    const shareUrl = `${baseUrl}/pay?${params.toString()}`

    const shareData = {
      title: 'Between Friends Payment Request',
      text: shareText,
      url: shareUrl
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        // Fallback to clipboard
        await copyToClipboard(`${shareText}\n${shareUrl}`)
      }
    } else {
      await copyToClipboard(`${shareText}\n${shareUrl}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}


      {/* Amount Input */}
      <div className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl mt-6 md:mt-0">
        <h3 className="text-lg font-semibold text-white mb-4">Request Specific Amount</h3>
        
        <div className="flex items-center space-x-2 bg-white/10 rounded-xl p-4 pr-6 border border-white/20">
          <span className="text-white/70 text-lg flex-shrink-0">$</span>
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0.00"
            className="flex-1 min-w-0 text-lg font-medium bg-transparent border-none outline-none placeholder-white/40 text-white"
          />
          <span className="text-sm text-white/70 flex-shrink-0">USDC</span>
        </div>
        
      </div>

      {/* QR Code & Wallet Address */}
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl text-center">
        {isGenerating ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#4A4A4A] border-t-[#B8B8B8] rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl p-4 inline-block mb-2">
              <Image 
                src={qrCodeUrl} 
                alt="Payment QR Code"
                width={192}
                height={192}
                className="w-48 h-48"
              />
            </div>
            <p className="text-sm text-white/70 mb-4">
              {amount && parseFloat(amount) > 0 
                ? `Scan to send ${formatUSDCWithSymbol(amount)}`
                : 'Scan to send USDC'
              }
            </p>
            
            {/* Wallet Address - clickable to copy */}
            <button
              onClick={handleCopy}
              className="w-full p-3 bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
            >
              <p className="text-sm font-mono text-white/90 mb-1">
                {truncateAddress(address)}
              </p>
              <p className="text-xs text-white/60">
                {copied ? 'Copied!' : 'Tap to copy address'}
              </p>
            </button>
          </>
        )}
      </div>

      {/* Share Button */}
      <SendButton3D onClick={handleShare}>
        Share Payment Request
      </SendButton3D>
    </div>
  )
}