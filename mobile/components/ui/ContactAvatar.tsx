import { View, Text, Image } from 'react-native';
import { useState } from 'react';
import { cn } from '../../lib/utils';

interface Contact {
  displayName?: string;
  contactEmail?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
}

interface ContactAvatarProps {
  contact?: Partial<Contact> | { displayName: string; contactEmail: string; avatar?: string; firstName?: string; lastName?: string };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: { container: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-12 h-12', text: 'text-sm' },
  lg: { container: 'w-16 h-16', text: 'text-lg' },
  xl: { container: 'w-24 h-24', text: 'text-2xl' }
};

function getInitials(contact?: ContactAvatarProps['contact']): string {
  if (!contact) return '?';
  
  if (contact.firstName || contact.lastName) {
    const first = contact.firstName?.charAt(0)?.toUpperCase() || '';
    const last = contact.lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || first || last || '?';
  }
  
  if (contact.displayName) {
    const words = contact.displayName.trim().split(' ');
    if (words.length >= 2) {
      return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    }
    return words[0]?.charAt(0)?.toUpperCase() || '?';
  }
  
  if (contact.contactEmail) {
    return contact.contactEmail.charAt(0).toUpperCase();
  }
  
  return '?';
}

function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#6B6B6B', '#5A5A5A', '#4A4A4A', '#7A7A7A', '#595959',
    '#696969', '#545454', '#636363', '#575757', '#666666'
  ];
  
  return colors[Math.abs(hash) % colors.length];
}

export function ContactAvatar({ contact, size = 'md', className }: ContactAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(contact);
  const bgColor = getColorFromString(contact?.contactEmail || contact?.displayName || 'default');
  const { container, text } = sizeMap[size];

  const showInitials = !contact?.avatar || imageError;

  return (
    <View 
      className={cn(
        'rounded-full items-center justify-center',
        container,
        className
      )}
      style={{ backgroundColor: bgColor }}
    >
      {showInitials ? (
        <Text className={cn('text-white font-medium', text)}>
          {initials}
        </Text>
      ) : (
        <Image
          source={{ uri: contact.avatar }}
          className="w-full h-full rounded-full"
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      )}
    </View>
  );
}
