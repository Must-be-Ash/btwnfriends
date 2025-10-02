import { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, ScrollView } from 'react-native';
import { Search, X, Plus } from 'lucide-react-native';
import { ContactList } from './ContactList';
import { useContacts, Contact } from '../../hooks/useContacts';

interface ContactSearchProps {
  ownerUserId: string;
  onContactSelect: (contact: { contactEmail: string; displayName: string }) => void;
  placeholder?: string;
  allowAddNew?: boolean;
}

export function ContactSearch({ 
  ownerUserId,
  onContactSelect, 
  placeholder = 'Search contacts or enter email...',
  allowAddNew = true
}: ContactSearchProps) {
  const [query, setQuery] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);

  const {
    contacts,
    isLoading,
    searchResults,
    isSearching,
    searchContacts,
    clearSearch,
    createContact,
  } = useContacts(ownerUserId);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(query));
  }, [query]);

  useEffect(() => {
    if (query.trim()) {
      searchContacts(query);
    } else {
      clearSearch();
    }
  }, [query, searchContacts, clearSearch]);

  const handleContactSelect = (contact: Contact) => {
    onContactSelect({
      contactEmail: contact.contactEmail,
      displayName: contact.displayName
    });
    setQuery('');
    clearSearch();
  };

  const handleAddNew = async () => {
    if (!isValidEmail) return;

    const success = await createContact({
      contactEmail: query.toLowerCase().trim(),
      displayName: query.split('@')[0],
      hasAccount: false,
      source: 'manual'
    });

    if (success) {
      onContactSelect({
        contactEmail: query.toLowerCase().trim(),
        displayName: query.split('@')[0]
      });
      setQuery('');
      clearSearch();
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => 
    a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase())
  );
  
  const displayContacts = query.trim() ? searchResults : sortedContacts;

  return (
    <View>
      <View className="relative mb-4">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.4)"
          className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
          autoCapitalize="none"
          keyboardType="email-address"
          style={{ textAlignVertical: 'center' }}
        />
        <View style={{ position: 'absolute', left: 12, top: '50%', transform: [{ translateY: -10 }] }}>
          <Search size={20} color="#B8B8B8" />
        </View>
        {query && (
          <TouchableOpacity
            onPress={() => {
              setQuery('');
              clearSearch();
            }}
            style={{ position: 'absolute', right: 12, top: '50%', transform: [{ translateY: -10 }] }}
          >
            <X size={20} color="#B8B8B8" />
          </TouchableOpacity>
        )}
      </View>

      {(displayContacts.length > 0 || allowAddNew || isLoading || isSearching) && (
        <View>
          {allowAddNew && query && isValidEmail && (
            <TouchableOpacity
              onPress={handleAddNew}
              className="w-full flex flex-row items-center gap-3 p-3 mb-2 bg-white/10 rounded-xl border border-white/20"
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Plus size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-white">Add "{query}"</Text>
                <Text className="text-sm text-white/70">Add as new contact</Text>
              </View>
            </TouchableOpacity>
          )}

          {(isLoading || isSearching) && (
            <View className="flex items-center justify-center py-8">
              <ActivityIndicator size="small" color="rgba(184,184,184,1)" />
            </View>
          )}

          {!isLoading && !isSearching && displayContacts.length > 0 && (
            <View>
              <Text className="text-sm font-medium text-white/70 mb-3">
                {query ? 'Search Results' : 'Your Contacts'}
              </Text>
              <View>
                <ContactList
                  contacts={displayContacts}
                  onContactSelect={handleContactSelect}
                  showFavoriteAction={false}
                  emptyMessage={query ? 'No contacts found' : 'No contacts yet'}
                />
              </View>
            </View>
          )}

          {!isLoading && !isSearching && displayContacts.length === 0 && contacts.length === 0 && !query && (
            <View className="text-center py-8">
              <Text className="text-white/70 text-sm text-center">No contacts yet</Text>
              <Text className="text-white/50 text-xs mt-1 text-center">Add contacts to send money quickly</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
