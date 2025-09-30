"use client";

import { useState, useEffect } from 'react'
import { useGetAccessToken } from '@coinbase/cdp-hooks'
import { parseUSDCAmount } from '@/lib/utils'
import { AmountInput } from './AmountInput'
import { ContactSearch } from '@/components/contacts/ContactSearch'
import { ContactAvatar } from '@/components/ui/ContactAvatar'
import { SendButton3D } from '@/components/ui/send-button-3d'
import { AlertCircle } from 'lucide-react'

interface RecipientInfo {
  email: string
  exists: boolean
  displayName?: string
  walletAddress?: string
  transferType: 'direct' | 'escrow'
}

interface SelectedContact {
  contactEmail: string
  displayName: string
}

interface TransferData {
  recipient: RecipientInfo
  amount: string
}

interface RecipientInputProps {
  onShowConfirmation: (transferData: TransferData) => void
  userBalance: string
  isLoadingBalance: boolean
  ownerUserId: string
  preSelectedContact?: {contactEmail: string; displayName: string} | null
  preFilledAmount?: string
  currentStep: Step
  onStepChange: (step: Step) => void
}

type Step = 'select_contact' | 'enter_amount'

export function RecipientInput({ onShowConfirmation, userBalance, isLoadingBalance, ownerUserId, preSelectedContact, preFilledAmount, currentStep, onStepChange }: RecipientInputProps) {
  const { getAccessToken } = useGetAccessToken()
  const [selectedContact, setSelectedContact] = useState<SelectedContact | null>(null)
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState<RecipientInfo | null>(null)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [lookupError, setLookupError] = useState('')
  const [amountError, setAmountError] = useState('')

  // Handle pre-selected contact
  useEffect(() => {
    if (preSelectedContact) {
      handleContactSelect(preSelectedContact)
    }
  }, [preSelectedContact]) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle pre-filled amount
  useEffect(() => {
    if (preFilledAmount) {
      setAmount(preFilledAmount)
    }
  }, [preFilledAmount])

  // Validate amount as user types
  useEffect(() => {
    if (amount) {
      const numAmount = parseUSDCAmount(amount)
      const numBalance = parseFloat(userBalance)
      
      if (numAmount <= 0) {
        setAmountError('Amount must be greater than $0')
      } else if (numAmount > numBalance) {
        setAmountError('Amount exceeds your balance')
      } else {
        setAmountError('')
      }
    } else {
      setAmountError('')
    }
  }, [amount, userBalance])

  const handleContactSelect = async (contact: SelectedContact) => {
    setSelectedContact(contact)
    setLookupError('')
    setIsLookingUp(true)

    try {
      const accessToken = await getAccessToken()
      const response = await fetch(`/api/recipients/lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ email: contact.contactEmail }),
      })

      if (!response.ok) {
        throw new Error('Failed to lookup recipient')
      }

      const { recipient: recipientInfo } = await response.json()
      setRecipient(recipientInfo)
      onStepChange('enter_amount')
    } catch (error) {
      console.error('Recipient lookup error:', error)
      setLookupError('Failed to lookup recipient. Please try again.')
    } finally {
      setIsLookingUp(false)
    }
  }

  const handleAmountConfirm = () => {
    if (!amount || amountError || !recipient) return
    onShowConfirmation({ recipient, amount })
  }



  const canProceedAmount = amount && !amountError && !isLoadingBalance

  return (
    <div className="space-y-6">

      {/* Step 1: Select Contact */}
      {currentStep === 'select_contact' && (
        <div className="space-y-6">
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Send Money</h1>
            <p className="text-white/70">Choose who to send money to</p>
          </div>

          <div className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Recipient</h3>

            <ContactSearch
              ownerUserId={ownerUserId}
              onContactSelect={handleContactSelect}
              placeholder="Search contacts or enter email address..."
              className="mb-4"
            />

            {lookupError && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-400/30 rounded-xl">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <p className="ml-2 text-sm text-red-300">{lookupError}</p>
                </div>
              </div>
            )}

            {isLookingUp && (
              <div className="mt-4 flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A4A4A] border-t-[#B8B8B8]"></div>
                <span className="ml-3 text-white/70">Looking up recipient...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Enter Amount */}
      {currentStep === 'enter_amount' && selectedContact && recipient && (
        <div className="space-y-6">
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Enter Amount</h1>
            <p className="text-white/70">How much would you like to send?</p>
          </div>

          {/* Selected Recipient */}
          <div className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Sending to</h3>
            
            <div className="flex items-center gap-4">
              <ContactAvatar 
                contact={{
                  displayName: selectedContact.displayName,
                  contactEmail: selectedContact.contactEmail
                }} 
                size="lg"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-white">{selectedContact.displayName}</h4>
                <p className="text-white/70 text-sm">{selectedContact.contactEmail}</p>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
            <AmountInput
              amount={amount}
              onAmountChange={setAmount}
              userBalance={userBalance}
              isLoadingBalance={isLoadingBalance}
              error={amountError}
            />
          </div>

          {/* Continue Button */}
          <SendButton3D
            onClick={handleAmountConfirm}
            disabled={!canProceedAmount}
          >
            Send {amount ? `$${amount}` : 'Amount'}
          </SendButton3D>
        </div>
      )}

    </div>
  )
}