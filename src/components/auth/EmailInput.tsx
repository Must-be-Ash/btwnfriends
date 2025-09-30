"use client";

import { useState } from 'react'
import { isValidEmail } from '@/lib/utils'

interface EmailInputProps {
  onSubmit: (email: string) => void
  disabled?: boolean
}

export function EmailInput({ onSubmit, disabled }: EmailInputProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    onSubmit(email.toLowerCase().trim())
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#B8B8B8] mb-3">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl bg-[#333333] border ${
            error 
              ? 'border-[#CC6666] focus:border-[#FF8888]' 
              : 'border-[#5A5A5A] focus:border-[#7A7A7A]'
          } text-white placeholder-[#999999] focus:outline-none focus:ring-0 transition-colors`}
          autoComplete="email"
          autoFocus
        />
        {error && (
          <p className="mt-2 text-sm text-[#CC6666]">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={disabled || !email.trim()}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-lg text-white
          relative overflow-hidden
          transform-gpu
          ${disabled || !email.trim()
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer active:translate-y-1 active:shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
          }
        `}
        style={{
          background: disabled || !email.trim()
            ? 'radial-gradient(circle at center, #2a2a2a 0%, #1f1f1f 40%, #151515 70%, #0a0a0a 100%)'
            : 'radial-gradient(circle at center, #5a5a5a 0%, #4a4a4a 25%, #3a3a3a 50%, #2a2a2a 75%, #1a1a1a 90%, #0f0f0f 100%)',
          boxShadow: disabled || !email.trim()
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
          {disabled ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-[#B8B8B8] border-t-transparent rounded-full animate-spin mr-2"></div>
              Sending code...
            </div>
          ) : (
            'Login'
          )}
        </span>
      </button>

      <div className="text-xs text-[#999999] text-center">
        By continuing, you agree to our{' '}
        <a 
          href="/tos" 
          className="font-bold text-[#B8B8B8] hover:text-white transition-colors underline"
        >
          Terms of Service
        </a>
        {' & '}
        <a 
          href="/privacy" 
          className="font-bold text-[#B8B8B8] hover:text-white transition-colors underline"
        >
          Privacy Policy
        </a>
      </div>
    </form>
  )
}