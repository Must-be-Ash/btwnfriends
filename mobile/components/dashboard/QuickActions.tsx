import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useEvmAddress } from '@coinbase/cdp-hooks';
import { Send, Download, History, QrCode, Coins, ChevronRight } from 'lucide-react-native';
import { TopUpModal } from '../modals/TopUpModal';

export function QuickActions() {
  const router = useRouter();
  const evmAddress = useEvmAddress();
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  const actions = [
    {
      id: 'send',
      label: 'Send',
      description: 'Transfer USDC',
      icon: Send,
      onPress: () => router.push('/send')
    },
    {
      id: 'receive',
      label: 'Receive',
      description: 'Get USDC',
      icon: Download,
      onPress: () => router.push('/receive')
    },
    {
      id: 'topup',
      label: 'Top Up',
      description: 'Get testnet USDC',
      icon: Coins,
      onPress: () => setShowTopUpModal(true)
    },
    {
      id: 'scan',
      label: 'Scan QR',
      description: 'Scan to pay',
      icon: QrCode,
      onPress: () => router.push('/scan')
    },
    {
      id: 'history',
      label: 'History',
      description: 'View transactions',
      icon: History,
      onPress: () => router.push('/(tabs)/history')
    }
  ];

  return (
    <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
      <Text className="text-lg font-semibold text-white mb-6">Quick Actions</Text>
      
      <View className="gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <TouchableOpacity
              key={action.id}
              onPress={action.onPress}
              className="w-full flex-row items-center justify-between p-4 bg-white/10 active:bg-white/20 border border-white/20 rounded-xl"
            >
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center">
                  <Icon size={20} color="#ffffff" />
                </View>
                <View>
                  <Text className="text-white font-medium text-sm">{action.label}</Text>
                  <Text className="text-white/60 text-xs">{action.description}</Text>
                </View>
              </View>
              <ChevronRight size={16} color="rgba(255,255,255,0.4)" />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Top Up Modal */}
      {evmAddress?.evmAddress && (
        <TopUpModal
          visible={showTopUpModal}
          walletAddress={evmAddress.evmAddress}
          onClose={() => setShowTopUpModal(false)}
        />
      )}
    </View>
  );
}
