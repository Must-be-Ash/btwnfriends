"use client";

import { useState } from 'react'
import { useGetAccessToken } from '@coinbase/cdp-hooks'
import { formatRelativeTime } from '@/lib/utils'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Button3D } from '@/components/ui/button-3d'

interface PendingClaim {
  transferId: string
  amount: string
  senderEmail: string
  expiryDate: Date
  createdAt: Date
  claimToken: string
}

interface ClaimOnboardingProps {
  pendingClaims: PendingClaim[]
  userEmail: string
  walletAddress: string
  userId: string
  onComplete: () => void
}

export function ClaimOnboarding({ pendingClaims, userId, onComplete }: ClaimOnboardingProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const { getAccessToken } = useGetAccessToken()
  const totalAmount = pendingClaims.reduce((sum, claim) => 
    sum + parseFloat(claim.amount), 0
  ).toFixed(6)

  const handleClaimAll = async () => {
    setIsProcessing(true)
    setError(null)
    setCurrentStep('Claiming your funds...')

    try {
      const totalClaims = pendingClaims.length

      for (let i = 0; i < totalClaims; i++) {
        const claim = pendingClaims[i]
        
        // Get CDP access token for authentication
        let accessToken
        try {
          accessToken = await getAccessToken()
        } catch (tokenError) {
          console.error('CDP access token not available:', tokenError)
          throw new Error('Authentication failed. Please sign in again to continue claiming your funds.')
        }

        setCurrentStep(`Claiming transfer ${i + 1} of ${totalClaims}...`)

        const response = await fetch('/api/admin/release', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            transferId: claim.transferId,
            userId: userId,
          }),
        })

        if (!response.ok) {
          console.error(`Failed to claim transfer ${claim.transferId}`)
          const errorData = await response.json().catch(() => ({}))
          throw new Error(`Failed to claim transfer: ${errorData.error || 'Unknown error'}`)
        }

        const result = await response.json()
        console.log(`✅ Successfully claimed transfer ${claim.transferId}:`, result.txHash)

        // Wait for transaction confirmation before proceeding to next claim
        // This prevents nonce collisions and gas pricing issues
        if (i < totalClaims - 1) {
          setCurrentStep(`Waiting for confirmation before next claim...`)
          // Wait 3 seconds for blockchain confirmation (Base Sepolia is ~2-3 second block time)
          await new Promise(resolve => setTimeout(resolve, 3000))
        }
      }

      // Show confetti and success
      setShowConfetti(true)
      setCurrentStep('🎉')
      
      setTimeout(() => {
        onComplete()
      }, 3000)

    } catch (error) {
      console.error('Claim error:', error)
      setError(error instanceof Error ? error.message : 'Failed to claim funds')
      setIsProcessing(false)
    }
  }




  // Enhanced confetti effect
  const ConfettiEffect = () => (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => {
        const emoji = ['🎉', '✨', '💰', '🎊', '⭐'][Math.floor(Math.random() * 5)]
        const xPos = Math.random() * 100
        const delay = Math.random() * 2
        const duration = 3 + Math.random() * 2
        
        return (
          <div
            key={i}
            className="absolute text-2xl"
            style={{
              left: `${xPos}%`,
              top: '-50px',
              animation: `confetti-fall ${duration}s ease-out ${delay}s forwards`,
            }}
          >
            {emoji}
          </div>
        )
      })}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes confetti-fall {
            0% {
              transform: translateY(-50px) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
        `
      }} />
    </div>
  )

  return (
    <>
      {showConfetti && <ConfettiEffect />}
      <div className="min-h-screen bg-[#222222] flex items-center justify-center p-4">
        <div className="max-w-sm w-full">
          {/* Unified Glassmorphism Container */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-white">Funds Available</h1>
            </div>

            {/* Receipt Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/30">
              {/* Transaction List */}
              <div className="space-y-4 mb-6">
                {pendingClaims.slice(0, 2).map((claim, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div className="flex flex-col flex-1 mr-4">
                      <div className="text-sm font-medium text-gray-900">
                        {claim.senderEmail}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatRelativeTime(new Date(claim.createdAt))}
                      </div>
                    </div>
                    <div className="font-mono text-sm font-semibold text-black">
                      ${parseFloat(claim.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
                {pendingClaims.length > 2 && (
                  <div className="flex justify-between items-center py-2">
                    <div className="flex flex-col flex-1 mr-4">
                      <div className="text-sm font-medium text-gray-600 italic">
                        +{pendingClaims.length - 2} more
                      </div>
                    </div>
                    <div className="font-mono text-sm font-semibold text-gray-600">
                      ${pendingClaims.slice(2).reduce((sum, claim) => sum + parseFloat(claim.amount), 0).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-300 my-4"></div>

              {/* Total */}
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-900">Total</div>
                <div className="font-mono text-xl font-bold text-black">
                  $<NumberTicker value={parseFloat(totalAmount)} decimalPlaces={2} delay={0.5} className="!text-black" /> USDC
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-300/50 rounded-xl p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-100 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-100 text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Claim Button */}
            <Button3D
              onClick={handleClaimAll}
              disabled={isProcessing}
              className="w-full py-6 px-8 text-lg font-bold rounded-2xl"
              size="lg"
              isLoading={isProcessing}
              style={{
                background: isProcessing 
                  ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                  : 'linear-gradient(135deg, #22c55e, #16a34a)',
                boxShadow: '0 10px 30px rgba(34, 197, 94, 0.4)'
              }}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {currentStep === '🎉' ? '🎉 Claimed!' : currentStep || 'Claiming your funds...'}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Claim ${parseFloat(totalAmount).toFixed(2)}
                </div>
              )}
            </Button3D>
          </div>
        </div>
      </div>
    </>
  )
}