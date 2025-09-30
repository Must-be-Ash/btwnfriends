"use client";

import { useState } from 'react'
import { formatUSDCWithSymbol, formatTimeAgo, getBlockExplorerUrl, copyToClipboard } from '@/lib/utils'

interface Transaction {
  _id: string
  type: 'sent_direct' | 'sent_escrow' | 'received_direct' | 'received_claim'
  recipientEmail?: string
  senderEmail?: string
  amount: string
  txHash?: string
  transferId?: string
  status: 'confirmed' | 'pending' | 'failed' | 'claimed' | 'unclaimed'
  createdAt: string
  message?: string
}

interface TransactionDetailProps {
  transaction: Transaction
  currentUserId: string
  isOpen: boolean
  onClose: () => void
}

export function TransactionDetail({ transaction, isOpen, onClose }: TransactionDetailProps) {
  const [copied, setCopied] = useState<string | null>(null)
  // Refund functionality moved to admin-only automatic process

  if (!isOpen) return null

  const isSent = transaction.type.startsWith('sent')
  const isEscrow = transaction.type.includes('escrow')

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  // Refund functionality removed - now handled automatically by admin after 7 days

  // Automatic refunds handled by admin after 7 days - no user action needed

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl sm:rounded-t-2xl">
          <h2 className="text-lg font-semibold text-gray-900">Transaction Details</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Amount & Status */}
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${
              transaction.status === 'failed' 
                ? 'text-gray-500' 
                : isSent 
                  ? 'text-red-600' 
                  : 'text-green-600'
            }`}>
              {transaction.status === 'failed' ? '' : isSent ? '-' : '+'}
              {formatUSDCWithSymbol(transaction.amount)}
            </div>
            
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              transaction.status === 'confirmed' ? 'bg-green-100 text-green-800' :
              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
              transaction.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              {transaction.status === 'confirmed' && '✓ Confirmed'}
              {transaction.status === 'pending' && '🕐 Pending'}
              {transaction.status === 'failed' && '✗ Failed'}
              {transaction.status === 'claimed' && '✓ Claimed'}
              {transaction.status === 'unclaimed' && '📧 Awaiting Claim'}
            </div>
          </div>

          {/* Transaction Type */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Transaction Type</h3>
            <p className="text-gray-700">
              {isSent ? (
                isEscrow ? 'Sent via Email (Escrow)' : 'Sent Instantly (Direct)'
              ) : (
                transaction.type === 'received_claim' ? 'Received via Email Claim' : 'Received Directly'
              )}
            </p>
            {isEscrow && (
              <p className="text-sm text-gray-600 mt-1">
                {isSent ? 'Funds held in escrow until claimed' : 'Funds were held in escrow until you claimed them'}
              </p>
            )}
          </div>

          {/* Participants */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-gray-900">Participants</h3>
            
            {isSent && transaction.recipientEmail && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">To:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm">{transaction.recipientEmail}</span>
                  <button
                    onClick={() => handleCopy(transaction.recipientEmail!, 'recipient')}
                    className="text-blue-600 hover:text-blue-700 text-xs"
                  >
                    {copied === 'recipient' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            
            {!isSent && transaction.senderEmail && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">From:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm">{transaction.senderEmail}</span>
                  <button
                    onClick={() => handleCopy(transaction.senderEmail!, 'sender')}
                    className="text-blue-600 hover:text-blue-700 text-xs"
                  >
                    {copied === 'sender' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Message */}
          {transaction.message && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Message</h3>
              <p className="text-blue-800 italic">&ldquo;{transaction.message}&rdquo;</p>
            </div>
          )}

          {/* Technical Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-gray-900">Technical Details</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="text-gray-900">
                  {new Date(transaction.createdAt).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Time ago:</span>
                <span className="text-gray-900">
                  {formatTimeAgo(new Date(transaction.createdAt))}
                </span>
              </div>
              
              {transaction.transferId && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transfer ID:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-gray-900">
                      {transaction.transferId.slice(0, 8)}...{transaction.transferId.slice(-8)}
                    </span>
                    <button
                      onClick={() => handleCopy(transaction.transferId!, 'transferId')}
                      className="text-blue-600 hover:text-blue-700 text-xs"
                    >
                      {copied === 'transferId' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
              
              {transaction.txHash && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">TX Hash:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-gray-900">
                      {transaction.txHash.slice(0, 8)}...{transaction.txHash.slice(-8)}
                    </span>
                    <button
                      onClick={() => handleCopy(transaction.txHash!, 'txHash')}
                      className="text-blue-600 hover:text-blue-700 text-xs"
                    >
                      {copied === 'txHash' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {transaction.txHash && (
              <a
                href={getBlockExplorerUrl(transaction.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on Block Explorer
              </a>
            )}

            {isEscrow && transaction.status === 'unclaimed' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> This transfer will automatically refund after 7 days if not claimed
                  ({new Date(new Date(transaction.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}).
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}