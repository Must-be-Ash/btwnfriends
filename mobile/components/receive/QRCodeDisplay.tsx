import { View, Text, TouchableOpacity, Share, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react-native';
import { formatUSDCWithSymbol, formatAddress } from '../../lib/utils';

interface QRCodeDisplayProps {
  walletAddress: string;
  amount?: string;
  message?: string;
}

export function QRCodeDisplay({ walletAddress, amount, message }: QRCodeDisplayProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const generatePaymentUrl = () => {
    const baseUrl = process.env.EXPO_PUBLIC_WEB_URL;
    if (!baseUrl) {
      console.warn('EXPO_PUBLIC_WEB_URL not configured');
      return walletAddress;
    }
    
    const params = new URLSearchParams();
    params.set('to', walletAddress);

    if (amount) {
      params.set('amount', amount);
    }

    if (message) {
      params.set('message', message);
    }

    return `${baseUrl}/pay?${params.toString()}`;
  };

  const paymentUrl = generatePaymentUrl();

  const handleCopyUrl = async () => {
    try {
      await Clipboard.setStringAsync(paymentUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

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
    const shareText = amount 
      ? `Send me ${formatUSDCWithSymbol(amount)} USDC${message ? ` for ${message}` : ''}`
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
    <View className="space-y-6">
      <View className="items-center">
        <Text className="text-xl font-semibold text-white mb-2 text-center">
          {amount ? 'Payment Request QR Code' : 'Wallet QR Code'}
        </Text>
        <Text className="text-[#B8B8B8] text-center">
          {amount 
            ? `Request for ${formatUSDCWithSymbol(amount)}`
            : 'Scan to send USDC to your wallet'
          }
        </Text>
      </View>

      <View className="bg-[#2A2A2A] rounded-2xl p-6 border border-[#4A4A4A]">
        <View className="items-center">
          <View className="bg-white p-4 rounded-xl mb-4">
            <QRCode
              value={paymentUrl}
              size={220}
              backgroundColor="white"
              color="#111827"
            />
          </View>
          
          <Text className="text-sm text-[#B8B8B8] mb-2 text-center">
            Scan with any wallet app that supports Base Network
          </Text>
          
          {message && (
            <View className="bg-[#3A3A4A] rounded-lg p-3 mt-4 w-full">
              <Text className="text-[#D8D8D8] text-sm font-medium">Message:</Text>
              <Text className="text-[#B8B8B8] text-sm italic mt-1">"{message}"</Text>
            </View>
          )}
        </View>
      </View>

      <View className="bg-[#2A2A2A] rounded-2xl p-4 border border-[#4A4A4A]">
        <Text className="font-semibold text-white mb-3">Payment Details</Text>
        <View className="space-y-2">
          <View className="flex flex-row justify-between">
            <Text className="text-[#B8B8B8]">Network:</Text>
            <Text className="font-medium text-white">Base</Text>
          </View>
          
          <View className="flex flex-row justify-between">
            <Text className="text-[#B8B8B8]">Token:</Text>
            <Text className="font-medium text-white">USDC</Text>
          </View>
          
          {amount && (
            <View className="flex flex-row justify-between">
              <Text className="text-[#B8B8B8]">Amount:</Text>
              <Text className="font-semibold text-white">{formatUSDCWithSymbol(amount)}</Text>
            </View>
          )}
          
          <View className="flex flex-row justify-between items-start">
            <Text className="text-[#B8B8B8] flex-shrink-0">Address:</Text>
            <Text className="font-mono text-xs text-white text-right ml-2">
              {formatAddress(walletAddress)}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex flex-row gap-3 mb-3">
        <TouchableOpacity
          onPress={handleCopyAddress}
          className={`flex-1 flex flex-col items-center p-4 rounded-xl border transition-colors ${
            copiedAddress 
              ? 'bg-[#3A4A3A] border-[#5A7A5A]' 
              : 'bg-[#2A2A2A] border-[#4A4A4A]'
          }`}
        >
          <View className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
            copiedAddress ? 'bg-[#4A5A4A]' : 'bg-[#3A3A3A]'
          }`}>
            {copiedAddress ? (
              <Check size={20} color="#B8D8B8" />
            ) : (
              <Copy size={20} color="#B8B8B8" />
            )}
          </View>
          <Text className="font-medium text-white text-sm">
            {copiedAddress ? 'Copied!' : 'Copy Address'}
          </Text>
          <Text className="text-[#999999] text-xs mt-1">Wallet Address</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCopyUrl}
          className={`flex-1 flex flex-col items-center p-4 rounded-xl border transition-colors ${
            copiedUrl 
              ? 'bg-[#3A4A3A] border-[#5A7A5A]' 
              : 'bg-[#2A2A2A] border-[#4A4A4A]'
          }`}
        >
          <View className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
            copiedUrl ? 'bg-[#4A5A4A]' : 'bg-[#3A3A3A]'
          }`}>
            {copiedUrl ? (
              <Check size={20} color="#B8D8B8" />
            ) : (
              <Copy size={20} color="#B8B8B8" />
            )}
          </View>
          <Text className="font-medium text-white text-sm">
            {copiedUrl ? 'Copied!' : 'Copy Link'}
          </Text>
          <Text className="text-[#999999] text-xs mt-1">Payment URL</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleShare}
        className="flex flex-col items-center p-4 bg-[#2A2A2A] rounded-xl border border-[#4A4A4A]"
      >
        <View className="w-10 h-10 bg-[#3A3A3A] rounded-full flex items-center justify-center mb-2">
          <Share2 size={20} color="#B8B8B8" />
        </View>
        <Text className="font-medium text-white text-sm">Share Payment Request</Text>
        <Text className="text-[#999999] text-xs mt-1">Via message or email</Text>
      </TouchableOpacity>

      <View className="bg-[#2A3A4A] rounded-xl p-4 border border-[#3A4A5A]">
        <Text className="font-medium text-[#C8D8E8] mb-3">How to Use This QR Code</Text>
        <View className="space-y-2">
          <Text className="text-[#B8C8D8] text-sm">• Show & Scan: Others can scan with their phone camera</Text>
          <Text className="text-[#B8C8D8] text-sm">• Share Link: Send via text message or email</Text>
          <Text className="text-[#B8C8D8] text-sm">• Works with any QR scanner - automatically opens Between Friends</Text>
          <Text className="text-[#B8C8D8] text-sm">• Base Network USDC transfers only</Text>
        </View>
      </View>
    </View>
  );
}
