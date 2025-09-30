'use client'

import { Contact } from '@/types'
import { ContactAvatar } from '@/components/ui/ContactAvatar'
import { cn } from '@/lib/utils'
import { Star, StarIcon } from 'lucide-react'

interface ContactListProps {
  contacts: Contact[]
  onContactSelect?: (contact: Contact) => void
  onToggleFavorite?: (contact: Contact) => void
  showFavoriteAction?: boolean
  selectedContactEmail?: string
  className?: string
  emptyMessage?: string
}

export function ContactList({ 
  contacts, 
  onContactSelect,
  onToggleFavorite,
  showFavoriteAction = false,
  selectedContactEmail,
  className,
  emptyMessage = 'No contacts found'
}: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <div className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}>
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-white/70 text-sm">{emptyMessage}</p>
      </div>
    )
  }

  // Group contacts by favorites
  const favoriteContacts = contacts.filter(contact => contact.favorite)
  const regularContacts = contacts.filter(contact => !contact.favorite)

  return (
    <div className={cn('space-y-1', className)}>
      {favoriteContacts.length > 0 && (
        <>
          <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white/50 uppercase tracking-wider">
            <StarIcon className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            Favorites
          </div>
          {favoriteContacts.map((contact) => (
            <ContactItem
              key={contact.contactEmail}
              contact={contact}
              onClick={() => onContactSelect?.(contact)}
              onToggleFavorite={() => onToggleFavorite?.(contact)}
              showFavoriteAction={showFavoriteAction}
              isSelected={contact.contactEmail === selectedContactEmail}
            />
          ))}
          {regularContacts.length > 0 && (
            <div className="flex items-center px-3 py-2 text-xs font-medium text-white/50 uppercase tracking-wider">
              All Contacts
            </div>
          )}
        </>
      )}
      
      {regularContacts.map((contact) => (
        <ContactItem
          key={contact.contactEmail}
          contact={contact}
          onClick={() => onContactSelect?.(contact)}
          onToggleFavorite={() => onToggleFavorite?.(contact)}
          showFavoriteAction={showFavoriteAction}
          isSelected={contact.contactEmail === selectedContactEmail}
        />
      ))}
    </div>
  )
}

interface ContactItemProps {
  contact: Contact
  onClick?: () => void
  onToggleFavorite?: () => void
  showFavoriteAction?: boolean
  isSelected?: boolean
}

function ContactItem({ 
  contact, 
  onClick, 
  onToggleFavorite,
  showFavoriteAction,
  isSelected 
}: ContactItemProps) {

  return (
    <div className={cn(
      'flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors relative group',
      isSelected && 'bg-white/20 border border-white/30'
    )}
    onClick={onClick}
    >
      <ContactAvatar contact={contact} size="md" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-white truncate">
            {contact.displayName}
          </p>
          {contact.hasAccount && (
            <div className="w-2 h-2 bg-green-500 rounded-full" title="Has account" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-white/70 truncate">
            {contact.contactEmail}
          </p>
        </div>
      </div>

      {showFavoriteAction && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite?.()
          }}
          className={cn(
            'p-2 rounded-full hover:bg-white/20 transition-colors opacity-100',
            contact.favorite && 'opacity-100'
          )}
          title={contact.favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star 
            className={cn(
              'w-4 h-4',
              contact.favorite ? 'fill-yellow-400 text-yellow-400' : 'text-white/40'
            )}
          />
        </button>
      )}
    </div>
  )
}