"use client";

import { useState } from 'react'
import { useGetAccessToken, useSendUserOperation, useCurrentUser } from '@coinbase/cdp-hooks'
import { formatUSDCWithSymbol } from '@/lib/utils'
import { getCDPNetworkName, prepareUSDCTransferCall, prepareUSDCApprovalCall, prepareEscrowDepositCall } from '@/lib/cdp'
import { keccak256, toBytes } from 'viem'
import { useSmartAccount } from '@/hooks/useSmartAccount'

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
}

interface CDPUser {
  userId: string
  email?: string
  evmSmartAccounts?: string[]
}

interface SendConfirmationProps {
  transferData: TransferData
  currentUser: CDPUser
  onSuccess: (txHash: string) => void
  onBack: () => void
}

export function SendConfirmation({ transferData, currentUser, onSuccess, onBack }: SendConfirmationProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<string>('')
  const [useSmartAccountMode] = useState(true) // Default to smart account
  
  const { recipient, amount } = transferData
  const isDirect = recipient.transferType === 'direct'
  
  // CDP smart account hooks
  const { currentUser: cdpUser } = useCurrentUser()
  const { sendUserOperation } = useSendUserOperation()

  // Smart account utilities
  const smartAccountHook = useSmartAccount()
  const {
    getGasSponsoringStatus,
    getErrorMessage
  } = smartAccountHook

  // Get smart account info
  const smartAccount = cdpUser?.evmSmartAccounts?.[0]
  const hasSmartAccount = !!smartAccount
  const gasSponsoringStatus = getGasSponsoringStatus()
  
  const { getAccessToken } = useGetAccessToken()

  const handleConfirmSend = async () => {
    if (isProcessing || !smartAccount) return

    setIsProcessing(true)
    setError(null)
    setCurrentStep('Preparing transaction...')

    try {
      // Use smart account if available and enabled
      if (useSmartAccountMode && hasSmartAccount) {
        await handleSmartAccountSend()
      } else {
        await handleEOASend()
      }
    } catch (error) {
      console.error('❌ Send failed:', error)
      // Use smart account error handler for better user-friendly messages
      const errorMessage = getErrorMessage(error)
      setError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSmartAccountSend = async () => {
    if (!smartAccount) {
      throw new Error('Smart account not available')
    }

    setCurrentStep('Preparing smart account transaction...')

    if (isDirect) {
      // Direct transfer using smart account
      setCurrentStep('Sending USDC via smart account...')

      // For direct transfers, the recipient should already have a wallet address
      // from the initial lookup that determined this is a direct transfer
      if (!recipient.walletAddress) {
        throw new Error('Recipient wallet address not found in transfer data')
      }

      const recipientAddress = recipient.walletAddress

      // Prepare USDC transfer call using CDP utilities
      const transferCall = prepareUSDCTransferCall(recipientAddress, amount)

      console.log('🔐 Smart Account Direct Transfer:', {
        smartAccount,
        network: getCDPNetworkName(),
        call: transferCall,
        gasSponsored: true
      })

      // Send user operation with CDP paymaster
      const result = await sendUserOperation({
        evmSmartAccount: smartAccount as `0x${string}`,
        network: getCDPNetworkName(),
        calls: [transferCall],
        useCdpPaymaster: true // Enable gas sponsoring
      })

      console.log('✅ Smart Account Direct Transfer Result:', result)

      // Record transaction in history
      await recordTransactionHistory(result.userOperationHash, 'direct')

      onSuccess(result.userOperationHash)
    } else {
      // Escrow deposit using smart account
      setCurrentStep('Creating escrow deposit via smart account...')

      // First, call API to create the pending transfer and get the transferId
      const accessToken = await getAccessToken()
      const approvalResponse = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: currentUser.userId,
          senderAddress: smartAccount,
          recipientEmail: recipient.email,
          amount: amount,
          smartAccountMode: true // Tell API we're using smart account
        }),
      })

      if (!approvalResponse.ok) {
        const errorData = await approvalResponse.json()
        throw new Error(errorData.error || 'Failed to prepare escrow transfer')
      }

      const approvalData = await approvalResponse.json()

      // Use the server-generated transferId from the API response
      const transferId = approvalData.transfer?.transferId
      if (!transferId) {
        throw new Error('No transfer ID received from server')
      }

      // Prepare escrow deposit call with the server's transferId
      const recipientEmailHash = keccak256(toBytes(recipient.email.toLowerCase()))
      const escrowCall = prepareEscrowDepositCall(transferId, amount, recipientEmailHash, 7)
      const calls = []

      // Add approval call if needed
      if (approvalData.requiresApproval) {
        setCurrentStep('Approving USDC for escrow...')
        const approvalCall = prepareUSDCApprovalCall(
          approvalData.escrowAddress || process.env.NEXT_PUBLIC_SIMPLIFIED_ESCROW_ADDRESS,
          amount
        )
        calls.push(approvalCall)
      }

      // Add escrow deposit call
      calls.push(escrowCall)

      console.log('🔐 Smart Account Escrow Deposit:', {
        smartAccount,
        network: getCDPNetworkName(),
        calls,
        gasSponsored: true,
        transferId
      })

      // Send user operation with CDP paymaster (batch: approval + deposit)
      const result = await sendUserOperation({
        evmSmartAccount: smartAccount as `0x${string}`,
        network: getCDPNetworkName(),
        calls,
        useCdpPaymaster: true // Enable gas sponsoring
      })

      console.log('✅ Smart Account Escrow Deposit Result:', result)

      // Update the transfer status in database
      await fetch('/api/send', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          transferId: transferId,
          txHash: result.userOperationHash,
          transferType: 'escrow'
        }),
      })

      // Record transaction in history
      await recordTransactionHistory(result.userOperationHash, 'escrow', transferId)

      onSuccess(result.userOperationHash)
    }
  }

  const handleEOASend = async () => {
    // Legacy EOA flow - no longer supported since we only use smart accounts
    throw new Error('EOA transactions are no longer supported. All transactions use smart accounts now.')
  }

  // Helper function to record transaction history
  const recordTransactionHistory = async (txHash: string, transferType: 'direct' | 'escrow', transferId?: string) => {
    try {
      console.log('📝 RECORDING TRANSACTION IN HISTORY:', {
        txHash: txHash,
        transferType: transferType,
        recipient,
        amount
      })

      const accessToken = await getAccessToken()
      await fetch('/api/send/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: currentUser.userId,
          txHash: txHash,
          transferType: transferType,
          recipient: {
            email: recipient.email,
            displayName: recipient.displayName,
            exists: recipient.exists,
          },
          amount: amount,
          transferId: transferId
        }),
      })

      console.log('✅ TRANSACTION HISTORY RECORDED SUCCESSFULLY')
    } catch (historyError) {
      console.error('Failed to record transaction history:', historyError)
      // Don't fail the entire flow if history recording fails
    }
  }


  return (
    <div className="bg-[#222222] rounded-3xl p-6 space-y-6">
      {/* Final Confirmation Card */}
      <div className=" rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 bg-[#4A4A4A] border border-[#6B6B6B]">
            <svg className="w-8 h-8 text-[#B8B8B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-3">
            Confirm Your Transfer
          </h3>
          
          <p className="text-[#B8B8B8]">
            Ready to send money via email
          </p>
        </div>

                {/* Transfer Details */}
       <div className="bg-[#2A2A2A] rounded-xl py-6 px-6 border border-[#4A4A4A] space-y-5 -mx-8">
         <div className="flex justify-between items-center">
            <span className="text-[#B8B8B8]">Sending</span>
            <span className="text-xl font-bold text-white">
              {formatUSDCWithSymbol(amount)}
            </span>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="text-[#B8B8B8]">To</span>
            <div className="text-right">
              <div className="font-medium text-white">
                {recipient.displayName || recipient.email}
              </div>
              {recipient.displayName && (
                <div className="text-sm text-[#999999] mt-1">{recipient.email}</div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Smart Account Toggle */}
      {/* {hasSmartAccount && (
        <div className="bg-[#2A2A2A] rounded-xl p-4 border border-[#4A4A4A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#5CB0FF]/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#5CB0FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-white">Smart Account</div>
                <div className="text-sm text-[#B8B8B8]">
                  {gasSponsoringStatus.available ? 'Gas-free transactions' : 'Enhanced features'}
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useSmartAccountMode}
                onChange={(e) => setUseSmartAccountMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5CB0FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5CB0FF]"></div>
            </label>
          </div>
        </div>
      )} */}

      {/* Error Display */}
      {error && (
        <div className="bg-[#4A2A2A] rounded-2xl p-6 border border-[#6B3B3B] shadow-2xl">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-[#CC6666] mt-1 mr-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-medium text-[#FFAAAA] mb-2">Transaction Failed</h4>
              <p className="text-[#CCAAAA] text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Smart Account Status */}
      {/* {useSmartAccountMode && hasSmartAccount && (
        <div className={`rounded-xl p-4 border ${
          gasSponsoringStatus.available
            ? 'bg-[#2A4A2A] border-[#4A6B4A]'
            : 'bg-[#4A2A2A] border-[#6B3B3B]'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                gasSponsoringStatus.available ? 'bg-[#4CAF50]' : 'bg-[#F44336]'
              }`}>
                {gasSponsoringStatus.available ? (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <div className={`font-medium ${
                  gasSponsoringStatus.available ? 'text-[#4CAF50]' : 'text-[#F44336]'
                }`}>
                  {gasSponsoringStatus.available ? 'Gas Sponsored' : 'Gas Required'}
                </div>
                <div className="text-sm text-[#B8B8B8]">
                  {gasSponsoringStatus.message}
                </div>
              </div>
            </div>

            {paymasterEnabled && gasSponsoringStatus.available && (
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5CB0FF]"></div>
                <span className="text-xs text-[#5CB0FF] font-medium">CDP</span>
              </div>
            )}
          </div>
        </div>
      )} */}

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-2">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 py-4 px-6 border border-[#5A5A5A] rounded-xl font-medium text-[#CCCCCC] bg-[#333333] hover:bg-[#4A4A4A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        
        <button
          onClick={handleConfirmSend}
          disabled={isProcessing}
          className="flex-1 py-4 px-6 rounded-xl font-semibold text-white transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed bg-[#5A5A5A] hover:bg-[#6B6B6B] border border-[#7A7A7A]"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Processing...
            </div>
          ) : (
            useSmartAccountMode && hasSmartAccount && gasSponsoringStatus.available ? 'Send' : 'Confirm'
          )}
        </button>
      </div>

      {/* Processing status */}
      {isProcessing && (
        <div className="text-center pt-2">
          <p className="text-sm text-[#B8B8B8]">
            {currentStep || 'Setting up escrow and sending email notification...'}
          </p>
        </div>
      )}
    </div>
  )
}