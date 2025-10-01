import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import * as Clipboard from 'expo-clipboard';
import { AlertTriangle } from 'lucide-react-native';

interface PendingClaim {
  transferId: string;
  amount: string;
  recipientEmail: string;
  expiryDate: Date;
  createdAt: Date;
  status: 'pending';
}

interface PendingClaimsProps {
  userId: string;
}

function formatUSDCWithSymbol(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return '$0.00 USDC';
  return `$${num.toFixed(2)} USDC`;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function PendingClaims({ userId }: PendingClaimsProps) {
  const [pendingClaims, setPendingClaims] = useState<PendingClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchPendingClaims = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pending-claims?userId=${encodeURIComponent(userId)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch pending claims');
      }

      const data = await response.json();
      setPendingClaims(data.claims || []);
    } catch (error) {
      console.error('Error fetching pending claims:', error);
      setError('Failed to load pending claims');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPendingClaims();
  }, [fetchPendingClaims]);

  const getDaysRemaining = (expiryDate: Date) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getExpiryText = (expiryDate: Date) => {
    const daysRemaining = getDaysRemaining(expiryDate);

    if (daysRemaining === 0) {
      return { text: 'Expires today', color: 'text-red-600' };
    } else if (daysRemaining === 1) {
      return { text: 'Expires tomorrow', color: 'text-orange-600' };
    } else if (daysRemaining <= 3) {
      return { text: `Expires in ${daysRemaining} days`, color: 'text-orange-600' };
    } else {
      return { text: `Expires in ${daysRemaining} days`, color: 'text-white/60' };
    }
  };

  const handleCopyLink = async (transferId: string) => {
    const baseUrl = process.env.EXPO_PUBLIC_APP_URL || 'https://yourapp.com';
    const claimUrl = `${baseUrl}/claim?id=${transferId}`;
    
    await Clipboard.setStringAsync(claimUrl);
    setCopiedId(transferId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
        <Text className="text-lg font-semibold text-white mb-4">Pending Claims</Text>
        <View className="space-y-3">
          {[1, 2].map((i) => (
            <View key={i} className="border border-white/20 rounded-lg p-4">
              <View className="h-4 bg-white/20 rounded w-32 mb-2" />
              <View className="h-3 bg-white/20 rounded w-48 mb-2" />
              <View className="h-3 bg-white/20 rounded w-24" />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
        <Text className="text-lg font-semibold text-white mb-4">Pending Claims</Text>
        <View className="items-center py-6">
          <Text className="text-red-500 mb-3 text-sm">{error}</Text>
          <TouchableOpacity
            onPress={fetchPendingClaims}
            className="bg-primary-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white text-sm">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (pendingClaims.length === 0) {
    return null;
  }

  return (
    <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-white">Pending Claims</Text>
        <View className="flex-row items-center">
          <View className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
          <Text className="text-sm text-white/60">{pendingClaims.length} waiting</Text>
        </View>
      </View>

      <View className="space-y-3">
        {pendingClaims.map((claim) => {
          const expiryInfo = getExpiryText(claim.expiryDate);
          const progressPercent = Math.max(10, (getDaysRemaining(claim.expiryDate) / 7) * 100);
          const progressColor = getDaysRemaining(claim.expiryDate) <= 1 
            ? 'bg-red-500' 
            : getDaysRemaining(claim.expiryDate) <= 3 
            ? 'bg-orange-500' 
            : 'bg-primary-500';

          return (
            <View
              key={claim.transferId}
              className="border border-white/20 rounded-lg p-4"
            >
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1">
                  <Text className="font-medium text-white text-sm mb-1">
                    {formatUSDCWithSymbol(claim.amount)}
                  </Text>
                  <Text className="text-sm text-white/60">
                    to {claim.recipientEmail}
                  </Text>
                </View>
                <View>
                  <Text className={`text-xs font-medium ${expiryInfo.color}`}>
                    {expiryInfo.text}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-xs text-white/40">
                  Sent {formatRelativeTime(new Date(claim.createdAt))}
                </Text>

                <TouchableOpacity
                  onPress={() => handleCopyLink(claim.transferId)}
                  className="active:opacity-70"
                >
                  <Text className="text-primary-400 text-xs font-medium">
                    {copiedId === claim.transferId ? 'Copied!' : 'Copy Link'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Progress bar */}
              <View className="w-full bg-white/20 rounded-full h-1">
                <View
                  className={`h-1 rounded-full ${progressColor}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </View>
            </View>
          );
        })}
      </View>

      <View className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex-row">
        <AlertTriangle size={20} color="#EAB308" />
        <Text className="ml-3 text-sm text-yellow-200 flex-1">
          These transfers will automatically expire and refund after 7 days if not claimed.
        </Text>
      </View>
    </View>
  );
}
