"use client";

import { useState, useEffect } from 'react'
import { formatUSDCWithSymbol, parseUSDCAmount, isValidUSDCAmount } from '@/lib/utils'

interface PaymentRequestFormProps {
  onCreateRequest: (amount: string, message: string) => void
  userAddress: string
}

export function PaymentRequestForm({ onCreateRequest, userAddress }: PaymentRequestFormProps) {
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [amountError, setAmountError] = useState('')

  // Validate amount as user types
  useEffect(() => {
    if (amount) {
      const numAmount = parseUSDCAmount(amount)
      
      if (numAmount <= 0) {
        setAmountError('Amount must be greater than $0')
      } else if (!isValidUSDCAmount(amount)) {
        setAmountError('Invalid amount')
      } else {
        setAmountError('')
      }
    } else {
      setAmountError('')
    }
  }, [amount])

  const handleAmountChange = (value: string) => {
    // Allow empty string
    if (value === '') {
      setAmount('')
      return
    }

    // Only allow numbers and single decimal point
    const regex = /^\d*\.?\d{0,6}$/
    if (regex.test(value)) {
      setAmount(value)
    }
  }

  const handleSubmit = () => {
    if (!amount || amountError) return
    
    onCreateRequest(amount, message.trim())
  }

  const canCreateRequest = amount && !amountError

  // Quick amount suggestions
  const quickAmounts = ['5', '10', '25', '50', '100']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Create Payment Request</h2>
        <p className="text-gray-600">
          Request a specific amount and share via QR code or link
        </p>
      </div>

      {/* Amount Input */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Amount</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (USDC)
            </label>
            
            {/* Main amount input */}
            <div className={`relative border-2 rounded-xl transition-colors ${
              amountError 
                ? 'border-red-500' 
                : 'border-gray-200 hover:border-gray-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100'
            }`}>
              <div className="flex items-center px-4 py-4">
                <span className="text-xl font-medium text-gray-500 mr-2">$</span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 text-2xl font-semibold bg-transparent border-none outline-none placeholder-gray-400"
                />
                <span className="text-lg font-medium text-gray-500 ml-2">USDC</span>
              </div>
            </div>

            {/* Error message */}
            {amountError && (
              <p className="text-red-600 text-sm mt-2">{amountError}</p>
            )}

            {/* Amount preview */}
            {amount && !amountError && (
              <p className="text-green-600 text-sm mt-2">
                ✓ Requesting: {formatUSDCWithSymbol(amount)}
              </p>
            )}
          </div>

          {/* Quick amount buttons */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Quick amounts:</p>
            <div className="grid grid-cols-5 gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount)}
                  className={`py-2 px-2 rounded-lg font-medium transition-colors text-sm ${
                    amount === quickAmount
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ${quickAmount}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Optional Message</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What is this payment for?
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g., Lunch money, Share of the bill, Concert tickets..."
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-colors resize-none"
            rows={3}
            maxLength={200}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              Help the sender understand what this payment is for
            </p>
            <span className="text-xs text-gray-400">
              {message.length}/200
            </span>
          </div>
        </div>
      </div>

      {/* Preview Card */}
      {canCreateRequest && (
        <div className="card bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3">Payment Request Preview</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex justify-between">
              <span>Requesting:</span>
              <span className="font-semibold">{formatUSDCWithSymbol(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>To address:</span>
              <span className="font-mono text-xs">{userAddress.slice(0, 10)}...{userAddress.slice(-8)}</span>
            </div>
            {message && (
              <div>
                <span className="block font-medium">Message:</span>
                <span className="text-blue-700 italic">&ldquo;{message}&rdquo;</span>
              </div>
            )}
            <div className="pt-2 border-t border-blue-200">
              <p className="text-blue-700">
                This will generate a QR code and shareable link that others can use to send you exactly {formatUSDCWithSymbol(amount)}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create Request Button */}
      <div className="space-y-3">
        <button
          onClick={handleSubmit}
          disabled={!canCreateRequest}
          className={`w-full py-4 px-6 rounded-xl font-semibold transition-all ${
            canCreateRequest
              ? 'bg-primary-600 text-white hover:bg-primary-700 active:scale-98'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {amount ? `Create ${formatUSDCWithSymbol(amount)} Request` : 'Enter Amount to Continue'}
        </button>
        
        <p className="text-center text-sm text-gray-600">
          Your request will be shown as a QR code and shareable link
        </p>
      </div>

      {/* Usage Tips */}
      <div className="card bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-3">💡 Payment Request Tips</h4>
        <div className="text-sm text-gray-700 space-y-2">
          <p>• Specific amounts make it easier for people to pay you</p>
          <p>• Add a message to explain what the payment is for</p>
          <p>• QR codes work great for in-person payments</p>
          <p>• Links can be shared via text, email, or social media</p>
        </div>
      </div>
    </div>
  )
}