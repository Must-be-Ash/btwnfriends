# Wagmi Integration

## Overview

[Wagmi](https://wagmi.sh/) is a TypeScript library for Ethereum development that provides a collection of React Hooks for interacting with Ethereum-compatible blockchains. It's built on top of `viem` and offers a modern, developer-friendly API for building dapps.

The NPM package @coinbase/cdp-wagmi is a bridge that connects Coinbase’s CDP (Coinbase Developer Platform) Wallets to the wagmi ecosystem—bringing CDP-powered smart wallet functionality into React apps using wagmi hooks.

You'll learn how to install the package, set up the provider, and render your first component.

<Tip>
  Check out the [CDP Web SDK reference](/sdks/cdp-sdks-v2/react) for comprehensive method signatures, types, and examples.
</Tip>

## Prerequisites

* [Node.js 22+](https://nodejs.org/en/download) installed
* A node package manager installed (i.e., `npm`, `pnpm`, or `yarn`)
* A free [CDP Portal](https://portal.cdp.coinbase.com) account
* Basic familiarity with React and Wagmi

## 1. Install Wagmi and CDP packages

Add the required packages to your project using your preferred package manager.

```bash
# With pnpm
pnpm add @coinbase/cdp-wagmi @coinbase/cdp-core @tanstack/react-query viem wagmi

# With yarn
yarn add @coinbase/cdp-wagmi @coinbase/cdp-core @tanstack/react-query viem wagmi

# With npm
npm install @coinbase/cdp-wagmi @coinbase/cdp-core @tanstack/react-query viem wagmi
```

## 2. Get your CDP Project ID

1. Sign in to your [CDP Portal](https://portal.cdp.coinbase.com) account
2. Select a project from the dropdown menu in the top-left
3. Click the gear icon to view project settings
4. Copy the **Project ID** for use in the next step

## 3. Configure WagmiProvider

Configure your WagmiProvider with the CDPEmbeddedWalletConnector.

`CDPEmbeddedWalletConnector` provides the necessary context for Wagmi to work correctly with the CDP Frontend SDK. The `providerConfig` must be provided and is responsible for configuring the EIP-1193 provider's transports which are used to broadcast non-Base transactions.

```tsx main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App'; // Your main App component
import { Config } from '@coinbase/cdp-core';
import { createCDPEmbeddedWalletConnector } from '@coinbase/cdp-wagmi';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { baseSepolia, base } from 'viem/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';

// Your CDP config
const cdpConfig: Config = {
  projectId: "your-project-id", // Copy your Project ID here.
}

const connector = createCDPEmbeddedWalletConnector({
  cdpConfig: cdpConfig,
  providerConfig: {
    chains: [base, baseSepolia],
    transports: {
      [base.id]: http(),
      [baseSepolia.id]: http()
    }
  }
});

const wagmiConfig = createConfig({
  connectors: [connector],
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

const queryClient = new QueryClient(); // For use with react-query

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
```

## 4. Sign in the user

Before using Wagmi hooks, users need to be signed in using either CDP React components or hooks. When the user verifies their OTP and is signed in, they will automatically be connected with wagmi.

You can use either approach:

**Option 1: Using React Components**

```tsx
import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";

<AuthButton /> // Users sign in via this button
```

**Option 2: Using React Hooks**

```tsx
import { useSignInWithEmail, useVerifyEmailOTP } from "@coinbase/cdp-hooks";
// Implement your own sign-in flow using these hooks
```

Once signed in, the user's wallet is automatically available to wagmi.

## 5. Use Wagmi hooks

Your application can now call Wagmi hooks. Here's an example component that demonstrates wagmi's `useSendTransaction` hook:

```tsx WagmiTransaction.tsx
import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";

/**
 * The burn address (0x0000000000000000000000000000000000000000)
 */
const BURN_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

/**
 * The amount to send in ETH (0.00001 ETH)
 */
const AMOUNT_TO_SEND = "0.00001";

/**
 * A component that demonstrates wagmi's useSendTransaction hook
 * by sending 0.00001 ETH to the burn address.
 *
 * @returns A component that allows the user to send a transaction using wagmi.
 */
export default function WagmiTransaction() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const { data: hash, sendTransaction, isPending, error } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSendTransaction = async () => {
    if (!address) return;

    setIsLoading(true);

    try {
      sendTransaction({
        to: BURN_ADDRESS,
        value: parseEther(AMOUNT_TO_SEND),
      });
    } catch (error) {
      console.error("Failed to send transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Reset by refreshing the page or clearing state
    window.location.reload();
  };

  return (
    <div>
      <div>
        <p>
          ⚠️ Warning: This will send {AMOUNT_TO_SEND} ETH to the burn address (0x0000...0000). 
          This transaction cannot be reversed and the ETH will be permanently lost.
        </p>
      </div>

      <div>
        <div>
          <div>Amount: {AMOUNT_TO_SEND} ETH</div>
          <div>To (Burn Address): {BURN_ADDRESS.slice(0, 6)}...{BURN_ADDRESS.slice(-4)}</div>
          <div>From: {address?.slice(0, 6)}...{address?.slice(-4)}</div>
        </div>
      </div>

      {error && (
        <div>
          <strong>Error:</strong> {error.message}
        </div>
      )}

      {!hash && !isPending && !isLoading && (
        <button disabled={!address} onClick={handleSendTransaction}>
          Send {AMOUNT_TO_SEND} ETH to Burn Address
        </button>
      )}

      {(isPending || isConfirming) && (
        <div>
          <div>Sending transaction...</div>
          {hash && (
            <div>
              Hash: {hash.slice(0, 10)}...{hash.slice(-8)}
            </div>
          )}
        </div>
      )}

      {isSuccess && hash && (
        <div>
          <div>
            <div>✅</div>
          </div>

          <div>
            <div>Transaction Confirmed!</div>
            <div>Your transaction has been successfully sent to the burn address</div>
          </div>

          <div>
            <div>Amount: {AMOUNT_TO_SEND} ETH</div>
            <div>To: {BURN_ADDRESS.slice(0, 6)}...{BURN_ADDRESS.slice(-4)}</div>
            <div>
              Block Explorer:{" "}
              <a
                href={`https://sepolia.basescan.org/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {hash.slice(0, 10)}...{hash.slice(-8)}
              </a>
            </div>
          </div>

          <button onClick={handleReset}>
            Send Another Transaction →
          </button>
        </div>
      )}
    </div>
  );
}
```

<Accordion title="What's different from standard Wagmi setup?">
  The main difference is using `CDPEmbeddedWalletConnector` instead of traditional wallet connectors. This connector:

  1. Handles CDP wallet creation and authentication
  2. Manages the secure connection to CDP's infrastructure
  3. Provides seamless integration with CDP's embedded wallet features
  4. Eliminates the need for browser extensions or external wallet apps
</Accordion>

## What to read next

* [**CDP Web SDK Documentation**](/sdks/cdp-sdks-v2/react): Comprehensive API reference for the CDP Web SDK
* [**Embedded Wallets - React Hooks**](/embedded-wallets/react-hooks): Learn about available CDP hooks that complement Wagmi
* [**Wagmi Documentation**](https://wagmi.sh): Explore the full Wagmi documentation for advanced usage
