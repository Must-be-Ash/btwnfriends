"use client";

import { useState } from 'react'
import { useSignInWithEmail, useVerifyEmailOTP, useCurrentUser } from '@coinbase/cdp-hooks'
import { EmailInput } from './EmailInput'
import { OTPInput } from './OTPInput'
import { ProfileSetup } from './ProfileSetup'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { TextShimmerBasic } from '@/components/ui/text-shimmer'
import { setStorageItem } from '@/lib/storage'

type AuthStep = 'email' | 'otp' | 'profile'

export function AuthPage() {
  const [step, setStep] = useState<AuthStep>('email')
  const [email, setEmail] = useState('')
  const [flowId, setFlowId] = useState<string | null>(null)
  const [, setIsNewUser] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { signInWithEmail } = useSignInWithEmail()
  const { verifyEmailOTP } = useVerifyEmailOTP()
  const { currentUser } = useCurrentUser()

  const handleEmailSubmit = async (emailValue: string) => {
    setIsLoading(true)
    try {
      const result = await signInWithEmail({ email: emailValue })
      setEmail(emailValue)
      setFlowId(result.flowId)
      setStep('otp')
    } catch (error) {
      console.error('Email sign-in failed:', error)
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSubmit = async (otp: string) => {
    if (!flowId) return
    
    setIsLoading(true)
    try {
      const result = await verifyEmailOTP({
        flowId,
        otp
      })
      
      setIsNewUser(result.isNewUser)
      
      // Store email for later use (needed for profile creation)
      setStorageItem('cdp_user_email', email)
      
      // If new user, show profile setup
      if (result.isNewUser) {
        setStep('profile')
      }
      // If existing user, auth is complete (currentUser will update)
    } catch (error) {
      console.error('OTP verification failed:', error)
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileComplete = () => {
    // Profile setup complete, user will be redirected to dashboard
    // via the main page logic
  }

  // Show loading overlay during async operations
  if (isLoading) {
    return <LoadingScreen message="Authenticating..." />
  }

  return (
    <div className="min-h-screen bg-[#222222] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#CCCCCC] mb-2">Between Friends</h1>
          <p className="text-[#B8B8B8]">
            your&thinsp;
            <span className="italic font-serif text-[#5CB0FF]">Pal</span> shouldn&apos;t be taxing you
          </p>
        </div>

        <div className="backdrop-blur-xl bg-[#2A2A2A]/80 border border-[#4A4A4A] rounded-3xl p-8 shadow-2xl">
          {step === 'email' && (
            <EmailInput
              onSubmit={handleEmailSubmit}
              disabled={isLoading}
            />
          )}
          
          {step === 'otp' && (
            <OTPInput
              email={email}
              onSubmit={handleOTPSubmit}
              onBack={() => setStep('email')}
              disabled={isLoading}
            />
          )}
          
          {step === 'profile' && currentUser && (
            <ProfileSetup
              user={{ userId: currentUser.userId }}
              email={email}
              onComplete={handleProfileComplete}
            />
          )}
        </div>

        <div className="text-center mt-6">
          <a 
            href="https://portal.cdp.coinbase.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block hover:opacity-80 transition-opacity cursor-pointer"
          >
            <TextShimmerBasic 
              className="text-sm font-medium" 
              duration={6}
            >
              Powered by Coinbase Developer Platform
            </TextShimmerBasic>
          </a>
        </div>
      </div>
    </div>
  )
}