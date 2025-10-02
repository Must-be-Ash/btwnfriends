import { View, Text, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';
import { Contact } from '../../hooks/useContacts';
import { ContactAvatar } from '../ui/ContactAvatar';

interface ContactListProps {
  contacts: Contact[];
  onContactSelect?: (contact: Contact) => void;
  onToggleFavorite?: (contact: Contact) => void;
  showFavoriteAction?: boolean;
  selectedContactEmail?: string;
  emptyMessage?: string;
}

export function ContactList({ 
  contacts, 
  onContactSelect,
  onToggleFavorite,
  showFavoriteAction = false,
  selectedContactEmail,
  emptyMessage = 'No contacts found'
}: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <View className="flex items-center justify-center py-12">
        <View className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
          <Star size={32} color="rgba(255,255,255,0.4)" />
        </View>
        <Text className="text-white/70 text-sm">{emptyMessage}</Text>
      </View>
    );
  }

  const favoriteContacts = contacts.filter(contact => contact.favorite === true);
  const regularContacts = contacts.filter(contact => contact.favorite !== true);

  return (
    <View className="space-y-1">
      {favoriteContacts.length > 0 && (
        <>
          <View className="flex flex-row items-center gap-2 px-3 py-2">
            <Star size={12} color="#facc15" fill="#facc15" />
            <Text className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Favorites
            </Text>
          </View>
          {favoriteContacts.map((contact) => (
            <ContactItem
              key={contact._id || contact.contactEmail}
              contact={contact}
              onClick={() => onContactSelect?.(contact)}
              onToggleFavorite={() => onToggleFavorite?.(contact)}
              showFavoriteAction={showFavoriteAction}
              isSelected={contact.contactEmail === selectedContactEmail}
            />
          ))}
          {regularContacts.length > 0 && (
            <View className="px-3 py-2">
              <Text className="text-xs font-medium text-white/50 uppercase tracking-wider">
                All Contacts
              </Text>
            </View>
          )}
        </>
      )}
      
      {regularContacts.map((contact) => (
        <ContactItem
          key={contact._id || contact.contactEmail}
          contact={contact}
          onClick={() => onContactSelect?.(contact)}
          onToggleFavorite={() => onToggleFavorite?.(contact)}
          showFavoriteAction={showFavoriteAction}
          isSelected={contact.contactEmail === selectedContactEmail}
        />
      ))}
    </View>
  );
}

interface ContactItemProps {
  contact: Contact;
  onClick?: () => void;
  onToggleFavorite?: () => void;
  showFavoriteAction?: boolean;
  isSelected?: boolean;
}

function ContactItem({ 
  contact, 
  onClick, 
  onToggleFavorite,
  showFavoriteAction,
  isSelected 
}: ContactItemProps) {
  return (
    <TouchableOpacity
      onPress={onClick}
      className={`flex flex-row items-center gap-3 px-3 py-3 rounded-lg ${
        isSelected ? 'bg-white/20 border border-white/30' : ''
      }`}
      activeOpacity={0.7}
    >
      <ContactAvatar contact={contact} size="md" />
      
      <View className="flex-1 min-w-0">
        <View className="flex flex-row items-center gap-2">
          <Text className="font-medium text-white" numberOfLines={1}>
            {contact.displayName}
          </Text>
          {contact.hasAccount && (
            <View className="w-2 h-2 bg-green-500 rounded-full" />
          )}
        </View>
        <Text className="text-sm text-white/70" numberOfLines={1}>
          {contact.contactEmail}
        </Text>
      </View>

      {showFavoriteAction && onToggleFavorite && (
        <TouchableOpacity
          onPress={onToggleFavorite}
          className="p-2"
        >
          <Star
            size={20}
            color={contact.favorite ? '#facc15' : 'rgba(255,255,255,0.4)'}
            fill={contact.favorite ? '#facc15' : 'none'}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
