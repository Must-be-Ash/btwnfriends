import { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvmAddress } from '@coinbase/cdp-hooks';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { formatUSDCWithSymbol, formatAddress } from '../../lib/utils';

export default function ReceiveScreen() {
  const evmAddress = useEvmAddress();
  const [amount, setAmount] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);

  if (!evmAddress?.evmAddress) {
    return <LoadingScreen message="Loading wallet..." />;
  }

  const walletAddress = evmAddress.evmAddress;

  const handleAmountChange = (value: string) => {
    const regex = /^\d*\.?\d{0,6}$/;
    if (value === '' || regex.test(value)) {
      setAmount(value);
    }
  };

  // Generate web URL that updates reactively when amount changes
  // This works for both camera scanning AND in-app scanning
  const paymentUrl = useMemo(() => {
    const baseUrl = process.env.EXPO_PUBLIC_WEB_URL || 'http://localhost:3000';
    const params = new URLSearchParams();
    params.set('to', walletAddress);
    params.set('amount', amount || '0');

    return `${baseUrl}/pay?${params.toString()}`;
  }, [walletAddress, amount]);

  const handleCopyAddress = async () => {
    try {
      await Clipboard.setStringAsync(walletAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const handleShare = async () => {
    const amountValue = amount && parseFloat(amount) > 0 ? parseFloat(amount) : 0;
    const shareText = amountValue > 0
      ? `Send me ${formatUSDCWithSymbol(amount)} USDC`
      : 'Send me USDC';

    try {
      await Share.share({
        message: `${shareText}\n\n${paymentUrl}`,
        url: paymentUrl,
        title: 'Between Friends Payment Request'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#222222]" edges={['top']}>
      <ScrollView className="flex-1">
        <View className="px-4 pt-8 pb-6">
          <View className="max-w-md mx-auto">
            {/* Amount Input */}
            <View className="bg-[#3B3B3B] rounded-2xl p-6 border border-white/30 shadow-2xl mb-4">
              <Text className="text-lg font-semibold text-white mb-4">Request Specific Amount</Text>

              <View className="flex flex-row items-center bg-white/10 rounded-xl p-4 border border-white/20">
                <Text className="text-white/70 text-lg flex-shrink-0">$</Text>
                <TextInput
                  value={amount}
                  onChangeText={handleAmountChange}
                  placeholder="0.00"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  keyboardType="decimal-pad"
                  className="flex-1 min-w-0 text-lg font-medium text-white ml-2"
                />
                <Text className="text-sm text-white/70 flex-shrink-0 ml-2">USDC</Text>
              </View>
            </View>

            {/* QR Code & Wallet Address */}
            <View className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl mb-4">
              <View className="items-center">
                <View className="bg-white rounded-2xl p-4 mb-2">
                  <QRCode
                    value={paymentUrl}
                    size={192}
                    backgroundColor="white"
                    color="#111827"
                  />
                </View>
                <Text className="text-sm text-white/70 mb-4 text-center">
                  {amount && parseFloat(amount) > 0
                    ? `Scan to send ${formatUSDCWithSymbol(amount)}`
                    : 'Scan to send USDC'
                  }
                </Text>

                {/* Wallet Address - clickable to copy */}
                <TouchableOpacity
                  onPress={handleCopyAddress}
                  className="w-full p-3 bg-white/10 rounded-xl border border-white/20"
                >
                  <Text className="text-sm font-mono text-white/90 mb-1 text-center">
                    {formatAddress(walletAddress)}
                  </Text>
                  <Text className="text-xs text-white/60 text-center">
                    {copiedAddress ? 'Copied!' : 'Tap to copy address'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Share Button */}
            <TouchableOpacity
              onPress={handleShare}
              className="bg-[#5CB0FF] rounded-2xl p-4 shadow-lg"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Share Payment Request
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
