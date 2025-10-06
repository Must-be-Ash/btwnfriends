"use client"

import { useState } from 'react'
import { X, Copy, Check, ExternalLink } from 'lucide-react'

interface TopUpModalProps {
  walletAddress: string
  onClose: () => void
}

export function TopUpModal({ walletAddress, onClose }: TopUpModalProps) {
  const [copied, setCopied] = useState(false)

  const formatAddress = (address: string) => {
    if (address.length <= 13) return address
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md backdrop-blur-xl bg-[#2A2A2A]/80 border border-[#4A4A4A] rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white/70 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-5 sm:space-y-6">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-[#CCCCCC]">Top Up Testnet USDC</h2>
            <p className="text-xs sm:text-sm text-white/70 mt-2">Get free testnet USDC from Circle&apos;s faucet</p>
          </div>

          {/* Wallet Address with Copy */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-white/70">Your Wallet Address</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl min-w-0">
                <p className="text-white font-mono text-xs sm:text-sm">{formatAddress(walletAddress)}</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors"
                aria-label="Copy address"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-white/70" />
                )}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2.5 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-white">How to get testnet USDC:</h3>
            <ol className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-white/80">
              <li className="flex gap-2">
                <span className="text-[#5CB0FF] font-semibold flex-shrink-0">1.</span>
                <span>Copy your wallet address above</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#5CB0FF] font-semibold flex-shrink-0">2.</span>
                <span>Go to the link below</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#5CB0FF] font-semibold flex-shrink-0">3.</span>
                <span>Select <span className="font-medium text-white">Base Sepolia</span> network</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#5CB0FF] font-semibold flex-shrink-0">4.</span>
                <span>Paste your wallet address</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#5CB0FF] font-semibold flex-shrink-0">5.</span>
                <span>Press &quot;Send 10 USDC&quot; button</span>
              </li>
            </ol>
          </div>

          {/* Faucet Link */}
          <a
            href="https://faucet.circle.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-[#5CB0FF] hover:bg-[#4A9FEE] text-white text-sm sm:text-base font-medium rounded-xl transition-colors"
          >
            <span>Go to Circle Faucet</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
