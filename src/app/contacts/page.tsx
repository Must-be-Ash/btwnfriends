'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@coinbase/cdp-hooks'
import { ContactList } from '@/components/contacts/ContactList'
import { useContacts } from '@/hooks/useContacts'
import { Contact } from '@/types'
import { useDeviceContacts } from '@/hooks/useDeviceContacts'
import { ArrowLeft, Smartphone, Users, Search, Star } from 'lucide-react'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { NavigationDock } from '@/components/navigation/NavigationDock'

export const dynamic = 'force-dynamic'

export default function ContactsPage() {
  const router = useRouter()
  const { currentUser } = useCurrentUser()
  const [view, setView] = useState<'all' | 'favorites' | 'search'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const {
    contacts,
    isLoading,
    error,
    searchResults,
    isSearching,
    refreshContacts,
    toggleFavorite,
    searchContacts,
    clearSearch
  } = useContacts(currentUser?.userId || null)

  const {
    syncContacts,
    isLoading: isSyncing
  } = useDeviceContacts()

  if (!currentUser) {
    return <LoadingScreen message="Loading..." />
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setView('search')
      await searchContacts(query)
    } else {
      setView('all')
      clearSearch()
    }
  }

  const handleDeviceSync = async () => {
    if (!currentUser?.userId) return
    const result = await syncContacts(currentUser.userId)
    if (result.success) {
      await refreshContacts()
    }
  }

  const favoriteContacts = contacts.filter(c => c.favorite)
  const displayContacts = view === 'search' ? searchResults : 
                         view === 'favorites' ? favoriteContacts : 
                         contacts

  const handleContactSelect = (contact: Contact) => {
    // Navigate to send page with pre-selected contact
    const params = new URLSearchParams()
    params.set('contactEmail', contact.contactEmail)
    params.set('displayName', contact.displayName)
    router.push(`/send?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-[#222222]">
      {/* Main Content with glassmorphism container */}
      <div className="px-4 pt-10 pb-6">
        <div className="max-w-md mx-auto md:backdrop-blur-xl md:bg-[#4A4A4A]/30 md:border md:border-white/20 md:rounded-3xl md:p-6 md:shadow-2xl space-y-6">
          
          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-white mb-2">Contacts</h1>
          </div>

          {/* Search */}
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Search</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search contacts..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:bg-white/20 placeholder-white/40 text-white"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">View</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setView('all')
                  setSearchQuery('')
                  clearSearch()
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  view === 'all' 
                    ? 'bg-white/30 text-white border border-white/40' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Users className="w-4 h-4" />
                All ({contacts.length})
              </button>
              <button
                onClick={() => {
                  setView('favorites')
                  setSearchQuery('')
                  clearSearch()
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  view === 'favorites' 
                    ? 'bg-white/30 text-white border border-white/40' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Star className="w-4 h-4" />
                Favorites ({favoriteContacts.length})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl">
            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-400/30 rounded-xl">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-t-[#B8B8B8] border-[#4A4A4A]"></div>
              </div>
            ) : isSearching ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-t-[#B8B8B8] border-[#4A4A4A]"></div>
                <span className="ml-2 text-white/70">Searching...</span>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  {view === 'search' ? 'Search Results' :
                   view === 'favorites' ? 'Favorite Contacts' :
                   'All Contacts'}
                </h3>
                <ContactList
                  contacts={displayContacts}
                  onContactSelect={handleContactSelect}
                  onToggleFavorite={(contact) => toggleFavorite(contact.contactEmail)}
                  showFavoriteAction={true}
                  emptyMessage={
                    view === 'search' ? 'No contacts match your search' :
                    view === 'favorites' ? 'No favorite contacts yet' :
                    'No contacts yet'
                  }
                />
              </div>
            )}
          </div>

          {/* Add Contact Suggestion */}
          {!isLoading && contacts.length === 0 && (
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-2xl text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Build Your Contact List
              </h3>
              <p className="text-white/70 mb-6">
                Sync device contacts to make sending money easier.
              </p>
              <button
                onClick={handleDeviceSync}
                disabled={isSyncing}
                className="flex items-center gap-2 mx-auto px-6 py-3 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-colors disabled:opacity-50 border border-white/30"
              >
                <Smartphone className="w-5 h-5" />
                {isSyncing ? 'Syncing...' : 'Sync Contacts'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Dock */}
      <NavigationDock />

      {/* Bottom spacing for mobile navigation */}
      <div className="h-32 md:h-16"></div>
    </div>
  )
}