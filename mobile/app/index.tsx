import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useIsSignedIn, useIsInitialized } from '@coinbase/cdp-hooks';

export default function Index() {
  const router = useRouter();
  const { isSignedIn } = useIsSignedIn();
  const { isInitialized } = useIsInitialized();

  useEffect(() => {
    // Wait for CDP to fully initialize before routing
    if (!isInitialized) return;

    // Immediate routing without delay
    if (isSignedIn) {
      router.replace('/(tabs)');
    } else {
      router.replace('/auth');
    }
  }, [isSignedIn, isInitialized, router]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#222222' }}>
      <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#CCCCCC', marginBottom: 16 }}>Between Friends</Text>
      <ActivityIndicator size="large" color="#B8B8B8" />
    </View>
  );
}
