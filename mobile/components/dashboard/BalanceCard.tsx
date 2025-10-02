import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RefreshCw, ShieldCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    <View style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 }}>
      <LinearGradient
        colors={['rgba(31, 41, 55, 0.6)', 'rgba(55, 65, 81, 0.4)', 'rgba(17, 24, 39, 0.6)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 24 }}
      >
        <View className="px-8 pt-8 pb-8">
          <View className="flex-row items-center justify-between mb-10">
            <Text className="text-sm font-medium text-white/60 tracking-wide uppercase">USDC Balance</Text>

            <TouchableOpacity
              onPress={onRefresh}
              disabled={isLoading}
              className={cn(
                'w-11 h-11 items-center justify-center rounded-full bg-white/10 active:bg-white/20 border border-white/10',
                isLoading && 'opacity-50'
              )}
              accessibilityLabel="Refresh balance"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <RefreshCw size={20} color="#FFFFFF" strokeWidth={2} />
              )}
            </TouchableOpacity>
          </View>

          <View className="mb-8">
            {isLoading ? (
              <View className="h-14 bg-white/20 rounded-xl w-52" />
            ) : (
              <Text className="text-5xl font-bold text-white tracking-tight" style={{ letterSpacing: -1 }}>
                {formatUSDCWithSymbol(balance)}
              </Text>
            )}
          </View>

          <View className="flex-row items-center">
            <ShieldCheck size={16} color="rgba(255,255,255,0.6)" />
            <Text className="text-white/60 text-sm ml-2">Secured by Coinbase</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
