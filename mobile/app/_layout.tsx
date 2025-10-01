import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CDPProvider } from '../components/providers/CDPProvider';
import '../global.css';

export default function RootLayout() {
  return (
    <CDPProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
      </Stack>
    </CDPProvider>
  );
}
