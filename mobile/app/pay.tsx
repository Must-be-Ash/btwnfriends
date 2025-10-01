import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function PayScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { to, address, amount, message, memo } = params;

  // This screen handles payment links like /pay?to=0x123...&amount=10
  // It should redirect to the send screen with pre-filled data
  useEffect(() => {
    if (to || address) {
      // TODO: Redirect to send screen with pre-filled recipient
      console.log('Payment link detected:', { to, address, amount, message, memo });
    }
  }, [to, address, amount, message, memo]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Processing Payment</Text>
      <Text className="text-gray-600 mt-2">Loading...</Text>
    </View>
  );
}
