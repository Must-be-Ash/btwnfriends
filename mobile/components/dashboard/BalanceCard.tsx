import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RefreshCw, ShieldCheck } from 'lucide-react-native';
import { cn } from '../../lib/utils';

interface BalanceCardProps {
  balance: string;
  isLoading: boolean;
  onRefresh: () => void;
}

function formatUSDCWithSymbol(balance: string): string {
  const num = parseFloat(balance);
  if (isNaN(num)) return '$0.00';
  return `$${num.toFixed(2)}`;
}

export function BalanceCard({ balance, isLoading, onRefresh }: BalanceCardProps) {
  return (
    <View className="relative bg-gray-800/60 rounded-2xl p-6 border border-white/40 shadow-2xl overflow-hidden">
      {/* Gradient overlay for depth */}
      <View className="absolute inset-0 bg-black/20 rounded-2xl" />
      
      <View className="relative z-10">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-lg font-semibold text-white">USDC Balance</Text>
          
          <TouchableOpacity
            onPress={onRefresh}
            disabled={isLoading}
            className={cn(
              'p-2 rounded-lg bg-white/20 active:bg-white/30',
              isLoading && 'opacity-50'
            )}
            accessibilityLabel="Refresh balance"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#B8B8B8" />
            ) : (
              <RefreshCw size={20} color="#B8B8B8" />
            )}
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          {isLoading ? (
            <View className="h-12 bg-white/30 rounded-lg w-48" />
          ) : (
            <Text className="text-4xl font-bold text-white mb-1">
              {formatUSDCWithSymbol(balance)}
            </Text>
          )}
        </View>

        <View className="flex-row items-center">
          <ShieldCheck size={16} color="rgba(255,255,255,0.7)" />
          <Text className="text-white/70 text-sm ml-2">Secured by CDP</Text>
        </View>
      </View>
    </View>
  );
}
