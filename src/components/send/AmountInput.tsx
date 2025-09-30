"use client";

// import { useState } from 'react'
// import { parseUSDCAmount } from '@/lib/utils'

interface AmountInputProps {
  amount: string
  onAmountChange: (amount: string) => void
  userBalance: string
  isLoadingBalance: boolean
  error?: string
}

export function AmountInput({ amount, onAmountChange, userBalance, isLoadingBalance, error }: AmountInputProps) {
  const handleAmountChange = (value: string) => {
    // Allow empty string
    if (value === '') {
      onAmountChange('')
      return
    }

    // Only allow numbers and single decimal point
    const regex = /^\d*\.?\d{0,6}$/
    if (regex.test(value)) {
      onAmountChange(value)
    }
  }

  const handleQuickAmount = (quickAmount: string) => {
    onAmountChange(quickAmount)
  }

  const handleMaxAmount = () => {
    const maxAmount = Math.max(0, parseFloat(userBalance)) // Use full balance
    onAmountChange(maxAmount.toFixed(2))
  }

  const numBalance = parseFloat(userBalance)

  // Quick amount suggestions
  const quickAmounts = ['5', '10', '25', '50']

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Amount to Send</h3>
        
        {/* Main amount input */}
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <div className="flex items-center">
            <input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              className="flex-1 text-3xl font-semibold bg-transparent border-none outline-none placeholder-white/40 text-white"
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}
      </div>

      {/* Balance display */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/70">
          Available balance: {isLoadingBalance ? (
            <span className="inline-flex items-center">
              <div className="w-3 h-3 mr-1 border border-[#4A4A4A] border-t-[#B8B8B8] rounded-full animate-spin"></div>
              Loading...
            </span>
          ) : (
            <span className="font-medium text-white">${userBalance} USDC</span>
          )}
        </span>
        
        {!isLoadingBalance && parseFloat(userBalance) > 0 && (
          <button
            onClick={handleMaxAmount}
            className="text-[#F2F2F2] font-medium"
          >
            Use Max
          </button>
        )}
      </div>

      {/* Quick amount buttons */}
      <div>
        <p className="text-sm text-white/70 mb-2">Quick amounts:</p>
        <div className="grid grid-cols-4 gap-2">
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => handleQuickAmount(quickAmount)}
              disabled={parseFloat(quickAmount) > numBalance}
              className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                parseFloat(quickAmount) > numBalance
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : amount === quickAmount
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              ${quickAmount}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}