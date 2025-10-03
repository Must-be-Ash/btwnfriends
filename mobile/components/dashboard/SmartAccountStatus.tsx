import { View, Text } from 'react-native';
import { useCurrentUser } from '@coinbase/cdp-hooks';
import { Wallet, Globe } from 'lucide-react-native';

// Simplified version - mobile app will use the same hook logic as web
export function SmartAccountStatus() {
  const { currentUser } = useCurrentUser();

  // Note: Smart account functionality will be implemented when useSmartAccount hook is ported
  const network = 'Base Sepolia';

  if (!currentUser) {
    return null;
  }

  return (
    <View className="bg-[#2A2A2A] rounded-2xl p-6 border border-[#4A4A4A] shadow-2xl">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-white">Wallet Status</Text>
      </View>

      <View className="gap-4">
        {/* EOA Address */}
        <View className="flex-row items-center justify-between">
          <Text className="text-[#B8B8B8] text-sm">Wallet Address</Text>
          <View className="flex-row items-center space-x-2">
            <Text className="text-white font-mono text-sm">
              {currentUser.evmAccounts?.[0]
                ? `${currentUser.evmAccounts[0].slice(0, 6)}...${currentUser.evmAccounts[0].slice(-4)}`
                : 'Not available'}
            </Text>
            <View className="w-6 h-6 rounded-full bg-[#6B6B6B] items-center justify-center">
              <Wallet size={12} color="#ffffff" />
            </View>
          </View>
        </View>

        {/* Network */}
        <View className="flex-row items-center justify-between">
          <Text className="text-[#B8B8B8] text-sm">Network</Text>
          <View className="flex-row items-center space-x-2">
            <View className="px-2 py-1 rounded bg-[#0052FF]/20">
              <Text className="text-xs font-medium text-[#0052FF]">{network}</Text>
            </View>
            <View className="w-6 h-6 rounded-full bg-[#0052FF] items-center justify-center">
              <Globe size={12} color="#ffffff" />
            </View>
          </View>
        </View>
      </View>

      {/* TODO: Add Smart Account status when useSmartAccount hook is ported */}
      {/* TODO: Add Gas Sponsoring status when useSmartAccount hook is ported */}
    </View>
  );
}
