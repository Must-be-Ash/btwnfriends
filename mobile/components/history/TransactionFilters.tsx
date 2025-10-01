import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Search } from 'lucide-react-native';

type FilterType = 'all' | 'sent' | 'received' | 'pending';
type FilterStatus = 'all' | 'confirmed' | 'pending' | 'failed';

interface TransactionFiltersProps {
  currentType: FilterType;
  currentStatus: FilterStatus;
  currentSearch: string;
  onFilterChange: (type: FilterType, status: FilterStatus, search: string) => void;
}

export function TransactionFilters({ 
  currentType, 
  currentStatus, 
  currentSearch, 
  onFilterChange 
}: TransactionFiltersProps) {
  const [localSearch, setLocalSearch] = useState(currentSearch);

  const handleTypeChange = (type: FilterType) => {
    onFilterChange(type, currentStatus, currentSearch);
  };

  const handleStatusChange = (status: FilterStatus) => {
    onFilterChange(currentType, status, currentSearch);
  };

  const handleSearchSubmit = () => {
    onFilterChange(currentType, currentStatus, localSearch.trim());
  };

  const clearAllFilters = () => {
    setLocalSearch('');
    onFilterChange('all', 'all', '');
  };

  const hasActiveFilters = currentType !== 'all' || currentStatus !== 'all' || currentSearch.length > 0;

  const typeFilters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'sent', label: 'Sent' },
    { key: 'received', label: 'Received' },
    { key: 'pending', label: 'Pending' }
  ];

  return (
    <View className="space-y-3">
      <View className="flex flex-row space-x-2">
        <View className="flex-1 relative">
          <TextInput
            value={localSearch}
            onChangeText={setLocalSearch}
            onSubmitEditing={handleSearchSubmit}
            placeholder="Search transactions..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
          />
          <View className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search size={16} color="rgba(255,255,255,0.4)" />
          </View>
        </View>
        <TouchableOpacity
          onPress={handleSearchSubmit}
          className="px-3 py-2 bg-white/20 rounded-lg border border-white/30"
        >
          <Text className="text-white text-sm font-medium">Search</Text>
        </TouchableOpacity>
      </View>

      <View className="space-y-2">
        <Text className="text-xs font-medium text-white/70">Filter by Type</Text>
        
        <View className="flex flex-row flex-wrap gap-2">
          {typeFilters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => handleTypeChange(filter.key)}
              className={`px-2.5 py-1 rounded-full border ${
                currentType === filter.key
                  ? 'bg-white/30 border-white/40'
                  : 'bg-white/10 border-white/20'
              }`}
            >
              <Text className={`text-xs font-medium ${
                currentType === filter.key
                  ? 'text-white'
                  : 'text-white/70'
              }`}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="space-y-2">
        <Text className="text-xs font-medium text-white/70">Filter by Status</Text>
        
        <View className="flex flex-row flex-wrap gap-2">
          <TouchableOpacity
            onPress={() => handleStatusChange('all')}
            className={`px-2.5 py-1 rounded-full border ${
              currentStatus === 'all'
                ? 'bg-white/30 border-white/40'
                : 'bg-white/10 border-white/20'
            }`}
          >
            <Text className={`text-xs font-medium ${
              currentStatus === 'all' ? 'text-white' : 'text-white/70'
            }`}>
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleStatusChange('confirmed')}
            className={`px-2.5 py-1 rounded-full border ${
              currentStatus === 'confirmed'
                ? 'bg-white/30 border-white/40'
                : 'bg-white/10 border-white/20'
            }`}
          >
            <Text className={`text-xs font-medium ${
              currentStatus === 'confirmed' ? 'text-white' : 'text-white/70'
            }`}>
              Confirmed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleStatusChange('pending')}
            className={`px-2.5 py-1 rounded-full border ${
              currentStatus === 'pending'
                ? 'bg-white/30 border-white/40'
                : 'bg-white/10 border-white/20'
            }`}
          >
            <Text className={`text-xs font-medium ${
              currentStatus === 'pending' ? 'text-white' : 'text-white/70'
            }`}>
              Pending
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleStatusChange('failed')}
            className={`px-2.5 py-1 rounded-full border ${
              currentStatus === 'failed'
                ? 'bg-white/30 border-white/40'
                : 'bg-white/10 border-white/20'
            }`}
          >
            <Text className={`text-xs font-medium ${
              currentStatus === 'failed' ? 'text-white' : 'text-white/70'
            }`}>
              Failed
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {hasActiveFilters && (
        <View className="flex flex-row items-center justify-between pt-2 border-t border-white/20">
          <View className="flex flex-row items-center space-x-2">
            <Text className="text-xs font-medium text-white/70">Active:</Text>
            <View className="flex flex-row flex-wrap gap-1">
              {currentType !== 'all' && (
                <View className="px-2 py-0.5 bg-white/20 rounded-full border border-white/30">
                  <Text className="text-white text-xs">{currentType}</Text>
                </View>
              )}
              {currentStatus !== 'all' && (
                <View className="px-2 py-0.5 bg-white/20 rounded-full border border-white/30">
                  <Text className="text-white text-xs">{currentStatus}</Text>
                </View>
              )}
              {currentSearch && (
                <View className="px-2 py-0.5 bg-white/20 rounded-full border border-white/30">
                  <Text className="text-white text-xs">"{currentSearch}"</Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity onPress={clearAllFilters}>
            <Text className="text-white/70 text-xs font-medium">Clear</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
