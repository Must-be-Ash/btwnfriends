import { View, Text } from 'react-native';
import { useCurrentUser } from '@coinbase/cdp-hooks';
import { Shield, Wallet, Zap, Globe } from 'lucide-react-native';

// Simplified version - mobile app will use the same hook logic as web
export function SmartAccountStatus() {
  const { currentUser } = useCurrentUser();

  // TODO: Implement useSmartAccount hook for mobile
  const hasSmartAccount: boolean = false;
  const smartAccount: string = '';
  const paymasterEnabled = false;
  const network = 'Base Sepolia';

  if (!currentUser) {
    return null;
  }

  return (
    <View className="bg-[#2A2A2A] rounded-2xl p-6 border border-[#4A4A4A] shadow-2xl">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-white">Wallet Status</Text>
        {hasSmartAccount && (
          <View className="flex-row items-center space-x-2">
            <View className="w-2 h-2 bg-[#4CAF50] rounded-full" />
            <Text className="text-sm text-[#4CAF50] font-medium">Smart Account Active</Text>
          </View>
        )}
      </View>

      <View className="space-y-4">
        {/* EOA Address */}
        <View className="flex-row items-center justify-between">
          <Text className="text-[#B8B8B8] text-sm">Owner Wallet</Text>
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

        {/* Smart Account Address */}
        {hasSmartAccount && (
          <View className="flex-row items-center justify-between">
            <Text className="text-[#B8B8B8] text-sm">Smart Account</Text>
            <View className="flex-row items-center space-x-2">
              <Text className="text-white font-mono text-sm">
                {smartAccount && typeof smartAccount === 'string'
                  ? `${smartAccount.slice(0, 6)}...${smartAccount.slice(-4)}`
                  : 'Not available'}
              </Text>
              <View className="w-6 h-6 rounded-full bg-[#4CAF50] items-center justify-center">
                <Shield size={12} color="#ffffff" />
              </View>
            </View>
          </View>
        )}

        {/* Gas Sponsoring Status */}
        <View className="flex-row items-center justify-between">
          <Text className="text-[#B8B8B8] text-sm">Gas Sponsoring</Text>
          <View className="flex-row items-center space-x-2">
            <View className={`px-2 py-1 rounded ${paymasterEnabled ? 'bg-[#4CAF50]/20' : 'bg-[#6B6B6B]/20'}`}>
              <Text className={`text-xs font-medium ${paymasterEnabled ? 'text-[#4CAF50]' : 'text-[#B8B8B8]'}`}>
                {paymasterEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <View className={`w-6 h-6 rounded-full items-center justify-center ${paymasterEnabled ? 'bg-[#4CAF50]' : 'bg-[#6B6B6B]'}`}>
              <Zap size={12} color="#ffffff" />
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
    </View>
  );
}
