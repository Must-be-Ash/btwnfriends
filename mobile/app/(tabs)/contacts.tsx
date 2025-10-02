import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCurrentUser } from '@coinbase/cdp-hooks';
import { Search, Users, Star } from 'lucide-react-native';
import { ContactList } from '../../components/contacts/ContactList';
import { useContacts, Contact } from '../../hooks/useContacts';
import { LoadingScreen } from '../../components/ui/LoadingScreen';

type ViewMode = 'all' | 'favorites' | 'search';

export default function ContactsScreen() {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const [view, setView] = useState<ViewMode>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    contacts,
    isLoading,
    error,
    searchResults,
    isSearching,
    toggleFavorite,
    searchContacts,
    clearSearch,
    refreshContacts
  } = useContacts(currentUser?.userId || null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!currentUser) {
    return <LoadingScreen message="Loading..." />;
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setView('search');
      await searchContacts(query);
    } else {
      setView('all');
      clearSearch();
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshContacts();
    setIsRefreshing(false);
  };

  const favoriteContacts = contacts.filter(c => c && c.favorite === true);
  const displayContacts = view === 'search' ? searchResults :
                         view === 'favorites' ? favoriteContacts :
                         contacts;

  const handleContactSelect = (contact: Contact) => {
    router.push({
      pathname: '/send',
      params: {
        contactEmail: contact.contactEmail,
        displayName: contact.displayName
      }
    });
  };

  const handleViewChange = (newView: ViewMode) => {
    setView(newView);
    setSearchQuery('');
    clearSearch();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#222222]" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 128 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#B8B8B8"
          />
        }
      >
        <View className="px-4 pt-8 pb-4">
          {/* Search */}
          <View className="bg-[#3B3B3B] rounded-2xl p-4 border border-white/30 shadow-2xl mb-4">
            <Text className="text-lg font-semibold text-white mb-3">Search</Text>
            <View className="relative">
              <TextInput
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder="Search contacts..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
              />
              <View className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search size={20} color="rgba(255,255,255,0.4)" />
              </View>
            </View>
          </View>

          {/* View Filter */}
          <View className="bg-[#2A2A2A] rounded-2xl p-1.5 border border-[#3A3A3A] mb-4">
            <View className="flex flex-row gap-1.5">
              <TouchableOpacity
                onPress={() => handleViewChange('all')}
                activeOpacity={0.7}
                className={`flex-1 flex flex-row items-center justify-center gap-2 px-4 py-3 rounded-xl ${
                  view === 'all'
                    ? 'bg-[#5CB0FF]'
                    : 'bg-transparent'
                }`}
              >
                <Users size={18} color={view === 'all' ? '#ffffff' : '#9CA3AF'} />
                <Text className={`text-sm font-semibold ${
                  view === 'all' ? 'text-white' : 'text-[#9CA3AF]'
                }`}>
                  All ({contacts.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleViewChange('favorites')}
                activeOpacity={0.7}
                className={`flex-1 flex flex-row items-center justify-center gap-2 px-4 py-3 rounded-xl ${
                  view === 'favorites'
                    ? 'bg-[#5CB0FF]'
                    : 'bg-transparent'
                }`}
              >
                <Star
                  size={18}
                  color={view === 'favorites' ? '#ffffff' : '#9CA3AF'}
                  fill={view === 'favorites' ? '#ffffff' : 'none'}
                />
                <Text className={`text-sm font-semibold ${
                  view === 'favorites' ? 'text-white' : 'text-[#9CA3AF]'
                }`}>
                  Favorites ({favoriteContacts.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <View className="bg-[#3B3B3B] rounded-2xl p-4 border border-white/30 shadow-2xl">
            {error && (
              <View className="mb-4 p-4 bg-red-500/20 border border-red-400/30 rounded-xl">
                <Text className="text-sm text-red-300">{error}</Text>
              </View>
            )}

            {isLoading ? (
              <View className="flex items-center justify-center py-12">
                <View className="animate-spin rounded-full h-8 w-8 border-b-2 border-t-[#B8B8B8] border-[#4A4A4A]" />
              </View>
            ) : isSearching ? (
              <View className="flex flex-row items-center justify-center py-12">
                <View className="animate-spin rounded-full h-6 w-6 border-b-2 border-t-[#B8B8B8] border-[#4A4A4A]" />
                <Text className="ml-2 text-white/70">Searching...</Text>
              </View>
            ) : (
              <View>
                <Text className="text-lg font-semibold text-white mb-3">
                  {view === 'search' ? 'Search Results' :
                   view === 'favorites' ? 'Favorite Contacts' :
                   'All Contacts'}
                </Text>
                <ContactList
                  contacts={displayContacts}
                  onContactSelect={handleContactSelect}
                  onToggleFavorite={async (contact) => await toggleFavorite(contact.contactEmail)}
                  showFavoriteAction={true}
                  emptyMessage={
                    view === 'search' ? 'No contacts match your search' :
                    view === 'favorites' ? 'No favorite contacts yet' :
                    'No contacts yet'
                  }
                />
              </View>
            )}
          </View>

          {/* Empty State */}
          {!isLoading && contacts.length === 0 && (
            <View className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 border border-white/30 mt-4">
              <View className="items-center">
                <View className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <Users size={32} color="#ffffff" />
                </View>
                <Text className="text-lg font-semibold text-white mb-2 text-center">
                  No Contacts Yet
                </Text>
                <Text className="text-white/70 text-center">
                  Send money to someone to add them to your contacts.
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
