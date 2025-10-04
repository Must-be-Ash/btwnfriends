import React, { useEffect } from 'react';
import { CDPHooksProvider } from '@coinbase/cdp-hooks';
import Constants from 'expo-constants';

console.log('[CDPProvider] Initializing CDP provider...');

const CDP_PROJECT_ID = Constants.expoConfig?.extra?.cdpProjectId || process.env.EXPO_PUBLIC_CDP_PROJECT_ID;

console.log('[CDPProvider] CDP_PROJECT_ID:', CDP_PROJECT_ID ? '✓ Found' : '✗ Missing');

if (!CDP_PROJECT_ID) {
  console.error('[CDPProvider] ERROR: CDP_PROJECT_ID is required');
  throw new Error('CDP_PROJECT_ID is required. Please set it in app.json extra.cdpProjectId or .env EXPO_PUBLIC_CDP_PROJECT_ID');
}

export function CDPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('[CDPProvider] Component mounted, CDP initialization starting...');
    return () => {
      console.log('[CDPProvider] Component unmounting');
    };
  }, []);

  const config = {
    projectId: CDP_PROJECT_ID,
    ethereum: {
      createOnLogin: 'smart' as const, // Use EVM Smart Accounts for gasless transactions
    },
    solana: {
      createOnLogin: false,
    },
  };

  console.log('[CDPProvider] Rendering with config:', {
    projectId: CDP_PROJECT_ID,
    ethereumCreateOnLogin: config.ethereum.createOnLogin,
    solanaCreateOnLogin: config.solana.createOnLogin,
  });

  try {
    return (
      <CDPHooksProvider config={config}>
        {children}
      </CDPHooksProvider>
    );
  } catch (error) {
    console.error('[CDPProvider] ERROR during CDP initialization:', error);
    console.error('[CDPProvider] Error details:', JSON.stringify(error, null, 2));
    throw error; // Re-throw to let error boundary catch it
  }
}
