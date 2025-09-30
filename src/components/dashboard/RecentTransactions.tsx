"use client";

import { useState, useEffect, useCallback } from 'react'
import { useGetAccessToken } from '@coinbase/cdp-hooks'
import { formatUSDCWithSymbol, formatRelativeTime } from '@/lib/utils'
import { getBlockExplorerUrl } from '@/lib/cdp'

interface Transaction {
  _id: string
  type: 'sent' | 'received' | 'received_claim'
  amount: string
  txHash?: string
  transferId?: string
  status: 'pending' | 'confirmed' | 'failed'
  createdAt: Date
  recipientEmail?: string
  senderEmail?: string
}

interface RecentTransactionsProps {
  userId: string
}

export function RecentTransactions({ userId }: RecentTransactionsProps) {
  const { getAccessToken } = useGetAccessToken()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const accessToken = await getAccessToken()
      const response = await fetch(`/api/transactions?userId=${encodeURIComponent(userId)}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }
      
      const data = await response.json()
      setTransactions(data.transactions || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setError('Failed to load transactions')
    } finally {
      setIsLoading(false)
    }
  }, [userId, getAccessToken])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'pending') {
      return (
        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-yellow-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
      )
    }

    if (status === 'failed') {
      return (
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
      )
    }

    if (type === 'sent') {
      return (
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
      )
    }

    return (
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m4-4l5 5 5-5m-5-7v12" />
        </svg>
      </div>
    )
  }

  const getTransactionTitle = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'sent':
        return `Sent to ${transaction.recipientEmail || 'Unknown'}`
      case 'received':
        return `Received from ${transaction.senderEmail || 'Unknown'}`
      case 'received_claim':
        return `Claimed from ${transaction.senderEmail || 'Unknown'}`
      default:
        return 'Transaction'
    }
  }

  const getAmountColor = (type: string) => {
    return type === 'sent' ? 'text-red-600' : 'text-green-600'
  }

  const getAmountPrefix = (type: string) => {
    return type === 'sent' ? '-' : '+'
  }

  if (isLoading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTransactions}
            className="btn-primary text-sm px-4 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-600">No transactions yet</p>
          <p className="text-sm text-gray-500">Your transaction history will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <button
          onClick={() => {/* TODO: Navigate to full history */}}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction._id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              {getTransactionIcon(transaction.type, transaction.status)}
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {getTransactionTitle(transaction)}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{formatRelativeTime(new Date(transaction.createdAt))}</span>
                  {transaction.txHash && (
                    <>
                      <span>•</span>
                      <a
                        href={getBlockExplorerUrl(transaction.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-600 underline"
                      >
                        View on explorer
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className={`font-semibold text-sm ${getAmountColor(transaction.type)}`}>
                {getAmountPrefix(transaction.type)}{formatUSDCWithSymbol(transaction.amount)}
              </p>
              <div className="flex items-center justify-end space-x-1">
                {transaction.status === 'pending' && (
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
                {transaction.status === 'confirmed' && (
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                )}
                {transaction.status === 'failed' && (
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                )}
                <span className="text-xs text-gray-500 capitalize">
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}