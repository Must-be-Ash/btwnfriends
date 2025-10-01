import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { CheckCircle, Mail, ExternalLink } from 'lucide-react-native';
import { Button3D } from '../ui/Button3D';
import { formatUSDCWithSymbol } from '../../lib/utils';
import { getBlockExplorerUrl } from '../../lib/cdp';

interface RecipientInfo {
  email: string;
  exists: boolean;
  displayName?: string;
  walletAddress?: string;
  transferType: 'direct' | 'escrow';
}

interface TransferData {
  recipient: RecipientInfo;
  amount: string;
}

interface SendSuccessProps {
  transferData: TransferData;
  txHash: string;
  onSendAnother: () => void;
  onGoToDashboard: () => void;
}

export function SendSuccess({ transferData, txHash, onSendAnother, onGoToDashboard }: SendSuccessProps) {
  const { recipient, amount } = transferData;
  const isDirect = recipient.transferType === 'direct';

  const handleViewOnExplorer = async () => {
    const explorerUrl = getBlockExplorerUrl(txHash);
    try {
      await Linking.openURL(explorerUrl);
    } catch (error) {
      console.error('Failed to open explorer URL:', error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#222222]">
      <View className="p-6 space-y-6">
        <View className="items-center">
          <View className="w-16 h-16 rounded-full mb-6 bg-[#4A4A4A] border border-[#6B6B6B] items-center justify-center">
            {isDirect ? (
              <CheckCircle size={32} color="#B8B8B8" />
            ) : (
              <Mail size={32} color="#B8B8B8" />
            )}
          </View>
          
          <Text className="text-2xl font-bold text-white mb-2 text-center">
            {isDirect ? 'Transfer Complete!' : 'Sent!'}
          </Text>
        </View>

        <View className="bg-[#2A2A2A] rounded-2xl p-6 border border-[#4A4A4A]">
          <Text className="text-lg font-semibold text-white mb-4">Transfer Details</Text>
          
          <View className="space-y-4">
            <View className="flex flex-row justify-between items-center">
              <Text className="text-[#B8B8B8]">Amount</Text>
              <Text className="font-semibold text-white">
                {formatUSDCWithSymbol(amount)}
              </Text>
            </View>
            
            <View className="flex flex-row justify-between items-start">
              <Text className="text-[#B8B8B8]">Recipient</Text>
              <View className="flex-1 items-end">
                <Text className="font-medium text-white text-right">
                  {recipient.displayName || recipient.email}
                </Text>
                {recipient.displayName && (
                  <Text className="text-sm text-[#999999] text-right">{recipient.email}</Text>
                )}
              </View>
            </View>
            
            <View className="flex flex-row justify-between items-center">
              <Text className="text-[#B8B8B8]">Status</Text>
              <View className={`px-3 py-1 rounded-full ${
                isDirect 
                  ? 'bg-[#4A5A4A] border border-[#6B8B6B]' 
                  : 'bg-[#5A5A4A] border border-[#8B8B6B]'
              }`}>
                <Text className={isDirect ? 'text-[#B8D8B8]' : 'text-[#D8D8B8]'}>
                  {isDirect ? 'Completed' : 'Pending Claim'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {!isDirect && (
          <View className="bg-[#3A3A2A] rounded-2xl p-6 border border-[#5A5A3A]">
            <View className="flex flex-row items-start mb-2">
              <Mail size={20} color="#D8D8B8" className="mt-0.5" />
              <View className="flex-1 ml-3">
                <Text className="font-medium text-[#E8E8C8] mb-1">Email Sent</Text>
                <Text className="text-sm text-[#B8B8A8]">
                  {recipient.email} will receive an email with instructions to claim their USDC.
                </Text>
              </View>
            </View>
          </View>
        )}

        <View className="bg-[#2A2A2A] rounded-xl p-4 border border-[#4A4A4A]">
          <TouchableOpacity 
            onPress={handleViewOnExplorer}
            className="flex flex-row items-center justify-between"
          >
            <View className="flex-1">
              <Text className="text-white font-medium mb-1">Transaction Hash</Text>
              <Text className="text-[#B8B8B8] text-xs" numberOfLines={1}>
                {txHash}
              </Text>
            </View>
            <ExternalLink size={20} color="#B8B8B8" />
          </TouchableOpacity>
        </View>

        <View className="flex flex-row gap-3">
          <View className="flex-1">
            <Button3D onPress={onGoToDashboard}>
              Dashboard
            </Button3D>
          </View>
          <View className="flex-1">
            <Button3D onPress={onSendAnother}>
              Send Again
            </Button3D>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
