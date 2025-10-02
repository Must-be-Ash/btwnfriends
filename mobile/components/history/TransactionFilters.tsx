import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

type FilterType = 'all' | 'sent' | 'received' | 'pending';
type FilterStatus = 'all' | 'confirmed' | 'pending' | 'failed';

interface TransactionFiltersProps {
  currentType: FilterType;
  currentStatus: FilterStatus;
  currentSearch: string;
  onFilterChange: (type: FilterType, status: FilterStatus, search: string) => void;
}

type FilterOption = {
  type: FilterType;
  status: FilterStatus;
  label: string;
};

export function TransactionFilters({
  currentType,
  currentStatus,
  onFilterChange
}: TransactionFiltersProps) {
  const filters: FilterOption[] = [
    { type: 'all', status: 'all', label: 'All' },
    { type: 'sent', status: 'all', label: 'Sent' },
    { type: 'received', status: 'all', label: 'Received' },
    { type: 'all', status: 'pending', label: 'Pending' },
    { type: 'all', status: 'confirmed', label: 'Confirmed' },
  ];

  const handleFilterPress = (filter: FilterOption) => {
    onFilterChange(filter.type, filter.status, '');
  };

  const isActive = (filter: FilterOption) => {
    return currentType === filter.type && currentStatus === filter.status;
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 16 }}
    >
      {filters.map((filter, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleFilterPress(filter)}
          className={`px-4 py-2 rounded-full mr-2 ${
            isActive(filter)
              ? 'bg-[#5CB0FF]'
              : 'bg-[#333333] border border-[#4A4A4A]'
          }`}
        >
          <Text className={`text-sm font-medium ${
            isActive(filter) ? 'text-white' : 'text-[#B8B8B8]'
          }`}>
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
