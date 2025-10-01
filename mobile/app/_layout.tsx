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
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="scan" 
          options={{
            headerShown: true,
            title: 'Scan QR Code',
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="settings" 
          options={{
            headerShown: true,
            title: 'Settings',
          }}
        />
        <Stack.Screen 
          name="export-key" 
          options={{
            headerShown: true,
            title: 'Export Key',
          }}
        />
        <Stack.Screen 
          name="pay" 
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="privacy" 
          options={{
            headerShown: true,
            title: 'Privacy Policy',
          }}
        />
        <Stack.Screen 
          name="tos" 
          options={{
            headerShown: true,
            title: 'Terms of Service',
          }}
        />
      </Stack>
    </CDPProvider>
  );
}
