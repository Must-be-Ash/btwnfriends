"use client";

// Force dynamic rendering for this page to avoid SSR issues
export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useIsSignedIn, useEvmAddress, useCurrentUser } from '@coinbase/cdp-hooks'
import { getUSDCBalance } from '@/lib/usdc'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { RecipientInput } from '@/components/send/RecipientInput'
import { SendSuccess } from '@/components/send/SendSuccess'
import { SendConfirmation } from '@/components/send/SendConfirmation'
import { NavigationDock } from '@/components/navigation/NavigationDock'
import { ArrowLeft } from 'lucide-react'

type SendStep = 'input' | 'success'

interface RecipientInfo {
  email: string
  exists: boolean
  displayName?: string
  walletAddress?: string
  transferType: 'direct' | 'escrow'
}

interface TransferData {
  recipient: RecipientInfo
  amount: string
  transactionData?: Record<string, unknown>
}

export default function SendPage() {
  const router = useRouter()
  const { isSignedIn } = useIsSignedIn()
  const { currentUser } = useCurrentUser()
  const { evmAddress } = useEvmAddress()
  
  const [currentStep, setCurrentStep] = useState<SendStep>('input')
  const [balance, setBalance] = useState<string>('0')
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)
  const [transferData, setTransferData] = useState<TransferData | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [preSelectedContact, setPreSelectedContact] = useState<{contactEmail: string; displayName: string} | null>(null)
  const [preFilledAmount, setPreFilledAmount] = useState<string>('')
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [pendingTransferData, setPendingTransferData] = useState<TransferData | null>(null)
  const [recipientInputStep, setRecipientInputStep] = useState<'select_contact' | 'enter_amount'>('select_contact')

  // Check for pre-selected contact and amount from URL params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const contactEmail = searchParams.get('contactEmail')
      const displayName = searchParams.get('displayName')
      const amount = searchParams.get('amount')

      if (contactEmail && displayName) {
        setPreSelectedContact({ contactEmail, displayName })
      }

      if (amount) {
        setPreFilledAmount(amount)
      }
    }
  }, [])

  const fetchBalance = useCallback(async () => {
    if (!evmAddress) return
    
    setIsLoadingBalance(true)
    try {
      const usdcBalance = await getUSDCBalance(evmAddress)
      setBalance(usdcBalance)
    } catch (error) {
      console.error('Error fetching balance:', error)
    } finally {
      setIsLoadingBalance(false)
    }
  }, [evmAddress])

  // Fetch balance on load
  useEffect(() => {
    if (evmAddress) {
      fetchBalance()
    }
  }, [fetchBalance, evmAddress])

  // Redirect if not signed in
  if (!isSignedIn) {
    router.push('/')
    return <LoadingScreen message="Redirecting..." />
  }

  const handleStartOver = () => {
    setTransferData(null)
    setTxHash(null)
    setCurrentStep('input')
    setRecipientInputStep('select_contact')
    fetchBalance() // Refresh balance
  }

  const handleGoToDashboard = () => {
    router.push('/')
  }

  const handleShowConfirmation = (transferData: TransferData) => {
    setPendingTransferData(transferData)
    setShowConfirmationModal(true)
  }

  const handleConfirmationSuccess = (txHash: string) => {
    setShowConfirmationModal(false)
    if (pendingTransferData) {
      setTxHash(txHash)
      setTransferData(pendingTransferData)
      setCurrentStep('success')
      setPendingTransferData(null)
    }
  }

  const handleConfirmationBack = () => {
    setShowConfirmationModal(false)
    setPendingTransferData(null)
  }

  const handleTopBackButton = () => {
    // If user is in amount entry step, go back to contact selection
    if (recipientInputStep === 'enter_amount') {
      setRecipientInputStep('select_contact')
    } else {
      // Otherwise, go back to dashboard
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#222222]">
      {/* Main Content with glassmorphism container */}
      <div className="px-4 pt-10 pb-6">
        <div className="max-w-md mx-auto md:backdrop-blur-xl md:bg-[#4A4A4A]/30 md:border md:border-white/20 md:rounded-3xl md:p-6 md:shadow-2xl space-y-6">
          
          {/* Back Button */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleTopBackButton}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div></div>
          </div>

          {currentStep === 'input' && currentUser?.userId && (
            <RecipientInput
              onShowConfirmation={handleShowConfirmation}
              userBalance={balance}
              isLoadingBalance={isLoadingBalance}
              ownerUserId={currentUser.userId}
              preSelectedContact={preSelectedContact}
              preFilledAmount={preFilledAmount}
              currentStep={recipientInputStep}
              onStepChange={setRecipientInputStep}
            />
          )}

          {currentStep === 'success' && txHash && transferData && (
            <SendSuccess
              transferData={transferData}
              txHash={txHash}
              onSendAnother={handleStartOver}
              onGoToDashboard={handleGoToDashboard}
            />
          )}
        </div>
      </div>

      {/* Navigation Dock */}
      <NavigationDock />

      {/* Bottom spacing for mobile navigation */}
      <div className="h-32 md:h-16"></div>

      {/* Confirmation Modal - Rendered at page level outside glassmorphism container */}
      {showConfirmationModal && pendingTransferData && currentUser?.userId && evmAddress && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-3xl flex items-center justify-center p-4 z-50"
          onClick={handleConfirmationBack}
        >
          <div 
            className="bg-[#222222] rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleConfirmationBack}
              className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <SendConfirmation
              transferData={pendingTransferData}
              currentUser={currentUser}
              onSuccess={handleConfirmationSuccess}
              onBack={handleConfirmationBack}
            />
          </div>
        </div>
      )}
    </div>
  )
}