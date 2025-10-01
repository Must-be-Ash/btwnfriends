import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState } from 'react';
import { useEvmAddress } from '@coinbase/cdp-hooks';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const evmAddress = useEvmAddress();

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Refresh balance and transactions
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="bg-primary-500 px-6 pt-16 pb-8">
        <Text className="text-white text-2xl font-bold mb-2">Between Friends</Text>
        <Text className="text-primary-100 text-sm">Send USDC with just an email</Text>
      </View>

      <View className="px-6 -mt-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-gray-600 text-sm mb-2">Your Balance</Text>
          <Text className="text-4xl font-bold text-gray-900 mb-4">$0.00</Text>
          <Text className="text-xs text-gray-500 font-mono">
            {evmAddress ? `${evmAddress.slice(0, 6)}...${evmAddress.slice(-4)}` : 'Loading...'}
          </Text>
        </View>

        <View className="mt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 items-center shadow-sm">
              <Text className="text-primary-500 font-semibold">Send</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 items-center shadow-sm">
              <Text className="text-primary-500 font-semibold">Receive</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</Text>
          <View className="bg-white rounded-xl p-6 items-center">
            <Text className="text-gray-500">No transactions yet</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
