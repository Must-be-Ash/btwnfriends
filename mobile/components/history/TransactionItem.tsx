import { View, Text, TouchableOpacity , Linking } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { formatUSDCWithSymbol } from '../../lib/utils';
import { getBlockExplorerUrl } from '../../lib/cdp';

interface Transaction {
  _id: string;
  type: 'sent' | 'received' | 'refund';
  counterpartyEmail: string;
  amount: string;
  txHash?: string;
  transferId?: string;
  status: 'confirmed' | 'pending' | 'failed' | 'claimed' | 'unclaimed';
  createdAt: string;
  message?: string;
}

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const [copiedTx, setCopiedTx] = useState(false);

  const getStatusBadge = (status: Transaction['status']) => {
    const statusConfig = {
      confirmed: { bg: 'bg-[#4A5A4A]', text: 'text-[#B8D8B8]', border: 'border-[#6B8B6B]', label: 'Confirmed' },
      pending: { bg: 'bg-[#5A5A4A]', text: 'text-[#D8D8B8]', border: 'border-[#8B8B6B]', label: 'Pending' },
      failed: { bg: 'bg-[#5A4A4A]', text: 'text-[#CC8888]', border: 'border-[#8B6B6B]', label: 'Failed' },
      claimed: { bg: 'bg-[#4A4A5A]', text: 'text-[#B8B8D8]', border: 'border-[#6B6B8B]', label: 'Claimed' },
      unclaimed: { bg: 'bg-[#5A5A4A]', text: 'text-[#D8D8B8]', border: 'border-[#8B8B6B]', label: 'Awaiting Claim' }
    };
    
    const config = statusConfig[status];
    
    return (
      <View className={`px-3 py-1 rounded-full border ${config.bg} ${config.border}`}>
        <Text className={`text-xs font-medium ${config.text}`}>
          {config.label}
        </Text>
      </View>
    );
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleCopyTxHash = async () => {
    if (!transaction.txHash) return;
    
    try {
      await Clipboard.setStringAsync(transaction.txHash);
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleViewExplorer = async () => {
    if (!transaction.txHash) return;
    
    try {
      const url = getBlockExplorerUrl(transaction.txHash);
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  const isSent = transaction.type === 'sent';
  const amountColor = transaction.status === 'failed' 
    ? 'text-[#999999]' 
    : isSent 
      ? 'text-[#CC8888]' 
      : 'text-[#B8D8B8]';
  
  const rawAmount = transaction.amount;
  const hasSign = rawAmount.startsWith('+') || rawAmount.startsWith('-');
  const amountPrefix = transaction.status === 'failed' 
    ? '' 
    : hasSign 
      ? rawAmount.charAt(0)
      : isSent 
        ? '-' 
        : '+';
  const numericAmount = hasSign ? rawAmount.substring(1) : rawAmount;
  const displayAmount = formatUSDCWithSymbol(numericAmount);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-[#2A2A2A] rounded-2xl border border-[#4A4A4A] p-4"
      activeOpacity={0.7}
    >
      <View className="flex flex-row items-center justify-between">
        <Text className="text-sm text-[#B8B8B8] truncate flex-1" numberOfLines={1}>
          {transaction.counterpartyEmail}
        </Text>
        <Text className={`font-semibold text-lg ml-2 ${amountColor}`}>
          {amountPrefix}{displayAmount}
        </Text>
      </View>
      
      <View className="mt-1">
        <Text className="text-xs text-[#999999]">
          {formatTimeAgo(new Date(transaction.createdAt))}
        </Text>
      </View>
      
      {transaction.txHash && (
        <View className="flex flex-row items-center justify-between mt-3">
          {getStatusBadge(transaction.status)}
          <View className="flex flex-row items-center space-x-2 gap-2">
            <TouchableOpacity
              onPress={handleCopyTxHash}
              className={`px-2 py-1 rounded border ${
                copiedTx
                  ? 'bg-[#4A5A4A] border-[#6B8B6B]'
                  : 'border-[#5A5A5A]'
              }`}
            >
              <Text className={`text-xs ${copiedTx ? 'text-[#B8D8B8]' : 'text-[#B8B8B8]'}`}>
                {copiedTx ? 'Copied!' : 'Copy TX'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleViewExplorer}
              className="px-2 py-1 rounded border border-[#5A5A5A]"
            >
              <Text className="text-xs text-[#B8B8B8]">View</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}
