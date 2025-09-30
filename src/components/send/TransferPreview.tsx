"use client";

import { formatUSDCWithSymbol } from '@/lib/utils'

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

interface TransferPreviewProps {
  transferData: TransferData
  onConfirm: () => void
  onBack: () => void
}

export function TransferPreview({ transferData, onConfirm, onBack }: TransferPreviewProps) {
  const { recipient, amount } = transferData
  const isDirect = recipient.transferType === 'direct'

  return (
    <div className="space-y-6">
      {/* Transfer Summary Card */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer Summary</h3>
        
        <div className="space-y-4">
          {/* Amount */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Amount</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatUSDCWithSymbol(amount)}
            </span>
          </div>

          {/* Recipient */}
          <div className="flex items-start justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Recipient</span>
            <div className="text-right">
              <div className="font-medium text-gray-900">
                {recipient.displayName || recipient.email}
              </div>
              {recipient.displayName && (
                <div className="text-sm text-gray-500">{recipient.email}</div>
              )}
            </div>
          </div>

          {/* Transfer Type */}
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-600">Transfer Type</span>
            <div className="text-right">
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
                isDirect 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isDirect ? (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Instant Transfer
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Email Claim
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Details Card */}
      <div className={`card ${isDirect ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <div className="flex items-start">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isDirect ? 'bg-green-500' : 'bg-yellow-500'
          }`}>
            {isDirect ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            )}
          </div>
          
          <div className="ml-4">
            <h4 className={`font-medium ${isDirect ? 'text-green-800' : 'text-yellow-800'}`}>
              {isDirect ? 'Instant Transfer to Existing User' : 'Email Transfer to New User'}
            </h4>
            
            <div className={`text-sm mt-1 ${isDirect ? 'text-green-700' : 'text-yellow-700'}`}>
              {isDirect ? (
                <div>
                  <p>• Funds will be transferred instantly to {recipient.displayName || recipient.email}&apos;s wallet</p>
                  <p>• Transaction will be confirmed on the blockchain immediately</p>
                  <p>• Recipient will receive the USDC in their account balance</p>
                </div>
              ) : (
                <div>
                  <p>• Funds will be held securely in escrow until claimed</p>
                  <p>• {recipient.email} will receive an email with claim instructions</p>
                  <p>• They&apos;ll create an account and claim the funds within 7 days</p>
                  <p>• If unclaimed, you can refund the transfer after 7 days</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Network & Fees Info */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div className="ml-4">
            <h4 className="font-medium text-blue-800">Network & Fee Information</h4>
            <div className="text-sm text-blue-700 mt-1">
              <p>• Transfer will be processed on Base Network</p>
              <p>• Gas fees are automatically calculated and included</p>
              <p>• Transaction is secured by blockchain technology</p>
              {!isDirect && <p>• Escrow contract ensures safe holding until claimed</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 px-6 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back to Edit
        </button>
        
        <button
          onClick={onConfirm}
          className={`flex-1 py-4 px-6 rounded-xl font-semibold text-white transition-all active:scale-98 ${
            isDirect
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-yellow-600 hover:bg-yellow-700'
          }`}
        >
          {isDirect ? 'Send Instantly' : 'Send via Email'}
        </button>
      </div>

      {/* Final confirmation text */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {isDirect 
            ? `${formatUSDCWithSymbol(amount)} will be sent directly to ${recipient.displayName || recipient.email}`
            : `${formatUSDCWithSymbol(amount)} will be held securely until ${recipient.email} claims it`
          }
        </p>
      </div>
    </div>
  )
}