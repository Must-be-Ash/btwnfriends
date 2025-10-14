import { View, Text, TouchableOpacity, ScrollView, Linking, Share } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
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

  const handleShareReceipt = async () => {
    try {
      const baseScanUrl = getBlockExplorerUrl(txHash);
      const shareText = `I just sent you ${formatUSDCWithSymbol(amount)} USDC${isDirect ? '' : '. Check your email to claim it!'}\n\nTransaction: ${txHash}\nView on BaseScan: ${baseScanUrl}\n\nGet started with Between Friends:\niOS: https://testflight.apple.com/join/aZCPAjwZ\nWeb: https://btwnfriends.com/`;

      await Share.share({
        message: shareText,
        title: 'Transfer Receipt'
      });
    } catch (error) {
      console.error('Failed to share receipt:', error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#222222]">
      <View className="px-4 pt-12 pb-32">
        <View className="items-center mb-10">
          <View className="w-24 h-24 rounded-full mb-8 bg-[#3B3B3B] border border-white/20 items-center justify-center">
            <CheckCircle size={48} color="#10b981" />
          </View>

          <Text className="text-3xl font-bold text-white text-center">
            Transfer Complete!
          </Text>
        </View>

        <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 mb-6">
          <Text className="text-xl font-semibold text-white mb-8">Transfer Details</Text>

          <View className="gap-6">
            <View className="flex flex-row justify-between items-center">
              <Text className="text-white/70 text-lg">Amount</Text>
              <Text className="font-bold text-white text-3xl">
                {formatUSDCWithSymbol(amount)}
              </Text>
            </View>

            <View className="flex flex-row justify-between items-start">
              <Text className="text-white/70 text-lg">Recipient</Text>
              <View className="flex-1 items-end">
                <Text className="font-semibold text-white text-right text-xl">
                  {recipient.displayName || recipient.email}
                </Text>
                {recipient.displayName && (
                  <Text className="text-base text-white/70 mt-2 text-right">{recipient.email}</Text>
                )}
              </View>
            </View>

            <View className="flex flex-row justify-between items-center">
              <Text className="text-white/70 text-lg">Status</Text>
              <View className="px-5 py-2.5 rounded-full bg-green-500/20 border border-green-500/30">
                <Text className="text-green-400 font-semibold text-base">✓ Completed</Text>
              </View>
            </View>

            <View className="pt-6 border-t border-white/10">
              <Text className="text-white/70 text-lg mb-3">Transaction Hash</Text>
              <TouchableOpacity
                onPress={handleViewOnExplorer}
                className="flex flex-row items-center justify-between bg-[#2A2A2A] rounded-xl p-5 border border-white/10"
              >
                <Text className="text-white/90 text-base flex-1 mr-4" numberOfLines={1}>
                  {txHash}
                </Text>
                <Text className="text-[#5CB0FF] text-base font-semibold">View ↗</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="gap-4">
          <TouchableOpacity
            onPress={handleShareReceipt}
            className="w-full py-5 px-6 bg-[#3B3B3B] border border-white/30 rounded-2xl"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-white font-semibold text-lg text-center">
              Share Receipt
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSendAnother}
            className="w-full py-5 px-6 bg-[#3B3B3B] border border-white/30 rounded-2xl"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-white font-semibold text-lg text-center">
              Send Another Payment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
