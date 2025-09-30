'use client'

import { Contact } from '@/types'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ContactAvatarProps {
  contact?: Partial<Contact> | { displayName: string; contactEmail: string; avatar?: string; firstName?: string; lastName?: string }
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl'
}

function getInitials(contact: ContactAvatarProps['contact']): string {
  if (!contact) return '?'
  
  // Try to get initials from first/last name
  if (contact.firstName || contact.lastName) {
    const first = contact.firstName?.charAt(0)?.toUpperCase() || ''
    const last = contact.lastName?.charAt(0)?.toUpperCase() || ''
    return first + last || first || last || '?'
  }
  
  // Fallback to display name
  if (contact.displayName) {
    const words = contact.displayName.trim().split(' ')
    if (words.length >= 2) {
      return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase()
    }
    return words[0]?.charAt(0)?.toUpperCase() || '?'
  }
  
  // Last resort: use email
  if (contact.contactEmail) {
    return contact.contactEmail.charAt(0).toUpperCase()
  }
  
  return '?'
}

function getColorFromString(str: string): string {
  // Generate consistent color from string
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const colors = [
    'bg-[#6B6B6B]',
    'bg-[#5A5A5A]',
    'bg-[#4A4A4A]',
    'bg-[#7A7A7A]',
    'bg-[#595959]',
    'bg-[#696969]',
    'bg-[#545454]',
    'bg-[#636363]',
    'bg-[#575757]',
    'bg-[#666666]'
  ]
  
  return colors[Math.abs(hash) % colors.length]
}

export function ContactAvatar({ contact, size = 'md', className }: ContactAvatarProps) {
  const initials = getInitials(contact)
  const colorClass = getColorFromString(contact?.contactEmail || contact?.displayName || 'default')

  return (
    <div className={cn(
      'relative flex items-center justify-center rounded-full text-white font-medium shrink-0',
      sizeClasses[size],
      colorClass,
      className
    )}>
      {contact?.avatar ? (
        <Image
          src={contact.avatar}
          alt={contact.displayName || 'Contact'}
          width={100}
          height={100}
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            // Hide image on error and show initials
            e.currentTarget.style.display = 'none'
          }}
        />
      ) : (
        initials
      )}
    </div>
  )
}