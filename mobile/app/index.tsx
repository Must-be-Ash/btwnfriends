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
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#3b82f6' }}>
      <Text style={{ fontSize: 36, fontWeight: 'bold', color: 'white', marginBottom: 16 }}>Between Friends</Text>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}
