"use client";

import { formatUSDCWithSymbol, getBlockExplorerUrl } from '@/lib/utils'
import { SendButton3D } from '@/components/ui/send-button-3d'

interface RecipientInfo {
  email: string
  exists: boolean
  displayName?: string
  transferType: 'direct' | 'escrow'
}

interface TransferData {
  recipient: RecipientInfo
  amount: string
}

interface SendSuccessProps {
  transferData: TransferData
  txHash: string
  onSendAnother: () => void
  onGoToDashboard: () => void
}

export function SendSuccess({ transferData, txHash, onSendAnother }: SendSuccessProps) {
  const { recipient, amount } = transferData
  const isDirect = recipient.transferType === 'direct'

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 bg-[#4A4A4A] border border-[#6B6B6B]">
          {isDirect ? (
            <svg className="w-8 h-8 text-[#B8B8B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-[#B8B8B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">
          {isDirect ? 'Transfer Complete!' : 'Sent!'}
        </h1>
{/*         
        <p className="text-[#B8B8B8]">
          {formatUSDCWithSymbol(amount)} {isDirect ? 'sent to' : 'reserved for'} {recipient.displayName || recipient.email}
        </p> */}
      </div>

      {/* Transfer Summary */}
      <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-[#4A4A4A] backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Transfer Details</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[#B8B8B8]">Amount</span>
            <span className="font-semibold text-white">
              {formatUSDCWithSymbol(amount)}
            </span>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="text-[#B8B8B8]">Recipient</span>
            <div className="text-right">
              <div className="font-medium text-white">
                {recipient.displayName || recipient.email}
              </div>
              {recipient.displayName && (
                <div className="text-sm text-[#999999]">{recipient.email}</div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-[#B8B8B8]">Status</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isDirect 
                ? 'bg-[#4A5A4A] text-[#B8D8B8] border border-[#6B8B6B]' 
                : 'bg-[#5A5A4A] text-[#D8D8B8] border border-[#8B8B6B]'
            }`}>
              {isDirect ? (
                <>
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Completed
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Pending Claim
                </>
              )}
            </span>
          </div>
          
          {txHash && (
            <div className="flex justify-between items-center">
              <span className="text-[#B8B8B8]">Transaction Hash</span>
              <a
                href={getBlockExplorerUrl(txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#B8B8B8] hover:text-white font-medium text-sm transition-colors"
              >
                <span>View</span>
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>



      {/* Action Buttons */}
      <div className="space-y-4 pt-6">
        {/* Primary CTA - Share Receipt */}
        <SendButton3D
          onClick={() => {
            const text = `I just sent you ${formatUSDCWithSymbol(amount)} USDC${isDirect ? '' : '. Check your email to claim it!'}`
            if (typeof navigator !== 'undefined') {
              if (navigator.share) {
                navigator.share({ text })
              } else if (navigator.clipboard) {
                navigator.clipboard.writeText(text)
              }
            }
          }}
        >
          Share Receipt
        </SendButton3D>
        
        {/* Secondary CTA - Send Another Payment */}
        <button
          onClick={onSendAnother}
          className="w-full py-4 px-6 border border-[#5A5A5A] rounded-xl font-medium text-[#CCCCCC] bg-[#333333] hover:bg-[#4A4A4A] transition-colors"
        >
          Send Another Payment
        </button>
      </div>
    </div>
  )
}