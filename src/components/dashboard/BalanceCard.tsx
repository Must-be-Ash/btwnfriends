import { formatUSDCWithSymbol } from '@/lib/utils'

interface BalanceCardProps {
  balance: string
  isLoading: boolean
  onRefresh: () => void
}

export function BalanceCard({ balance, isLoading, onRefresh }: BalanceCardProps) {
  return (
    <div className="relative bg-gradient-to-br from-gray-800/60 via-gray-700/40 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-2xl overflow-hidden">
      {/* Gradient overlay for extra depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 rounded-2xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6 md:mb-6">
          <h2 className="text-lg font-semibold text-white">USDC Balance</h2>
          {/* Desktop refresh button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="hidden md:block p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
            aria-label="Refresh balance"
          >
            <svg 
              className={`w-5 h-5 text-[#B8B8B8] ${isLoading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

      <div className="mb-6">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-12 bg-white/30 rounded-lg w-48"></div>
          </div>
        ) : (
          <p className="text-4xl font-bold text-white mb-1">{formatUSDCWithSymbol(balance)}</p>
        )}
      </div>

        <div className="flex items-center justify-between text-white/70 text-sm">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Secured by CDP</span>
          </div>
          {/* Mobile refresh button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="md:hidden p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
            aria-label="Refresh balance"
          >
            <svg 
              className={`w-3.5 h-3.5 text-[#B8B8B8] ${isLoading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}