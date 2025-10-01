import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useEvmAddress, useCurrentUser } from '@coinbase/cdp-hooks';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { QRCodeDisplay } from '../../components/receive/QRCodeDisplay';
import { Button3D } from '../../components/ui/Button3D';
import { ArrowLeft } from 'lucide-react-native';

type ViewMode = 'input' | 'display';

export default function ReceiveScreen() {
  const { currentUser } = useCurrentUser();
  const evmAddress = useEvmAddress();
  const [viewMode, setViewMode] = useState<ViewMode>('input');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  if (!evmAddress?.evmAddress) {
    return <LoadingScreen message="Loading wallet..." />;
  }

  const handleAmountChange = (value: string) => {
    const regex = /^\d*\.?\d{0,6}$/;
    if (value === '' || regex.test(value)) {
      setAmount(value);
    }
  };

  const handleGenerateQR = () => {
    setViewMode('display');
  };

  const handleBack = () => {
    setViewMode('input');
  };

  const handleClearAmount = () => {
    setAmount('');
    setMessage('');
  };

  const quickAmounts = ['10', '25', '50', '100'];

  return (
    <View className="flex-1 bg-[#222222]">
      <ScrollView className="flex-1">
        <View className="px-4 pt-10 pb-6">
          <View className="max-w-md mx-auto space-y-6">
            <View className="flex flex-row items-center justify-between mb-8">
              {viewMode === 'display' ? (
                <TouchableOpacity
                  onPress={handleBack}
                  className="flex flex-row items-center gap-2"
                >
                  <ArrowLeft size={16} color="rgba(255,255,255,0.7)" />
                  <Text className="text-white/70">Back</Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}
              <View />
            </View>

            {viewMode === 'input' ? (
              <>
                <View className="items-center mb-6">
                  <Text className="text-2xl font-bold text-white mb-2">Receive USDC</Text>
                  <Text className="text-[#B8B8B8] text-center">
                    Generate a QR code or share your wallet address
                  </Text>
                </View>

                <View className="bg-[#2A2A2A] rounded-2xl p-6 border border-[#4A4A4A]">
                  <Text className="text-lg font-semibold text-white mb-4">Request Specific Amount (Optional)</Text>
                  
                  <View className="flex flex-row items-center space-x-2 bg-[#1A1A1A] rounded-xl p-4 border border-[#3A3A3A] mb-4">
                    <Text className="text-white/70 text-lg flex-shrink-0">$</Text>
                    <TextInput
                      value={amount}
                      onChangeText={handleAmountChange}
                      placeholder="0.00"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      keyboardType="decimal-pad"
                      className="flex-1 min-w-0 text-lg font-medium text-white"
                    />
                    <Text className="text-sm text-white/70 flex-shrink-0">USDC</Text>
                  </View>

                  <View className="flex flex-row gap-2 mb-4">
                    {quickAmounts.map((quickAmount) => (
                      <TouchableOpacity
                        key={quickAmount}
                        onPress={() => setAmount(quickAmount)}
                        className="flex-1 py-2 bg-[#3A3A3A] rounded-lg border border-[#4A4A4A]"
                      >
                        <Text className="text-white text-center font-medium">${quickAmount}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {amount && (
                    <TouchableOpacity
                      onPress={handleClearAmount}
                      className="py-2"
                    >
                      <Text className="text-[#B8B8B8] text-center text-sm">Clear Amount</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View className="bg-[#2A2A2A] rounded-2xl p-6 border border-[#4A4A4A]">
                  <Text className="text-lg font-semibold text-white mb-4">Add Message (Optional)</Text>
                  
                  <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="e.g., Dinner split, Concert tickets..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    className="bg-[#1A1A1A] rounded-xl p-4 border border-[#3A3A3A] text-white"
                    multiline
                    numberOfLines={3}
                    maxLength={100}
                  />
                  <Text className="text-[#999999] text-xs mt-2 text-right">
                    {message.length}/100
                  </Text>
                </View>

                <Button3D onPress={handleGenerateQR}>
                  Generate QR Code
                </Button3D>

                <View className="bg-[#2A2A3A] rounded-xl p-4 border border-[#3A3A4A]">
                  <Text className="text-[#B8B8D8] text-sm">
                    💡 Tip: Add an amount to create a payment request. Leave it blank to just share your wallet address.
                  </Text>
                </View>
              </>
            ) : (
              <QRCodeDisplay
                walletAddress={evmAddress.evmAddress}
                amount={amount || undefined}
                message={message || undefined}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
