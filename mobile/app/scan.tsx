import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentUser } from '@coinbase/cdp-hooks';
import { QRScanner } from '../components/scanner/QRScanner';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { api } from '../lib/api';
import { AlertTriangle } from 'lucide-react-native';

interface QRScanResult {
  walletAddress?: string;
  amount?: string;
  message?: string;
  name?: string;
  url?: string;
}

interface UserLookupResult {
  success: boolean;
  user?: {
    userId: string;
    email: string;
    displayName: string;
    walletAddress: string;
  };
  message?: string;
}

export default function ScanScreen() {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupUserByWalletAddress = useCallback(async (walletAddress: string): Promise<UserLookupResult> => {
    try {
      console.log('🔍 Looking up user by wallet address:', walletAddress);

      const response = await api.get(`/api/users/lookup-by-address?address=${encodeURIComponent(walletAddress)}`);

      if (response.data.success) {
        return response.data;
      } else {
        return {
          success: false,
          message: response.data.message || 'User not found'
        };
      }
    } catch (error) {
      console.error('❌ Error looking up user:', error);
      return {
        success: false,
        message: 'Failed to lookup user information'
      };
    }
  }, []);

  const handleScanSuccess = useCallback(async (result: QRScanResult) => {
    console.log('🎯 QR Scan successful:', result);
    setIsProcessing(true);
    setError(null);

    try {
      const { walletAddress, amount, message } = result;

      if (!walletAddress) {
        throw new Error('No wallet address found in QR code');
      }

      if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        throw new Error('Invalid wallet address format');
      }

      const userLookup = await lookupUserByWalletAddress(walletAddress);

      if (!userLookup.success) {
        throw new Error(userLookup.message || 'Failed to lookup user');
      }

      if (userLookup.user) {
        console.log('✅ Redirecting to send page with user:', userLookup.user.email);
        
        const params: Record<string, string> = {
          contactEmail: userLookup.user.email,
          displayName: userLookup.user.displayName
        };

        if (amount) {
          params.amount = amount;
        }

        if (message) {
          params.message = message;
        }

        router.push({
          pathname: '/(tabs)/send',
          params
        });
      } else {
        console.log('❌ No user found for wallet address:', walletAddress);
        setError(
          `No Between Friends user found with wallet address ${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}. ` +
          'This QR code might be from another app or an unregistered user.'
        );
      }
    } catch (error) {
      console.error('❌ Error processing QR scan:', error);
      setError(error instanceof Error ? error.message : 'Failed to process QR code');
    } finally {
      setIsProcessing(false);
    }
  }, [router, lookupUserByWalletAddress]);

  const handleScannerClose = useCallback(() => {
    console.log('📱 Scanner closed, redirecting to dashboard');
    router.back();
  }, [router]);

  const handleRetry = useCallback(() => {
    setError(null);
    setIsProcessing(false);
  }, []);

  if (!currentUser) {
    router.push('/(tabs)');
    return <LoadingScreen message="Redirecting..." />;
  }

  if (error) {
    return (
      <View className="flex-1 bg-[#222222] items-center justify-center p-4">
        <View className="bg-[#2A2A2A] border border-[#4A4A4A] rounded-3xl p-8 max-w-md w-full">
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={32} color="#ef4444" />
            </View>
            <Text className="text-xl font-semibold text-white mb-2 text-center">
              QR Code Error
            </Text>
            <Text className="text-[#B8B8B8] text-sm text-center leading-relaxed">
              {error}
            </Text>
          </View>

          <View className="space-y-3">
            <TouchableOpacity
              onPress={handleRetry}
              className="w-full py-3 px-6 bg-[#5CB0FF] rounded-xl"
            >
              <Text className="text-white font-semibold text-center">
                Scan Another Code
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleScannerClose}
              className="w-full py-3 px-6 border border-[#4A4A4A] rounded-xl"
            >
              <Text className="text-[#B8B8B8] font-semibold text-center">
                Back to Dashboard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <QRScanner
      onScanSuccess={handleScanSuccess}
      onClose={handleScannerClose}
      isProcessing={isProcessing}
    />
  );
}
