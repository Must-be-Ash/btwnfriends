"use client";

import { useState, useRef, useEffect } from 'react'

interface OTPInputProps {
  email: string
  onSubmit: (otp: string) => void
  onBack: () => void
  disabled?: boolean
}

export function OTPInput({ email, onSubmit, onBack, disabled }: OTPInputProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value !== '' && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (value !== '' && index === 5 && newOtp.every(digit => digit !== '')) {
      const otpCode = newOtp.join('')
      onSubmit(otpCode)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus()
    }
    
    if (e.key === 'Enter') {
      const otpCode = otp.join('')
      if (otpCode.length === 6) {
        onSubmit(otpCode)
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    
    // Extract 6 digits from pasted content
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('')
    
    if (digits.length === 6) {
      setOtp(digits)
      onSubmit(digits.join(''))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join('')
    
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }
    
    onSubmit(otpCode)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#CCCCCC] mb-2">Check your email</h2>
        <p className="text-[#B8B8B8] mb-4">
          We sent a 6-digit code to <span className="font-medium text-white">{email}</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#B8B8B8] mb-3">
          Verification code
        </label>
        <div className="flex space-x-2 justify-center px-4" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={disabled}
              className={`w-11 h-11 text-center text-lg font-semibold rounded-xl bg-[#333333] border ${
                error ? 'border-[#CC6666] focus:border-[#FF8888]' : 'border-[#5A5A5A] focus:border-[#7A7A7A]'
              } text-white focus:outline-none focus:ring-0 transition-colors ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          ))}
        </div>
        {error && (
          <p className="mt-2 text-sm text-[#CC6666] text-center">{error}</p>
        )}
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={disabled || otp.join('').length !== 6}
          className={`
            w-full py-4 px-6 rounded-xl font-semibold text-white
            relative overflow-hidden transform-gpu
            ${disabled || otp.join('').length !== 6
              ? 'opacity-50 cursor-not-allowed' 
              : 'cursor-pointer active:translate-y-1 active:shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
            }
          `}
          style={{
            background: disabled || otp.join('').length !== 6
              ? 'radial-gradient(circle at center, #2a2a2a 0%, #1f1f1f 40%, #151515 70%, #0a0a0a 100%)'
              : 'radial-gradient(circle at center, #5a5a5a 0%, #4a4a4a 25%, #3a3a3a 50%, #2a2a2a 75%, #1a1a1a 90%, #0f0f0f 100%)',
            boxShadow: disabled || otp.join('').length !== 6
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
                Verifying...
              </div>
            ) : (
              'Verify'
            )}
          </span>
        </button>
        
        <button
          type="button"
          onClick={onBack}
          disabled={disabled}
          className="w-full py-4 px-6 border border-[#5A5A5A] rounded-xl font-medium text-[#CCCCCC] bg-[#333333] hover:bg-[#4A4A4A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm text-[#999999]">
          Didn&apos;t receive the code?{' '}
          <button
            type="button"
            onClick={onBack}
            disabled={disabled}
            className="text-[#B8B8B8] hover:text-white font-medium transition-colors"
          >
            Try a different email
          </button>
        </p>
      </div>
    </form>
  )
}