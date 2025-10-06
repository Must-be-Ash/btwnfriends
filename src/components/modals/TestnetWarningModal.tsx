"use client"

import { X } from 'lucide-react'

interface TestnetWarningModalProps {
  onClose: () => void
}

export function TestnetWarningModal({ onClose }: TestnetWarningModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md backdrop-blur-xl bg-[#2A2A2A]/80 border border-[#4A4A4A] rounded-3xl p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white/70 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-[#CCCCCC]">Heads Up!</h2>

          <div className="space-y-3 text-[#B8B8B8]">
            <p>
              This app runs on <span className="text-white font-medium">Sepolia</span> and uses <span className="text-white font-medium">testnet USDC</span>.
            </p>
            <p>
              It does <span className="text-white font-medium">not handle real funds</span> and is for demonstration purposes only, showcasing CDP's embedded wallets and stablecoin payments.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 px-6 py-3 bg-[#5CB0FF] hover:bg-[#4A9FEE] text-white font-medium rounded-xl transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}
