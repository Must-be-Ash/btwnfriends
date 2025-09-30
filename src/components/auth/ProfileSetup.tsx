"use client";

import { useState } from 'react'
import { useEvmAddress } from '@coinbase/cdp-hooks'
import { getDisplayNameFromEmail } from '@/lib/utils'

interface CDPUser {
  userId: string
  email?: string
}

interface ProfileSetupProps {
  user: CDPUser
  email: string
  onComplete: () => void
}

export function ProfileSetup({ user, email, onComplete }: ProfileSetupProps) {
  const [displayName, setDisplayName] = useState(getDisplayNameFromEmail(email))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { evmAddress } = useEvmAddress()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!displayName.trim()) {
      setError('Display name is required')
      return
    }

    if (displayName.trim().length < 2) {
      setError('Display name must be at least 2 characters')
      return
    }

    setIsLoading(true)
    
    try {
      // Create user profile in our database
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
          email: email.toLowerCase(),
          walletAddress: evmAddress,
          displayName: displayName.trim(),
          profileSetupComplete: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create profile')
      }

      onComplete()
    } catch (error) {
      console.error('Profile setup failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to create profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#CCCCCC] mb-2">Welcome to Between Friends!</h2>
        <p className="text-[#B8B8B8] mb-4">
          Your secure wallet has been created. Let&apos;s set up your profile.
        </p>
      </div>

      {/* Wallet Info */}
      <div className="bg-[#2A4A2A] border border-[#4A6A4A] rounded-xl p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-[#4A6A4A] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#B8D8B8]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-[#B8D8B8]">Wallet Created Successfully</h3>
            <p className="text-sm text-[#9AB89A]">
              Address: {evmAddress ? `${evmAddress.slice(0, 6)}...${evmAddress.slice(-4)}` : 'Loading...'}
            </p>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-[#B8B8B8] mb-3">
          Display name
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="How should others see your name?"
          disabled={isLoading}
          className={`w-full px-4 py-3 rounded-xl bg-[#333333] border ${
            error 
              ? 'border-[#CC6666] focus:border-[#FF8888]' 
              : 'border-[#5A5A5A] focus:border-[#7A7A7A]'
          } text-white placeholder-[#999999] focus:outline-none focus:ring-0 transition-colors`}
          maxLength={50}
          autoFocus
        />
        {error && (
          <p className="mt-2 text-sm text-[#CC6666]">{error}</p>
        )}
        <p className="mt-1 text-sm text-[#999999]">
          This is how your name will appear to others when you send money.
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading || !displayName.trim()}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-lg text-white
          relative overflow-hidden transform-gpu
          ${isLoading || !displayName.trim()
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer active:translate-y-1 active:shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
          }
        `}
        style={{
          background: isLoading || !displayName.trim()
            ? 'radial-gradient(circle at center, #2a2a2a 0%, #1f1f1f 40%, #151515 70%, #0a0a0a 100%)'
            : 'radial-gradient(circle at center, #5a5a5a 0%, #4a4a4a 25%, #3a3a3a 50%, #2a2a2a 75%, #1a1a1a 90%, #0f0f0f 100%)',
          boxShadow: isLoading || !displayName.trim()
            ? '0 4px 12px rgba(0,0,0,0.2)' 
            : '0 8px 24px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.3)',
          transition: 'all 0.15s ease-out'
        }}
      >
        {/* Inner highlight for 3D effect */}
        <div 
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.02) 60%, transparent 80%)',
            pointerEvents: 'none'
          }}
        />
        
        {/* Bottom inner shadow for depth */}
        <div 
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'radial-gradient(ellipse at 70% 80%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.08) 35%, transparent 60%)',
            pointerEvents: 'none'
          }}
        />
        
        {/* Content */}
        <span className="relative z-10">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-[#B8B8B8] border-t-transparent rounded-full animate-spin mr-2"></div>
              Setting up your profile...
            </div>
          ) : (
            'Complete Setup'
          )}
        </span>
      </button>

      <div className="text-xs text-[#999999] text-center">
        Your wallet is secured by Coinbase Developer Platform.<br />
        You maintain full custody of your assets.
      </div>
    </form>
  )
}