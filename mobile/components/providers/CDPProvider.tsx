import React from 'react';
import { CDPHooksProvider } from '@coinbase/cdp-hooks';
import Constants from 'expo-constants';

const CDP_PROJECT_ID = Constants.expoConfig?.extra?.cdpProjectId || process.env.EXPO_PUBLIC_CDP_PROJECT_ID;

if (!CDP_PROJECT_ID) {
  throw new Error('CDP_PROJECT_ID is required. Please set it in app.json extra.cdpProjectId or .env EXPO_PUBLIC_CDP_PROJECT_ID');
}

export function CDPProvider({ children }: { children: React.ReactNode }) {
  const config = {
    projectId: CDP_PROJECT_ID,
    ethereum: {
      createOnLogin: 'smart' as const, // Use EVM Smart Accounts for gasless transactions
    },
    solana: {
      createOnLogin: false,
    },
  };

  return (
    <CDPHooksProvider config={config}>
      {children}
    </CDPHooksProvider>
  );
}
