import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useApi } from '../lib/use-api';

export default function PayScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { api, isReady: isApiReady } = useApi();
  const [error, setError] = useState<string | null>(null);

  // Extract wallet address from params (supports both 'to' and 'address' params)
  const walletAddress = (Array.isArray(params.to) ? params.to[0] : params.to) ||
                        (Array.isArray(params.address) ? params.address[0] : params.address);
  const amount = Array.isArray(params.amount) ? params.amount[0] : params.amount;
  const message = Array.isArray(params.message) ? params.message[0] : params.message;

  console.log('💳 Pay screen params:', { walletAddress, amount, message, allParams: params });

  useEffect(() => {
    const processDeepLink = async () => {
      if (!walletAddress || !isApiReady) {
        console.log('⏳ Waiting for wallet address or API...', { walletAddress, isApiReady });
        return;
      }

      try {
        console.log('🔗 Processing deep link:', { walletAddress, amount, message });

        // Look up user by wallet address
        const response = await api.get(`/api/users/lookup-by-address?address=${encodeURIComponent(walletAddress)}`);

        console.log('📡 API Response:', response.data);

        if (response.data?.success && response.data?.user) {
          const user = response.data.user;
          console.log('✅ User found:', { email: user.email, displayName: user.displayName });

          // Redirect to send screen with user details
          const sendParams = new URLSearchParams();
          sendParams.set('contactEmail', user.email);
          sendParams.set('displayName', user.displayName || user.email);

          if (amount && amount !== '0') {
            sendParams.set('amount', amount);
          }

          console.log('🔀 Redirecting to send screen with params:', sendParams.toString());
          router.replace(`/(tabs)/send?${sendParams.toString()}`);
        } else {
          // User not found - show error
          console.log('❌ No user found for wallet:', walletAddress);
          console.log('Response data:', JSON.stringify(response.data, null, 2));
          setError(`No Between Friends user found with this wallet address. The recipient may not have an account yet.`);
        }
      } catch (err) {
        console.error('❌ Error processing deep link:', err);
        setError('Failed to process payment link. Please try again.');
      }
    };

    processDeepLink();
  }, [walletAddress, amount, message, isApiReady, api, router]);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-[#222222] px-6">
        <View className="bg-[#2A2A2A] border border-[#4A4A4A] rounded-2xl p-6 max-w-md">
          <Text className="text-xl font-bold text-white mb-3 text-center">Payment Link Error</Text>
          <Text className="text-[#B8B8B8] text-center mb-4">{error}</Text>
          <Text className="text-[#999999] text-sm text-center">
            Wallet: {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-6)}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-[#222222]">
      <ActivityIndicator size="large" color="#5CB0FF" />
      <Text className="text-xl font-semibold text-white mt-4">Processing Payment Link</Text>
      <Text className="text-[#B8B8B8] mt-2">Looking up recipient...</Text>
    </View>
  );
}
