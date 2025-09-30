"use client";

import { useState, useEffect, useCallback } from 'react'
import { formatUSDCWithSymbol, formatRelativeTime } from '@/lib/utils'

interface PendingClaim {
  transferId: string
  amount: string
  recipientEmail: string
  expiryDate: Date
  createdAt: Date
  status: 'pending'
}

interface PendingClaimsProps {
  userId: string
}

export function PendingClaims({ userId }: PendingClaimsProps) {
  const [pendingClaims, setPendingClaims] = useState<PendingClaim[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPendingClaims = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/pending-claims?userId=${encodeURIComponent(userId)}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch pending claims')
      }
      
      const data = await response.json()
      setPendingClaims(data.claims || [])
    } catch (error) {
      console.error('Error fetching pending claims:', error)
      setError('Failed to load pending claims')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchPendingClaims()
  }, [fetchPendingClaims])

  // Refund functionality moved to admin-only automatic process after 7 days

  const getDaysRemaining = (expiryDate: Date) => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const getExpiryText = (expiryDate: Date) => {
    const daysRemaining = getDaysRemaining(expiryDate)
    
    if (daysRemaining === 0) {
      return { text: 'Expires today', color: 'text-red-600' }
    } else if (daysRemaining === 1) {
      return { text: 'Expires tomorrow', color: 'text-orange-600' }
    } else if (daysRemaining <= 3) {
      return { text: `Expires in ${daysRemaining} days`, color: 'text-orange-600' }
    } else {
      return { text: `Expires in ${daysRemaining} days`, color: 'text-gray-600' }
    }
  }

  if (isLoading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Claims</h3>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Claims</h3>
        <div className="text-center py-6">
          <div className="text-red-500 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-3 text-sm">{error}</p>
          <button
            onClick={fetchPendingClaims}
            className="btn-primary text-sm px-3 py-1"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (pendingClaims.length === 0) {
    return null // Don't show the section if there are no pending claims
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Pending Claims</h3>
        <div className="flex items-center text-sm text-gray-600">
          <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
          <span>{pendingClaims.length} waiting</span>
        </div>
      </div>

      <div className="space-y-3">
        {pendingClaims.map((claim) => {
          const expiryInfo = getExpiryText(claim.expiryDate)
          
          return (
            <div
              key={claim.transferId}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {formatUSDCWithSymbol(claim.amount)}
                  </p>
                  <p className="text-sm text-gray-600">
                    to {claim.recipientEmail}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-medium ${expiryInfo.color}`}>
                    {expiryInfo.text}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Sent {formatRelativeTime(new Date(claim.createdAt))}
                </p>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      // Copy claim link to clipboard
                      const baseUrl = typeof window !== 'undefined' 
                        ? window.location.origin 
                        : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
                      const claimUrl = `${baseUrl}/claim?id=${claim.transferId}`
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText(claimUrl)
                      }
                      // TODO: Show success toast
                    }}
                    className="text-primary-600 hover:text-primary-700 text-xs font-medium"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              {/* Progress bar showing time remaining */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-300 ${
                      getDaysRemaining(claim.expiryDate) <= 1 
                        ? 'bg-red-500' 
                        : getDaysRemaining(claim.expiryDate) <= 3 
                        ? 'bg-orange-500' 
                        : 'bg-primary-500'
                    }`}
                    style={{
                      width: `${Math.max(10, (getDaysRemaining(claim.expiryDate) / 7) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-800">
              These transfers are waiting to be claimed. They will automatically expire and refund after 7 days if not claimed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}