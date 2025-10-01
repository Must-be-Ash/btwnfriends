import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useIsSignedIn } from '@coinbase/cdp-hooks';

export default function Index() {
  const router = useRouter();
  const isSignedIn = useIsSignedIn();

  useEffect(() => {
    // Wait a bit for CDP to initialize
    const timer = setTimeout(() => {
      if (isSignedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isSignedIn]);

  return (
    <View className="flex-1 items-center justify-center bg-primary-500">
      <Text className="text-4xl font-bold text-white mb-4">Between Friends</Text>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}
