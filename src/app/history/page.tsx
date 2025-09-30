"use client";

// Force dynamic rendering for this page to avoid SSR issues  
export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useIsSignedIn, useCurrentUser, useGetAccessToken } from '@coinbase/cdp-hooks'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { TransactionList } from '@/components/history/TransactionList'
import { TransactionFilters } from '@/components/history/TransactionFilters'
import { TransactionStats } from '@/components/history/TransactionStats'
import { NavigationDock } from '@/components/navigation/NavigationDock'
import { SendButton3D } from '@/components/ui/send-button-3d'
import { ArrowLeft, RefreshCw } from 'lucide-react'

interface Transaction {
  _id: string
  type: 'sent' | 'received' | 'refund'
  counterpartyEmail: string // The other person in the transaction
  amount: string
  txHash?: string
  transferId?: string
  status: 'confirmed' | 'pending' | 'failed' | 'claimed' | 'unclaimed'
  createdAt: string
  message?: string
}

type FilterType = 'all' | 'sent' | 'received' | 'pending'
type FilterStatus = 'all' | 'confirmed' | 'pending' | 'failed'

export default function HistoryPage() {
  const router = useRouter()
  const { isSignedIn } = useIsSignedIn()
  const { currentUser } = useCurrentUser()
  const { getAccessToken } = useGetAccessToken()
  
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  
  const ITEMS_PER_PAGE = 20

  const fetchTransactions = useCallback(async (reset = false) => {
    if (!currentUser?.userId) return
    
    const loadingState = reset ? setIsLoading : setIsLoadingMore
    loadingState(true)
    setError(null)
    
    try {
      const currentPageForOffset = reset ? 1 : currentPage
      const offset = (currentPageForOffset - 1) * ITEMS_PER_PAGE
      
      const params = new URLSearchParams({
        userId: currentUser.userId,
        limit: ITEMS_PER_PAGE.toString(),
        offset: offset.toString(),
        type: filterType,
        status: filterStatus,
        ...(searchQuery && { search: searchQuery })
      })
      
      const accessToken = await getAccessToken()
      const response = await fetch(`/api/transactions?${params}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }
      
      const data = await response.json()
      
      if (reset) {
        setTransactions(data.transactions)
        setCurrentPage(1)
      } else {
        setTransactions(prev => [...prev, ...data.transactions])
      }
      
      setHasMore(data.hasMore)
      if (!reset) {
        setCurrentPage(prev => prev + 1)
      }
      
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setError('Failed to load transactions')
    } finally {
      loadingState(false)
    }
  }, [currentUser, filterType, filterStatus, searchQuery, currentPage, setIsLoading, setIsLoadingMore, setError, setTransactions, setHasMore, setCurrentPage, getAccessToken])

  useEffect(() => {
    if (currentUser) {
      fetchTransactions(true)
    }
  }, [fetchTransactions, currentUser])

  // Redirect if not signed in
  if (!isSignedIn) {
    router.push('/')
    return <LoadingScreen message="Redirecting..." />
  }

  // Wait for user to load
  if (!currentUser) {
    return <LoadingScreen message="Loading user..." />
  }

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchTransactions(false)
    }
  }

  const handleFilterChange = (type: FilterType, status: FilterStatus, search: string) => {
    setFilterType(type)
    setFilterStatus(status)
    setSearchQuery(search)
    setCurrentPage(1)
  }

  const handleRefresh = () => {
    setCurrentPage(1)
    fetchTransactions(true)
  }

  // Calculate stats from transactions
  const stats = {
    total: transactions.length,
    sent: transactions.filter(t => t.type === 'sent').length,
    received: transactions.filter(t => t.type === 'received').length,
    pending: transactions.filter(t => t.status === 'pending' || t.status === 'unclaimed').length
  }

  return (
    <div className="min-h-screen bg-[#222222]">
      {/* Main Content with glassmorphism container */}
      <div className="px-4 pt-10 pb-6">
        <div className="max-w-md mx-auto md:backdrop-blur-xl md:bg-[#4A4A4A]/30 md:border md:border-white/20 md:rounded-3xl md:p-6 md:shadow-2xl space-y-6">
          
          {/* Back Button */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-5 h-5 text-[#B8B8B8] ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Stats */}
          <div className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Overview</h3>
            <TransactionStats stats={stats} />
          </div>

          {/* Filters */}
          <div className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
            <TransactionFilters
              currentType={filterType}
              currentStatus={filterStatus}
              currentSearch={searchQuery}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Content */}
          <div className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Transactions</h3>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-[#4A4A4A] border-t-[#B8B8B8] rounded-full animate-spin mb-3"></div>
                  <p className="text-white/70">Loading transactions...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Failed to Load</h3>
                <p className="text-white/70 mb-4">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-colors border border-white/30"
                >
                  Try Again
                </button>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
  
                <h3 className="text-lg font-semibold text-white mb-2">No Transactions Found</h3>
                <p className="text-white/70 mb-6">
                  {searchQuery || filterType !== 'all' || filterStatus !== 'all' 
                    ? 'No transactions match your current filters.'
                    : 'You haven\'t made any USDC transfers yet.'
                  }
                </p>
                <div className="space-y-4">
                  <SendButton3D onClick={() => router.push('/send')}>
                    Send Your First Payment
                  </SendButton3D>
                  
                  {(searchQuery || filterType !== 'all' || filterStatus !== 'all') && (
                    <button
                      onClick={() => handleFilterChange('all', 'all', '')}
                      className="w-full px-4 py-2 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/30"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <TransactionList 
                  transactions={transactions}
                />
                
                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center pt-4">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl font-medium text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoadingMore ? (
                        <div className="flex items-center justify-center">
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin text-[#B8B8B8]" />
                          Loading...
                        </div>
                      ) : (
                        'Load More Transactions'
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Dock */}
      <NavigationDock />

      {/* Bottom spacing for mobile navigation */}
      <div className="h-32 md:h-16"></div>
    </div>
  )
}