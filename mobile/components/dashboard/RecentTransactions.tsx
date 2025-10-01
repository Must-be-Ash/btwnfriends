import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

interface Transaction {
  _id: string;
  type: 'sent' | 'received' | 'refund';
  counterpartyEmail: string;
  amount: string;
  status: 'confirmed' | 'pending' | 'failed' | 'claimed' | 'unclaimed';
  createdAt: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading: boolean;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 604800)}w ago`;
}

function formatUSDC(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return '$0.00';
  return `$${num.toFixed(2)}`;
}

function getStatusBadge(status: Transaction['status']) {
  const statusConfig = {
    confirmed: { bg: 'bg-[#4A5A4A]', text: 'text-[#B8D8B8]', border: 'border-[#6B8B6B]', label: 'Confirmed' },
    pending: { bg: 'bg-[#5A5A4A]', text: 'text-[#D8D8B8]', border: 'border-[#8B8B6B]', label: 'Pending' },
    failed: { bg: 'bg-[#5A4A4A]', text: 'text-[#CC8888]', border: 'border-[#8B6B6B]', label: 'Failed' },
    claimed: { bg: 'bg-[#4A4A5A]', text: 'text-[#B8B8D8]', border: 'border-[#6B6B8B]', label: 'Claimed' },
    unclaimed: { bg: 'bg-[#5A5A4A]', text: 'text-[#D8D8B8]', border: 'border-[#8B8B6B]', label: 'Awaiting' }
  };

  const config = statusConfig[status];

  return (
    <View className={`px-3 py-1 rounded-full border ${config.bg} ${config.border}`}>
      <Text className={`text-xs font-medium ${config.text}`}>{config.label}</Text>
    </View>
  );
}

export function RecentTransactions({ transactions, isLoading }: RecentTransactionsProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
        <Text className="text-lg font-semibold text-white mb-4">Recent Activity</Text>
        <View className="space-y-3">
          {[1, 2, 3].map((i) => (
            <View key={i} className="border border-white/20 rounded-lg p-4">
              <View className="h-4 bg-white/20 rounded w-32 mb-2" />
              <View className="h-3 bg-white/20 rounded w-48" />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
        <Text className="text-lg font-semibold text-white mb-4">Recent Activity</Text>
        <View className="items-center py-8">
          <Text className="text-white/60 text-sm">No transactions yet</Text>
          <Text className="text-white/40 text-xs mt-1">Send or receive USDC to get started</Text>
        </View>
      </View>
    );
  }

  const recentTransactions = transactions.slice(0, 5);

  return (
    <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-white">Recent Activity</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
          <Text className="text-primary-400 text-sm">View All</Text>
        </TouchableOpacity>
      </View>

      <View className="space-y-3">
        {recentTransactions.map((transaction) => {
          const isSent = transaction.type.startsWith('sent');
          const amountColor = transaction.status === 'failed' 
            ? 'text-[#CC8888]' 
            : isSent 
            ? 'text-[#CC8888]' 
            : 'text-[#88CC88]';

          return (
            <TouchableOpacity
              key={transaction._id}
              className="border border-white/20 rounded-lg p-4 active:bg-white/5"
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-1">
                  <Text className="text-white font-medium text-sm mb-1">
                    {isSent ? 'Sent to' : 'Received from'}
                  </Text>
                  <Text className="text-white/60 text-xs">
                    {transaction.counterpartyEmail}
                  </Text>
                </View>
                <Text className={`text-base font-semibold ${amountColor}`}>
                  {isSent ? '-' : '+'}{formatUSDC(transaction.amount)}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-white/40 text-xs">
                  {formatTimeAgo(new Date(transaction.createdAt))}
                </Text>
                {getStatusBadge(transaction.status)}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
