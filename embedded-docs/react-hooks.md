# React Hooks

## Overview

CDP provides React hooks for conveniently accessing the CDP Embedded Wallet SDK functionality. Built on top of `@coinbase/cdp-core`, these hooks offer a React-friendly interface for authentication and embedded wallet operations.

<Tip>
  Check out the [CDP Web SDK reference](/sdks/cdp-sdks-v2/react) for comprehensive method signatures, types, and examples.
</Tip>

<Accordion title="Available hooks">
  ### Auth and user management

  * `useSignInWithEmail` - Initiate email authentication flow
  * `useVerifyEmailOTP` - Verify OTP code sent to email
  * `useSignInWithSms` - Initiate SMS authentication flow
  * `useVerifySmsOTP` - Verify OTP code sent via SMS
  * `useCurrentUser` - Get the current authenticated user
  * `useIsSignedIn` - Check if user is signed in
  * `useSignOut` - Sign out the current user
  * `useGetAccessToken` - Retrieve the access token of the current user

  ### Wallet operations

  * `useEvmAddress` - Get the primary EVM wallet address
  * `useSendEvmTransaction` - Send transactions on many EVM networks via CDP
  * `useSignEvmTransaction` - Sign transactions for any EVM network
  * `useSignEvmMessage` - Sign plain text messages
  * `useSignEvmTypedData` - Sign EIP-712 typed data
  * `useSignEvmHash` - Sign message hashes
  * `useExportEvmAccount` - Export wallet private key

  Note: For a list of all EVM EOAs, call `useCurrentUser()` and read `currentUser?.evmAccounts`.

  ### Smart account operations

  * `useSendUserOperation` - Submit ERC-4337 user operations (batch calls) with optional Paymaster gas sponsorship

  Note: `useEvmAddress()` returns the Smart Account if one exists; otherwise it returns the owner's EOA.

  ### SDK state

  * `useIsInitialized` - Check if SDK is ready
  * `useConfig` - Access CDP configuration
</Accordion>

## Prerequisites

The fastest way to get started is to complete the [Quickstart](/embedded-wallets/quickstart). If you already have your own app, you should complete the prerequisites below before proceeding. You will need:

1. A [CDP Portal](https://portal.cdp.coinbase.com) account and CDP project
2. [Node.js 22+](https://nodejs.org/en/download) installed
3. Your local app domain [configured](/embedded-wallets/domains) in CDP Portal
4. A package manager of your choice, with `cdp-hooks` installed:

<CodeGroup>
  ```bash npm
  # With npm
  npm install @coinbase/cdp-core @coinbase/cdp-hooks
  ```

  ```bash pnpm
  # With pnpm
  pnpm add @coinbase/cdp-core @coinbase/cdp-hooks
  ```

  ```bash yarn
  # With yarn
  yarn add @coinbase/cdp-core @coinbase/cdp-hooks
  ```
</CodeGroup>

## 1. Setup hooks provider

If you're not using the demo app from the Quickstart, you'll need to manually set up the `CDPHooksProvider` in your application:

<Warning>
  **Using Next.js?** Check out our [Next.js integration guide](/embedded-wallets/nextjs) for `"use client"` requirements and common gotchas.
</Warning>

```tsx
import { CDPHooksProvider } from "@coinbase/cdp-hooks";

function App() {
  return (
    <CDPHooksProvider 
      config={{
        projectId: "your-project-id",
        basePath: "https://api.cdp.coinbase.com", // CDP API url
        useMock: false, // Use live APIs or use mock data for testing
        debugging: false, // Log API requests and responses
      }}
    >
      <YourApp />
    </CDPHooksProvider>
  );
}
```

Config options:

* `projectId` (required)
* `createAccountOnLogin` = `"evm-eoa" | "evm-smart"` (optional)
* `basePath` (optional API base URL)
* `useMock` (optional mock mode for local testing)
* `debugging` (optional verbose API logging)

### Smart account configuration (optional)

Enable automatic smart account creation on login:

```tsx
<CDPHooksProvider
  config={{
    projectId: "your-project-id",
    createAccountOnLogin: "evm-smart",
  }}
>
  <YourApp />
</CDPHooksProvider>
```

Learn more in the dedicated [Smart Accounts guide](/embedded-wallets/smart-accounts).

## 2. Ensure SDK initialization

Always ensure the SDK is initialized before authenticating a user or performing wallet operations:

```tsx
import { useIsInitialized } from "@coinbase/cdp-hooks";

function App() {
  const { isInitialized } = useIsInitialized();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return <Page />;
}
```

## Hook examples

Now let's explore how to use CDP hooks to build wallet functionality into your React application.

### User sign-in

Our authentication uses a two-step flow:

1. Submit user email to initiate the authentication flow, which will send the user a One-Time-Password (OTP) and return a `flowId`
2. Submit the six-digit OTP and `flowId`, after which the user will be authenticated, returning a User object

```tsx
import { useSignInWithEmail, useVerifyEmailOTP } from "@coinbase/cdp-hooks";

function SignIn() {
  const { signInWithEmail } = useSignInWithEmail();
  const { verifyEmailOTP } = useVerifyEmailOTP();

  const handleSignIn = async (email: string) => {
    try {
      // Start sign in flow
      const { flowId } = await signInWithEmail({ email });

      // Get OTP from user input...
      const otp = "123456";

      // Complete sign in
      const { user, isNewUser } = await verifyEmailOTP({
        flowId,
        otp
      });

      console.log("Signed in user:", user);
      console.log("User EVM address", user.evmAccounts[0]);
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return <button onClick={() => handleSignIn("user@example.com")}>Sign In</button>;
}
```

### View user profile

Display user information and wallet addresses using CDP hooks:

```tsx
import { useCurrentUser, useEvmAddress } from "@coinbase/cdp-hooks";

function Profile() {
  const { currentUser } = useCurrentUser();
  const { evmAddress: primaryAddress } = useEvmAddress();

  if (!currentUser) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>User ID: {currentUser.userId}</p>
      <p>Primary Address: {primaryAddress}</p>
      <p>All Accounts: {currentUser.evmAccounts.join(", ")}</p>
      {currentUser.evmSmartAccounts?.[0] && (
        <p>Smart Account: {currentUser.evmSmartAccounts[0]}</p>
      )}
    </div>
  );
}
```

### Send a transaction

We support signing and sending a blockchain transaction in a single action on the networks listed below. For other networks, see the [next section](#sign-and-broadcast-non-supported-networks).

* Base
* Base Sepolia
* Ethereum
* Ethereum Sepolia
* Arbitrum
* Avalanche
* Optimism
* Polygon

```tsx
import { useSendEvmTransaction, useEvmAddress } from "@coinbase/cdp-hooks";

function SendTransaction() {
  const { sendEvmTransaction } = useSendEvmTransaction();
  const { evmAddress } = useEvmAddress();

  const handleSend = async () => {
    if (!evmAddress) return;

    try {
      const result = await sendEvmTransaction({
        transaction: {
          to: evmAddress,              // Send to yourself for testing
          value: 1000000000000n,       // 0.000001 ETH in wei
          gas: 21000n,                 // Standard ETH transfer gas limit
          chainId: 84532,              // Base Sepolia
          type: "eip1559",             // Modern gas fee model
        },
        evmAccount: evmAddress,        // Your CDP wallet address
        network: "base-sepolia",       // Target network
      });

      console.log("Transaction hash:", result.transactionHash);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return <button onClick={handleSend}>Send Transaction</button>;
}
```

Note: This hook also returns a `data` state with statuses `idle | pending | success | error` that reflects the most recent transaction.

### Sign and broadcast (non-supported networks)

For networks other than those supported by the Send Transaction API, you can sign a transaction with the wallet and broadcast it yourself. This example uses the public client from `viem` to broadcast the transaction:

```tsx
import { useSignEvmTransaction, useEvmAddress } from "@coinbase/cdp-hooks";
import { http, createPublicClient } from "viem";
import { tron } from "viem/chains";

function NonBaseTransaction() {
  const { signEvmTransaction } = useSignEvmTransaction();
  const { evmAddress } = useEvmAddress();

  const handleSend = async () => {
    if (!evmAddress) return;

    try {
      // Sign the transaction
      const { signedTransaction } = await signEvmTransaction({
        evmAccount: evmAddress,
        transaction: {
          to: evmAddress,              // Send to yourself for testing
          value: 1000000000000n,       // 0.000001 ETH in wei
          gas: 21000n,                 // Standard ETH transfer gas limit
          chainId: 728126428,          // Tron
          type: "eip1559",             // Modern gas fee model
        }
      });

      // Broadcast using a different client
      const client = createPublicClient({
        chain: tron,
        transport: http()
      });

      const hash = await client.sendRawTransaction({
        serializedTransaction: signedTransaction
      });

      console.log("Transaction hash:", hash);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return <button onClick={handleSend}>Send Transaction</button>;
}
```

### Sign messages and typed data

You can sign EVM messages, hashes, and typed data to generate signatures for various on-chain applications:

```tsx
import { useSignEvmMessage, useSignEvmTypedData, useSignEvmHash, useEvmAddress } from "@coinbase/cdp-hooks";

function SignData() {
  const { signEvmMessage } = useSignEvmMessage();
  const { signEvmTypedData } = useSignEvmTypedData();
  const { signEvmHash } = useSignEvmHash();
  const { evmAddress } = useEvmAddress();

  const handleSignMessage = async () => {
    if (!evmAddress) return;

    const result = await signEvmMessage({
      evmAccount: evmAddress,
      message: "Hello World"
    });

    console.log("Message signature:", result.signature);
  };

  const handleSignTypedData = async () => {
    if (!evmAddress) return;

    const result = await signEvmTypedData({
      evmAccount: evmAddress,
      typedData: {
        domain: {
          name: "Example DApp",
          version: "1",
          chainId: 84532,
        },
        types: {
          Person: [
            { name: "name", type: "string" },
            { name: "wallet", type: "address" }
          ]
        },
        primaryType: "Person",
        message: {
          name: "Bob",
          wallet: evmAddress
        }
      }
    });

    console.log("Typed data signature:", result.signature);
  };

  const handleSignHash = async () => {
    if (!evmAddress) return;

    const result = await signEvmHash({
      evmAccount: evmAddress,
      hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    });

    console.log("Hash signature:", result.signature);
  };

  return (
    <div>
      <button onClick={handleSignMessage}>Sign Message</button>
      <button onClick={handleSignTypedData}>Sign Typed Data</button>
      <button onClick={handleSignHash}>Sign Hash</button>
    </div>
  );
}
```

### Export private keys

<Warning>
  Private key export is a high-risk security operation. See our comprehensive [Security & Export](/embedded-wallets/security-export) guide for proper implementation, security considerations, and best practices.
</Warning>

The `useExportEvmAccount` hook allows users to export their private key for wallet migration or other purposes. For detailed implementation examples and security guidance, see the [Security & Export](/embedded-wallets/security-export#implementation) documentation.

### Send a user operation (Smart Accounts)

Send user operations from Smart Accounts with support for multiple calls and paymaster sponsorship. The hook returns a method to execute the user operation and forwards `status`, `data`, and `error` from its internal tracking.

```tsx
import { useSendUserOperation, useCurrentUser } from "@coinbase/cdp-hooks";

function SendUserOperation() {
  const { sendUserOperation } = useSendUserOperation();
  const { currentUser } = useCurrentUser();

  const handleSendUserOperation = async () => {
    const smartAccount = currentUser?.evmSmartAccounts?.[0];
    if (!smartAccount) return;

    try {
      // This will automatically start tracking the user operation status
      const result = await sendUserOperation({
        evmSmartAccount: smartAccount,
        network: "base-sepolia",
        calls: [{
          to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          value: 1000000000000000000n,
          data: "0x",
        }],
      });

      console.log("User Operation Hash:", result.userOperationHash);
    } catch (error) {
      console.error("Failed to send user operation:", error);
    }
  };

  return <button onClick={handleSendUserOperation}>Send User Operation</button>;
}
```

The hook returns the `sendUserOperation` method, which you call with the transaction parameters that you want to send. The hook also returns `status`, `data`, and `error` values which you can use to track the status of the user operation. For more information, see the [Smart Accounts guide](/embedded-wallets/smart-accounts#send-a-user-operation).

## What to read next

* [**CDP Web SDK Documentation**](/sdks/cdp-sdks-v2/react): Comprehensive API reference for the CDP Web SDK
* [**Embedded Wallet - React Components**](/embedded-wallets/react-components): Pre-built UI components that work seamlessly with these hooks
* [**Embedded Wallet - Wagmi Integration**](/embedded-wallets/wagmi): Use CDP wallets with the popular wagmi library
* [**Embedded Wallet - Next.js**](/embedded-wallets/nextjs): Special considerations for Next.js applications
* [**Embedded Wallet - Smart Accounts**](/embedded-wallets/smart-accounts): Dedicated guide for ERC-4337 features and paymasters (spend permissions coming soon)
