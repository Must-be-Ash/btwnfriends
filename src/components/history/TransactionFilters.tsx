"use client";

import { useState } from 'react'

type FilterType = 'all' | 'sent' | 'received' | 'pending'
type FilterStatus = 'all' | 'confirmed' | 'pending' | 'failed'

interface TransactionFiltersProps {
  currentType: FilterType
  currentStatus: FilterStatus
  currentSearch: string
  onFilterChange: (type: FilterType, status: FilterStatus, search: string) => void
}

export function TransactionFilters({ 
  currentType, 
  currentStatus, 
  currentSearch, 
  onFilterChange 
}: TransactionFiltersProps) {
  const [localSearch, setLocalSearch] = useState(currentSearch)

  const handleTypeChange = (type: FilterType) => {
    // Reset status to 'all' when changing type filters to avoid combining filters
    onFilterChange(type, 'all', currentSearch)
  }


  const handleSearchSubmit = () => {
    onFilterChange(currentType, currentStatus, localSearch.trim())
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  const clearAllFilters = () => {
    setLocalSearch('')
    onFilterChange('all', 'all', '')
  }

  const hasActiveFilters = currentType !== 'all' || currentStatus !== 'all' || currentSearch.length > 0

  const typeFilters: { key: FilterType; label: string; count?: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'sent', label: 'Sent' },
    { key: 'received', label: 'Received' },
    { key: 'pending', label: 'Pending' }
  ]
  

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search transactions..."
            className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:bg-white/20 focus:border-white/40 transition-colors placeholder-white/40 text-white text-sm"
          />
          <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <button
          onClick={handleSearchSubmit}
          className="px-3 py-2 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors border border-white/30"
        >
          Search
        </button>
      </div>

      {/* Type Filters */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-white/70">Filter by Type</h3>
        
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => handleTypeChange(filter.key)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                currentType === filter.key && (filter.key !== 'all' || currentStatus === 'all')
                  ? 'bg-white/30 text-white border border-white/40'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
              }`}
            >
              {filter.label}
            </button>
          ))}
          <button
            onClick={() => onFilterChange('all', 'failed', currentSearch)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              currentStatus === 'failed'
                ? 'bg-white/30 text-white border border-white/40'
                : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
            }`}
          >
            Failed
          </button>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t border-white/20">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-white/70">
              Active:
            </span>
            <div className="flex flex-wrap gap-1">
              {currentType !== 'all' && (
                <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full border border-white/30">
                  {currentType}
                </span>
              )}
              {currentStatus !== 'all' && (
                <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full border border-white/30">
                  {currentStatus}
                </span>
              )}
              {currentSearch && (
                <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full border border-white/30">
                  &ldquo;{currentSearch}&rdquo;
                </span>
              )}
            </div>
          </div>
          <button
            onClick={clearAllFilters}
            className="text-white/70 hover:text-white text-xs font-medium"
          >
            Clear
          </button>
        </div>
      )}

    </div>
  )
}