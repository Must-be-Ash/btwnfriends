'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Contact } from '@/types'
import { ContactList } from './ContactList'
import { useContacts } from '@/hooks/useContacts'

interface ContactSearchProps {
  ownerUserId: string
  onContactSelect: (contact: { contactEmail: string; displayName: string }) => void
  placeholder?: string
  className?: string
  allowAddNew?: boolean
}

export function ContactSearch({ 
  ownerUserId,
  onContactSelect, 
  placeholder = 'Search contacts or enter email...',
  className,
  allowAddNew = true
}: ContactSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isValidEmail, setIsValidEmail] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    contacts,
    isLoading,
    searchResults,
    isSearching,
    searchContacts,
    clearSearch,
    createContact,
    toggleFavorite
  } = useContacts(ownerUserId)


  // Email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsValidEmail(emailRegex.test(query))
  }, [query])

  // Handle search
  useEffect(() => {
    if (query.trim()) {
      searchContacts(query)
    } else {
      clearSearch()
    }
  }, [query, searchContacts, clearSearch])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleContactSelect = (contact: Contact) => {
    onContactSelect({
      contactEmail: contact.contactEmail,
      displayName: contact.displayName
    })
    setQuery('')
    setIsOpen(false)
    clearSearch()
  }

  const handleAddNew = async () => {
    if (!isValidEmail) return

    const success = await createContact({
      contactEmail: query.toLowerCase().trim(),
      displayName: query.split('@')[0],
      hasAccount: false,
      source: 'manual'
    })

    if (success) {
      onContactSelect({
        contactEmail: query.toLowerCase().trim(),
        displayName: query.split('@')[0]
      })
      setQuery('')
      setIsOpen(false)
      clearSearch()
    }
  }


  // Sort contacts alphabetically by display name
  const sortedContacts = [...contacts].sort((a, b) => 
    a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase())
  )
  
  const displayContacts = query.trim() ? searchResults : sortedContacts

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:bg-white/20 placeholder-white/40 text-white"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              clearSearch()
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Always show contacts if available or if searching */}
      {(displayContacts.length > 0 || isOpen) && (
        <div className="mt-4">
          {/* Add new contact option when searching */}
          {allowAddNew && query && isValidEmail && (
            <button
              onClick={handleAddNew}
              className="w-full flex items-center gap-3 p-3 mb-2 bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-white">Add &ldquo;{query}&rdquo;</p>
                <p className="text-sm text-white/70">Add as new contact</p>
              </div>
            </button>
          )}

          {/* Loading state */}
          {(isLoading || isSearching) && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-t-[#B8B8B8] border-[#4A4A4A]"></div>
            </div>
          )}

          {/* Contacts list */}
          {!isLoading && !isSearching && displayContacts.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-white/70 mb-3">
                {query ? 'Search Results' : 'Your Contacts'}
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <ContactList
                  contacts={displayContacts}
                  onContactSelect={handleContactSelect}
                  onToggleFavorite={(contact) => toggleFavorite(contact.contactEmail)}
                  showFavoriteAction={false}
                  emptyMessage={query ? 'No contacts found' : 'No contacts yet'}
                />
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isSearching && displayContacts.length === 0 && contacts.length === 0 && !query && (
            <div className="text-center py-8">
              <p className="text-white/70 text-sm">No contacts yet</p>
              <p className="text-white/50 text-xs mt-1">Add contacts to send money quickly</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}