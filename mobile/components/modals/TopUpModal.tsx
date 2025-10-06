import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Linking } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { X, Copy, Check, ExternalLink } from 'lucide-react-native';

interface TopUpModalProps {
  visible: boolean;
  walletAddress: string;
  onClose: () => void;
}

export function TopUpModal({ visible, walletAddress, onClose }: TopUpModalProps) {
  const [copied, setCopied] = useState(false);

  const formatAddress = (address: string) => {
    if (address.length <= 13) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const handleOpenFaucet = () => {
    Linking.openURL('https://faucet.circle.com/');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center px-4 bg-black/60">
        <View
          className="w-full max-w-md rounded-3xl p-8 border border-[#4A4A4A] relative"
          style={{
            backgroundColor: 'rgba(42, 42, 42, 0.8)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          {/* Close button */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 z-10"
            accessibilityLabel="Close"
          >
            <X size={20} color="#FFFFFF66" />
          </TouchableOpacity>

          <View className="gap-6">
            {/* Header */}
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#CCCCCC] text-center">
                Top Up Testnet USDC
              </Text>
              <Text className="text-sm text-white/70 mt-2 text-center">
                Get free testnet USDC from Circle's faucet
              </Text>
            </View>

            {/* Wallet Address with Copy */}
            <View className="gap-2">
              <Text className="text-sm font-medium text-white/70">Your Wallet Address</Text>
              <View className="flex-row items-center gap-2">
                <View className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl">
                  <Text className="text-white font-mono text-sm">
                    {formatAddress(walletAddress)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleCopy}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl active:bg-white/20"
                  accessibilityLabel="Copy address"
                >
                  {copied ? (
                    <Check size={20} color="#4ADE80" />
                  ) : (
                    <Copy size={20} color="#FFFFFFB3" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Instructions */}
            <View className="gap-3">
              <Text className="text-sm font-semibold text-white">How to get testnet USDC:</Text>
              <View className="gap-2">
                <View className="flex-row gap-2">
                  <Text className="text-[#5CB0FF] font-semibold text-sm">1.</Text>
                  <Text className="text-white/80 text-sm flex-1">Copy your wallet address above</Text>
                </View>
                <View className="flex-row gap-2">
                  <Text className="text-[#5CB0FF] font-semibold text-sm">2.</Text>
                  <Text className="text-white/80 text-sm flex-1">Go to the link below</Text>
                </View>
                <View className="flex-row gap-2">
                  <Text className="text-[#5CB0FF] font-semibold text-sm">3.</Text>
                  <Text className="text-white/80 text-sm flex-1">
                    Select <Text className="font-medium text-white">Base Sepolia</Text> network
                  </Text>
                </View>
                <View className="flex-row gap-2">
                  <Text className="text-[#5CB0FF] font-semibold text-sm">4.</Text>
                  <Text className="text-white/80 text-sm flex-1">Paste your wallet address</Text>
                </View>
                <View className="flex-row gap-2">
                  <Text className="text-[#5CB0FF] font-semibold text-sm">5.</Text>
                  <Text className="text-white/80 text-sm flex-1">Press "Send 10 USDC" button</Text>
                </View>
              </View>
            </View>

            {/* Faucet Link */}
            <TouchableOpacity
              onPress={handleOpenFaucet}
              className="flex-row items-center justify-center gap-2 w-full px-6 py-3 bg-[#5CB0FF] active:bg-[#4A9FEE] rounded-xl"
              accessibilityLabel="Go to Circle Faucet"
            >
              <Text className="text-white font-medium">Go to Circle Faucet</Text>
              <ExternalLink size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
