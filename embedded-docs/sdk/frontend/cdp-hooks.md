# @coinbase/cdp-hooks

This package provides React hooks for conveniently accessing embedded wallet functionality.
Built on top of `@coinbase/cdp-core`, it offers a React-friendly interface for end user authentication
and embedded wallet operations.

## Quickstart

This guide will help you get started with @coinbase/cdp-hooks. You'll learn how to install the package, set up the provider, and use the hooks in both web and React Native applications.

### Installation

#### Web Applications

For web applications, add the package to your project using your preferred package manager:

```bash
# With npm
npm install @coinbase/cdp-core @coinbase/cdp-hooks

# With pnpm
pnpm add @coinbase/cdp-core @coinbase/cdp-hooks

# With yarn
yarn add @coinbase/cdp-core @coinbase/cdp-hooks
```

#### React Native Applications

For React Native applications, you'll need additional crypto polyfills and dependencies:

```bash
# Core packages
npm install @coinbase/cdp-core @coinbase/cdp-hooks

# Install this polyfill with expo for better compatibility
npx expo install react-native-quick-crypto

# Required crypto polyfills for React Native
npm install react-native-get-random-values @ungap/structured-clone

# AsyncStorage for React Native storage
npm install @react-native-async-storage/async-storage
```

**React Native Setup Code**

You'll need to initialize the crypto polyfills before importing your app. Create or update your entry point file (typically `index.js` or `index.ts`):

```typescript
import structuredClone from "@ungap/structured-clone";
import { install } from "react-native-quick-crypto";
import "react-native-get-random-values";

// Install crypto polyfills
if (!("structuredClone" in globalThis)) {
  globalThis.structuredClone = structuredClone as any;
}

install(); // Install react-native-quick-crypto

// Import your app after polyfills are installed
import App from "./App";

// Register your app component
import { registerRootComponent } from "expo"; // For Expo apps
registerRootComponent(App);
```

**Why these dependencies?**

* `react-native-quick-crypto`: Provides Web Crypto API compatibility for asymmetric key generation (ECDSA, RSA) required for JWT signing and encryption
* `react-native-get-random-values`: Provides secure random number generation via `crypto.getRandomValues()`
* `@ungap/structured-clone`: Polyfills `structuredClone` for object cloning compatibility
* `@react-native-async-storage/async-storage`: Provides persistent storage for auth tokens and secrets

### Gather your CDP Project Information

1. Sign in or create an account on the [CDP Portal](https://portal.cdp.coinbase.com)
2. On your dashboard, select a project from the dropdown at the at the top, and copy the Project ID

### Allowlist your local app

1. Navigate to the [Embedded Wallet Configuration](https://portal.cdp.coinbase.com/products/embedded-wallets/cors)
   in CDP Portal, and click Add origin to include your local app
2. Enter the origin of your locally running app - e.g., `http://localhost:3000`
3. Click Add origin again to save your changes

### Setup Provider

Next, you need to wrap your application with the CDPHooksProvider, which provides the necessary context for
hooks to work correctly.

#### Web Applications

Update your main application file (e.g., main.tsx) to include the provider:

```tsx lines
import React from "react";
import { CDPHooksProvider } from "@coinbase/cdp-hooks";
import { App } from './App'; // Your main App component

function App() {
  return (
    <CDPHooksProvider 
      config={{
        // Copy and paste your project ID here.
        projectId: "your-project-id",
      }}
    >
      <App />
    </CDPHooksProvider>
  );
}
```

#### React Native Applications

For React Native, the setup is identical.

```tsx lines
import React from "react";
import { CDPHooksProvider } from "@coinbase/cdp-hooks";
import { App } from "./App";

export default function App() {
  return (
    <CDPHooksProvider config={{
      projectId: "your-project-id",
    }}>
      <App />
    </CDPHooksProvider>
  );
}
```

#### Smart Account Configuration

You can configure the provider to automatically create Smart Accounts for new users:

```tsx lines
function App() {
  return (
    <CDPHooksProvider
      config={{
        projectId: "your-project-id",
        ethereum: {
          createOnLogin: "smart", // Creates Smart Accounts instead of EOAs
        },
      }}
    >
      <App />
    </CDPHooksProvider>
  );
}
```

* When `ethereum.createOnLogin` is set to `"smart"`, new users will automatically get both an EOA and a Smart Account.

#### Solana Configuration

You can configure the provider to create Solana accounts for new users:

```tsx lines
function App() {
  return (
    <CDPHooksProvider
      config={{
        projectId: "your-project-id",
        solana: {
          createOnLogin: true, // Creates Solana accounts
        },
      }}
    >
      <App />
    </CDPHooksProvider>
  );
}
```

* When `solana.createOnLogin` is set to `true`, new users will automatically get a Solana account instead of EVM accounts.

### Sign In a User

End user authentication proceeds in two steps:

1. The user inputs their email address to initiate the authentication flow, which will send the user a One Time Password (OTP) and return a `flowId`
2. The user submits the six-digit OTP and `flowId`, after which the user will be authenticated, returning a User object.

#### Web Applications

```tsx lines
import { useSignInWithEmail, useVerifyEmailOTP } from "@coinbase/cdp-hooks";

function SignIn() {
  const { signInWithEmail } = useSignInWithEmail();
  const { verifyEmailOTP } = useVerifyEmailOTP();

  const handleSignIn = async (email: string) => {
    try {
      // Start sign in flow
      const { flowId } = await signInWithEmail({ email });

      // In a real application, you would prompt the user for the OTP they received
      // in their email. Here, we hardcode it for convenience.
      const otp = "123456";

      // Complete sign in
      const { user, isNewUser } = await verifyEmailOTP({
        flowId,
        otp
      });

      console.log("Signed in user:", user);
      
      // Access different account types based on configuration
      if (user.evmAccounts?.length > 0) {
        console.log("User EVM address (EOA):", user.evmAccounts[0]);
      }
      if (user.evmSmartAccounts?.length > 0) {
        console.log("User Smart Account:", user.evmSmartAccounts[0]);
      }
      if (user.solanaAccounts?.length > 0) {
        console.log("User Solana address:", user.solanaAccounts[0]);
      }
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return <button onClick={() => handleSignIn("user@example.com")}>Sign In</button>;
}
```

#### React Native Applications

For React Native, you'll use native UI components and handle the sign-in flow similarly:

```tsx lines
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useSignInWithEmail, useVerifyEmailOTP } from "@coinbase/cdp-hooks";

function SignInScreen() {
  const { signInWithEmail } = useSignInWithEmail();
  const { verifyEmailOTP } = useVerifyEmailOTP();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [flowId, setFlowId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter an email address");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signInWithEmail({ email });
      setFlowId(result.flowId);
      Alert.alert("Success", "OTP sent to your email!");
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || !flowId) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }

    setIsLoading(true);
    try {
      const { user } = await verifyEmailOTP({ flowId, otp });
      Alert.alert("Success", "Successfully signed in!");
      console.log("Signed in user:", user);
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
        style={{ borderWidth: 1, borderColor: "#ddd", padding: 12, marginBottom: 16 }}
      />

      <TouchableOpacity
        onPress={handleSignIn}
        disabled={isLoading}
        style={{
          backgroundColor: "#007AFF",
          padding: 15,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 12,
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
          {isLoading ? "Sending..." : "Sign In with Email"}
        </Text>
      </TouchableOpacity>

      {flowId && (
        <>
          <Text>Enter OTP from email:</Text>
          <TextInput
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter 6-digit OTP"
            keyboardType="number-pad"
            maxLength={6}
            editable={!isLoading}
            style={{ borderWidth: 1, borderColor: "#ddd", padding: 12, marginBottom: 16 }}
          />

          <TouchableOpacity
            onPress={handleVerifyOTP}
            disabled={isLoading}
            style={{
              backgroundColor: "#007AFF",
              padding: 15,
              borderRadius: 8,
              alignItems: "center",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
```

### View User Information

Once the end user has signed in, you can display their information in your application:

```tsx lines
import { useCurrentUser, useEvmAddress } from "@coinbase/cdp-hooks";

function UserInformation() {
  const { currentUser: user } = useCurrentUser();
  const { evmAddress } = useEvmAddress();

  if (!user) {
    return <div>Please sign in</div>;
  }

  const emailAddress = user.authenticationMethods.email?.email;

  return (
    <div>
      <h2>User Information</h2>
      <p>User ID: {user.userId}</p>

      <>
        <p>EVM Address (EOA): {evmAddress}</p>
        {user.evmSmartAccounts?.[0] && (
          <p>Smart Account: {user.evmSmartAccounts[0]}</p>
        )}
      </>

      {emailAddress && <p>Email Address: {emailAddress}</p>}
    </div>
  );
}
```

### Working with Solana

When your application is configured with `solana: { createOnLogin: true }`, you can use Solana-specific hooks to interact with Solana accounts.

#### Access Solana Address

Use the `useSolanaAddress` hook to get the user's primary Solana address:

```tsx lines
import { useSolanaAddress } from "@coinbase/cdp-hooks";

function SolanaWallet() {
  const { solanaAddress } = useSolanaAddress();

  if (!solanaAddress) {
    return <div>No Solana wallet connected</div>;
  }

  return (
    <div>
      <h3>Your Solana Wallet</h3>
      <p>Address: {solanaAddress}</p>
    </div>
  );
}
```

#### Sign a Solana Transaction

Use the `useSignSolanaTransaction` hook to sign Solana transactions:

```tsx lines
import { useSignSolanaTransaction, useSolanaAddress } from "@coinbase/cdp-hooks";

function SolanaTransactionSigner() {
  const { signSolanaTransaction } = useSignSolanaTransaction();
  const { solanaAddress } = useSolanaAddress();

  const handleSignTransaction = async () => {
    if (!solanaAddress) return;

    try {
      const result = await signSolanaTransaction({
        solanaAccount: solanaAddress,
        transaction: "base64-encoded-solana-transaction"  // Your Solana transaction here
      });
      
      console.log("Signed Transaction:", result.signedTransaction);
      // The signedTransaction can now be broadcast to the Solana network
    } catch (error) {
      console.error("Failed to sign transaction:", error);
    }
  };

  if (!solanaAddress) {
    return <div>Please connect your Solana wallet first</div>;
  }

  return (
    <div>
      <h3>Sign Solana Transaction</h3>
      <button onClick={handleSignTransaction}>
        Sign Transaction
      </button>
    </div>
  );
}
```

#### Sign a Solana Message

Use the `useSignSolanaMessage` hook to sign arbitrary messages with Solana accounts:

```tsx lines
import { useSignSolanaMessage, useSolanaAddress } from "@coinbase/cdp-hooks";

function SolanaMessageSigner() {
  const { signSolanaMessage } = useSignSolanaMessage();
  const { solanaAddress } = useSolanaAddress();

  const handleSignMessage = async () => {
    if (!solanaAddress) return;

    try {
      const message = Buffer.from("Hello, Solana!", "utf8").toString("base64");
      const result = await signSolanaMessage({
        solanaAccount: solanaAddress,
        message // Base64 encoded message to sign
      });

      console.log("Message Signature:", result.signature);
      // The signature can be used for authentication or verification purposes
    } catch (error) {
      console.error("Failed to sign message:", error);
    }
  };

  if (!solanaAddress) {
    return <div>Please connect your Solana wallet first</div>;
  }

  return (
    <div>
      <h3>Sign Solana Message</h3>
      <button onClick={handleSignMessage}>
        Sign Message
      </button>
    </div>
  );
}
```

#### Send a Solana Transaction

Use the `useSendSolanaTransaction` hook to sign and send Solana transactions in a single action. This is supported on:

* Solana Mainnet
* Solana Devnet

```tsx lines
import { useSendSolanaTransaction, useSolanaAddress } from "@coinbase/cdp-hooks";

function SolanaTransactionSender() {
  const { sendSolanaTransaction } = useSendSolanaTransaction();
  const { solanaAddress } = useSolanaAddress();

  const handleSendTransaction = async () => {
    if (!solanaAddress) return;

    try {
      const result = await sendSolanaTransaction({
        solanaAccount: solanaAddress,
        network: "solana-devnet", // or "solana" for mainnet
        transaction: "base64-encoded-solana-transaction"  // Your Solana transaction here
      });
      
      console.log("Transaction Signature:", result.transactionSignature);
      // The transaction has been broadcast to the Solana network
    } catch (error) {
      console.error("Failed to send transaction:", error);
    }
  };

  if (!solanaAddress) {
    return <div>Please connect your Solana wallet first</div>;
  }

  return (
    <div>
      <h3>Send Solana Transaction</h3>
      <button onClick={handleSendTransaction}>
        Send Transaction
      </button>
    </div>
  );
}
```

### Send a Transaction

We support signing and sending a Blockchain transaction in a single action on the following networks:

* Base
* Base Sepolia
* Ethereum
* Ethereum Sepolia
* Avalanche
* Arbitrum
* Optimism
* Polygon

```tsx lines
import { useSendEvmTransaction, useEvmAddress } from "@coinbase/cdp-hooks";

function SendTransaction() {
  const { sendEvmTransaction: sendTransaction } = useSendEvmTransaction();
  const { evmAddress } = useEvmAddress();

  const handleSend = async () => {
    if (!evmAddress) return;

    try {
      const result = await sendTransaction({
        evmAccount: evmAddress,
        transaction: {
          to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          value: 100000000000000n, // 0.0001 ETH in wei
          nonce: 0,
          gas: 21000n,
          maxFeePerGas: 30000000000n,
          maxPriorityFeePerGas: 1000000000n,
          chainId: 84532, // Base Sepolia
          type: "eip1559",
        }
      });

      console.log("Transaction hash:", result.transactionHash);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return <button onClick={handleSend}>Send Transaction</button>;
}
```

For networks other than those supported by the CDP APIs, your end user must sign the transaction, and then
you must broadcast the transaction yourself. This example uses the public client from `viem` to broadcast the transaction.

```tsx lines
import { useSignEvmTransaction, useEvmAddress } from "@coinbase/cdp-hooks";
import { http, createPublicClient } from "viem";
import { tron } from "viem/chains";

function CrossChainTransaction() {
  const { signEvmTransaction: signTransaction } = useSignEvmTransaction();
  const { evmAddress } = useEvmAddress();

  const handleSend = async () => {
    if (!evmAddress) return;

    try {
      // Sign the transaction
      const { signedTransaction } = await signTransaction({
        evmAccount: evmAddress,
        transaction: {
          to: "0x...",
          value: 100000000000000n,
          nonce: 0,
          gas: 21000n,
          maxFeePerGas: 30000000000n,
          maxPriorityFeePerGas: 1000000000n,
          chainId: 728126428, // Tron
          type: "eip1559",
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

### Sign Messages and Typed Data

End users can sign EVM messages, hashes, and typed data to generate signatures for various onchain applications.

```tsx lines
import { useSignEvmMessage, useSignEvmTypedData, useEvmAddress } from "@coinbase/cdp-hooks";

function SignData() {
  const { signEvmMessage: signMessage } = useSignEvmMessage();
  const { signEvmTypedData: signTypedData } = useSignEvmTypedData();
  const { signEvmHash: signHash } = useSignEvmHash();
  const { evmAddress } = useEvmAddress();

  const handleSignHash = async () => {
    if (!evmAddress) return;

    const result = await signMessage({
      evmAccount: evmAddress,
      message: "Hello World"
    });

    console.log("Message signature:", result.signature);
  }

  const handleSignMessage = async () => {
    if (!evmAddress) return;

    const result = await signMessage({
      evmAccount: evmAddress,
      message: "Hello World"
    });

    console.log("Message signature:", result.signature);
  };

  const handleSignTypedData = async () => {
    if (!evmAddress) return;

    const result = await signTypedData({
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

  return (
    <div>
      <button onClick={handleSignMessage}>Sign Message</button>
      <button onClick={handleSignTypedData}>Sign Typed Data</button>
      <button onClick={handleSignHash}>Sign Hash</button>
    </div>
  );
}
```

### Export Private Keys

End users can export their private keys from their embedded wallet, allowing them to import them into compatible wallets of their choice.

#### Export EVM Private Key

```tsx lines
import { useExportEvmAccount, useEvmAddress } from "@coinbase/cdp-hooks";

function ExportEvmKey() {
  const { exportEvmAccount: exportAccount } = useExportEvmAccount();
  const { evmAddress } = useEvmAddress();

  const handleExport = async () => {
    if (!evmAddress) return;

    try {
      const { privateKey } = await exportAccount({
        evmAccount: evmAddress
      });

      console.log("EVM Private Key:", privateKey);
      // Warning: Handle private keys with extreme care!
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return <button onClick={handleExport}>Export EVM Private Key</button>;
}
```

#### Export Solana Private Key

When your application is configured with `solana: { createOnLogin: true }`, you can export Solana private keys:

```tsx lines
import { useExportSolanaAccount, useSolanaAddress } from "@coinbase/cdp-hooks";

function ExportSolanaKey() {
  const { exportSolanaAccount: exportAccount } = useExportSolanaAccount();
  const { solanaAddress } = useSolanaAddress();

  const handleExport = async () => {
    if (!solanaAddress) return;

    try {
      const { privateKey } = await exportAccount({
        solanaAccount: solanaAddress
      });

      console.log("Solana Private Key:", privateKey);
      // Warning: Handle private keys with extreme care!
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  if (!solanaAddress) {
    return <div>Please connect your Solana wallet first</div>;
  }

  return <button onClick={handleExport}>Export Solana Private Key</button>;
}
```

### Smart Account Operations

Smart Accounts provide advanced account abstraction features with React hooks.

#### Send User Operations

Send user operations from Smart Accounts with support for multiple calls and paymaster sponsorship. The hook returns a method to execute the user operation and `status`, `data`, and `error` properties to read the result of the user operation:

```tsx lines
import { useSendUserOperation, useCurrentUser } from "@coinbase/cdp-hooks";

function SendUserOperation() {
  const { sendUserOperation, status, data, error } = useSendUserOperation();
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

  return (
    <div>
      {status === "idle" && <p>Ready to send user operation</p>}
      
      {status === "pending" && (
        <div>
          <p>User operation pending...</p>
          {data && <p>User Op Hash: {data.userOpHash}</p>}
        </div>
      )}
      
      {status === "success" && data && (
        <div>
          <p>User operation successful!</p>
          <p>Transaction Hash: {data.transactionHash}</p>
          <p>Status: {data.status}</p>
        </div>
      )}
      
      {status === "error" && (
        <div>
          <p>User operation failed</p>
          <p>Error: {error?.message}</p>
        </div>
      )}
      
      <button onClick={handleSendUserOperation} disabled={status === "pending"}>
        {status === "pending" ? "Sending..." : "Send User Operation"}
      </button>
    </div>
  );
}
```

#### Track User Operation Status

Use the `useWaitForUserOperation` hook to poll for user operation status and provide real-time updates. This hook immediately fires off a query to get the result of the user operation:

```tsx lines
import { useWaitForUserOperation, useState } from "react";

function WaitForUserOperation() {
  const { status, data, error } = useWaitForUserOperation({
    userOperationHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    evmSmartAccount: "0x1234567890123456789012345678901234567890",
    network: "base-sepolia"
  });

  return (
    <div>
      {status === "idle" && <p>No user operation being tracked</p>}
      
      {status === "pending" && (
        <div>
          <p>User operation pending...</p>
          {data && <p>User Op Hash: {data.userOpHash}</p>}
        </div>
      )}
      
      {status === "success" && data && (
        <div>
          <p>User operation successful!</p>
          <p>Transaction Hash: {data.transactionHash}</p>
          <p>Status: {data.status}</p>
        </div>
      )}
      
      {status === "error" && (
        <div>
          <p>User operation failed</p>
          <p>Error: {error?.message}</p>
        </div>
      )}
    </div>
  );
}
```

#### Conditional Polling

You can control when the `useWaitForUserOperation` hook should start polling using the `enabled` parameter:

```tsx lines
function ConditionalWaitForUserOperation() {
  const [shouldPoll, setShouldPoll] = useState(false);
  
  const { status, data, error } = useWaitForUserOperation({
    userOperationHash: "0x1234...",
    evmSmartAccount: "0x5678...", 
    network: "base-sepolia",
    enabled: shouldPoll // Only poll when this is true
  });

  return (
    <div>
      <button onClick={() => setShouldPoll(true)}>
        Start Polling
      </button>
      <button onClick={() => setShouldPoll(false)}>
        Stop Polling  
      </button>
      
      <p>Status: {status}</p>
      {data && <p>User Operation Status: {data.status}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

## Functions

### useConfig()

```ts
function useConfig(): object;
```

Hook to get the CDP being used by the SDK.

#### Returns

`object`

##### config

```ts
config: Config;
```

#### Example

```tsx lines
function App() {
  const { config } = useConfig();

  return (
    <div>
      <p>Project ID: {config.projectId}</p>
    </div>
  );
}
```

***

### useIsInitialized()

```ts
function useIsInitialized(): object;
```

Hook to check if the CDP client has been properly initialized.
This should be used before attempting any CDP operations to ensure the client is ready.

#### Returns

`object`

##### isInitialized

```ts
isInitialized: boolean;
```

#### Example

```tsx lines
function LoadingGuard({ children }) {
  const { isInitialized } = useIsInitialized();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return children;
}
```

***

### useSignInWithEmail()

```ts
function useSignInWithEmail(): object;
```

Hook that provides access to the email-based sign-in functionality.
This is the first step in the email authentication flow.

#### Returns

`object`

##### signInWithEmail()

```ts
signInWithEmail: (options) => Promise<SignInWithEmailResult>;
```

###### Parameters

| Parameter | Type                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------- |
| `options` | [`SignInWithEmailOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#signinwithemailoptions) |

###### Returns

`Promise`\<[`SignInWithEmailResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#signinwithemailresult)>

#### Example

```tsx lines
function SignInForm() {
  const [email, setEmail] = useState("");
  const [flowId, setFlowId] = useState("");
  const { signInWithEmail } = useSignInWithEmail();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmail({ email });
      setFlowId(result.flowId);
    } catch (error) {
      console.error("Failed to sign in:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        aria-label="Enter your email"
      />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

***

### useSignInWithSms()

```ts
function useSignInWithSms(): object;
```

Hook that provides access to the SMS-based sign-in functionality.
This is the first step in the SMS authentication flow.

#### Returns

`object`

##### signInWithSms()

```ts
signInWithSms: (options) => Promise<SignInWithSmsResult>;
```

###### Parameters

| Parameter | Type                   |
| --------- | ---------------------- |
| `options` | `SignInWithSmsOptions` |

###### Returns

`Promise`\<`SignInWithSmsResult`>

#### Example

```tsx lines
function SignInForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [flowId, setFlowId] = useState("");
  const { signInWithSms } = useSignInWithSms();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithSms({ phoneNumber });
      setFlowId(result.flowId);
    } catch (error) {
      console.error("Failed to sign in:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Enter your phone number"
        aria-label="Enter your phone number"
      />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

***

### useVerifyEmailOTP()

```ts
function useVerifyEmailOTP(): object;
```

Hook that provides access to the email OTP verification functionality.
This is the second step in the email authentication flow, used after signInWithEmail.

#### Returns

`object`

##### verifyEmailOTP()

```ts
verifyEmailOTP: (options) => Promise<VerifyEmailOTPResult>;
```

###### Parameters

| Parameter | Type                                                                                            |
| --------- | ----------------------------------------------------------------------------------------------- |
| `options` | [`VerifyEmailOTPOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#verifyemailotpoptions) |

###### Returns

`Promise`\<[`VerifyEmailOTPResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#verifyemailotpresult)>

#### Example

```tsx lines
function OTPVerification(flowId: string) {
  const [otp, setOTP] = useState("");
  const { verifyEmailOTP } = useVerifyEmailOTP();

  const otpIsValid = useMemo(() => {
    // Check if the OTP is a 6 digit number
    return /^[0-9]{6}$/.test(otp);
  }, [otp]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { user } = await verifyEmailOTP({
        flowId,
        otp
      });

      // Handle the result
      console.log(user);
    } catch (error) {
      console.error("Failed to verify OTP:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOTP(e.target.value)}
        placeholder="Enter OTP from email"
        aria-label="Enter OTP from email"
      />
      <button type="submit" disabled={!otpIsValid}>Verify OTP</button>
    </form>
  );
}
```

***

### useVerifySmsOTP()

```ts
function useVerifySmsOTP(): object;
```

Hook that provides access to the SMS OTP verification functionality.
This is the second step in the SMS authentication flow, used after signInWithSms.

#### Returns

`object`

##### verifySmsOTP()

```ts
verifySmsOTP: (options) => Promise<VerifySmsOTPResult>;
```

###### Parameters

| Parameter | Type                  |
| --------- | --------------------- |
| `options` | `VerifySmsOTPOptions` |

###### Returns

`Promise`\<`VerifySmsOTPResult`>

#### Example

```tsx lines
function OTPVerification(flowId: string) {
  const [otp, setOTP] = useState("");
  const { verifySmsOTP } = useVerifySmsOTP();

  const otpIsValid = useMemo(() => {
    // Check if the OTP is a 6 digit number
    return /^[0-9]{6}$/.test(otp);
  }, [otp]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { user } = await verifySmsOTP({
        flowId,
        otp
      });

      // Handle the result
      console.log(user);
    } catch (error) {
      console.error("Failed to verify OTP:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOTP(e.target.value)}
        placeholder="Enter OTP from SMS"
        aria-label="Enter OTP from SMS"
      />
      <button type="submit" disabled={!otpIsValid}>Verify OTP</button>
    </form>
  );
}
```

***

### useIsSignedIn()

```ts
function useIsSignedIn(): object;
```

Hook to check if a user is currently signed in.
Use this to gate authenticated-only features in your application.

#### Returns

`object`

##### isSignedIn

```ts
isSignedIn: boolean;
```

#### Example

```tsx lines
function AuthGuard({ children }) {
  const { isSignedIn } = useIsSignedIn();

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  return children;
}
```

***

### useCurrentUser()

```ts
function useCurrentUser(): object;
```

Hook to access the currently authenticated user's information.

#### Returns

`object`

##### currentUser

```ts
currentUser: 
  | null
  | User;
```

#### Example

```tsx lines
function UserProfile() {
  const { currentUser } = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>User ID: {currentUser.userId}</p>
      <p>EVM Accounts: {currentUser.evmAccounts.join(", ")}</p>
    </div>
  );
}
```

***

### useSignOut()

```ts
function useSignOut(): object;
```

Hook that provides a wrapped sign-out function with authentication checks.
This hook uses useEnforceAuthenticated to ensure the user is signed in before attempting to sign out.

#### Returns

`object`

##### signOut()

```ts
signOut: () => Promise<void>;
```

###### Returns

`Promise`\<`void`>

#### Example

```tsx lines
function SignOutButton() {
  const { signOut } = useSignOut();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/sign-in");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <button onClick={handleSignOut}>
      Sign Out
    </button>
  );
}
```

***

### useGetAccessToken()

```ts
function useGetAccessToken(): object;
```

Hook to get the access token for the current user.

#### Returns

`object`

Function to get the access token for the current user

##### getAccessToken()

```ts
getAccessToken: () => Promise<null | string>;
```

###### Returns

`Promise`\<`null` | `string`>

#### Example

```tsx lines
const { getAccessToken } = useGetAccessToken();

const handleGetAccessToken = async () => {
  const accessToken = await getAccessToken();
  console.log("Access Token:", accessToken);
};
```

***

### useEvmAddress()

```ts
function useEvmAddress(): object;
```

Hook to access the user's primary EVM (Ethereum Virtual Machine) address.
If the user has a Smart Account, this will return the Smart Account address.
If the user has an EOA, this will return the EOA address.
If the user has neither, this will return null.

#### Returns

`object`

##### evmAddress

```ts
evmAddress: null | `0x${string}`;
```

#### Example

```tsx lines
function EVMWalletInfo() {
  const { evmAddress } = useEvmAddress();

  if (!evmAddress) {
    return <p>No EVM wallet connected</p>;
  }

  return (
    <div>
      <h3>Your EVM Wallet</h3>
      <p>Address: {evmAddress}</p>
    </div>
  );
}
```

***

### useSolanaAddress()

```ts
function useSolanaAddress(): object;
```

Hook to access the user's primary Solana address.
Returns the first Solana address associated with the user's account.
If the user has no Solana accounts, this will return null.

#### Returns

`object`

##### solanaAddress

```ts
solanaAddress: null | string;
```

#### Example

```tsx lines
function SolanaWalletInfo() {
  const { solanaAddress } = useSolanaAddress();

  if (!solanaAddress) {
    return <p>No Solana wallet connected</p>;
  }

  return (
    <div>
      <h3>Your Solana Wallet</h3>
      <p>Address: {solanaAddress}</p>
    </div>
  );
}
```

***

### useSignEvmHash()

```ts
function useSignEvmHash(): object;
```

Hook that provides a wrapped function to sign EVM messages with authentication checks.
This hook uses useEnforceAuthenticated to ensure the user is signed in before attempting to sign.

#### Returns

`object`

##### signEvmHash()

```ts
signEvmHash: (options) => Promise<SignEvmHashResult>;
```

###### Parameters

| Parameter | Type                                                                                      |
| --------- | ----------------------------------------------------------------------------------------- |
| `options` | [`SignEvmHashOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#signevmhashoptions) |

###### Returns

`Promise`\<[`SignEvmHashResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#signevmhashresult)>

#### Example

```tsx lines
function SignHash() {
  const { signEvmHash } = useSignEvmHash();
  const { evmAddress } = useEvmAddress();

  const handleSign = async () => {
    if (!evmAddress) return;

    try {
      const result = await signEvmHash({
        evmAccount: evmAddress,
        hash: "0x3ea2f1d0abf3fc66cf29eebb70cbd4e7fe762ef8a09bcc06c8edf641230afec0"
      });
      console.log("Signature:", result.signature);
    } catch (error) {
      console.error("Failed to sign hash:", error);
    }
  };

  return (
    <button onClick={handleSign}>Sign Hash</button>
  );
}
```

***

### useSignEvmTransaction()

```ts
function useSignEvmTransaction(): object;
```

Hook that provides a wrapped function to sign EVM transactions with authentication checks.
This hook uses useEnforceAuthenticated to ensure the user is signed in before attempting to sign.

#### Returns

`object`

##### signEvmTransaction()

```ts
signEvmTransaction: (options) => Promise<SignEvmTransactionResult>;
```

###### Parameters

| Parameter | Type                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------- |
| `options` | [`SignEvmTransactionOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#signevmtransactionoptions) |

###### Returns

`Promise`\<[`SignEvmTransactionResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#signevmtransactionresult)>

#### Example

```tsx lines
function SignTransaction() {
  const { signEvmTransaction } = useSignEvmTransaction();
  const { evmAddress } = useEvmAddress();

  const handleSign = async () => {
    if (!evmAddress) return;

    try {
      const result = await signEvmTransaction({
        evmAccount: evmAddress,
        transaction: {
          to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          value: 100000000000000n, // 0.0001 ETH in wei
          nonce: 0,
          gas: 21000n,
          maxFeePerGas: 30000000000n,
          maxPriorityFeePerGas: 1000000000n,
          chainId: 84532, // Base Sepolia
          type: "eip1559"
        }
      });
      console.log("Signed Transaction:", result.signedTransaction);
    } catch (error) {
      console.error("Failed to sign transaction:", error);
    }
  };

  return (
    <button onClick={handleSign}>Sign Transaction</button>
  );
}
```

***

### useSendEvmTransaction()

```ts
function useSendEvmTransaction(): object;
```

Hook that provides a wrapped function to send EVM transactions with authentication checks.
This hook uses useEnforceAuthenticated to ensure the user is signed in before attempting to send.
The hook internally waits for transactions to succeed and returns the related success/error
via the `data` discriminated union object.

Note: The `data` returned from the hook only represents the *last* sent transaction. If you wish to
call one instance of the hook multiple times in quick succession it is recommended to save the
txHash returned from `sendEvmTransaction` yourself and handle waiting for the receipt.

#### Returns

`object`

##### sendEvmTransaction()

```ts
sendEvmTransaction: (options) => Promise<SendEvmTransactionResult>;
```

###### Parameters

| Parameter | Type                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------- |
| `options` | [`SendEvmTransactionOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#sendevmtransactionoptions) |

###### Returns

`Promise`\<[`SendEvmTransactionResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#sendevmtransactionresult)>

##### data

```ts
data: TransactionState;
```

#### Example

```tsx lines
function SendTransaction() {
  const { sendEvmTransaction, data } = useSendEvmTransaction();
  const { evmAddress } = useEvmAddress();

  const handleSend = async () => {
    if (!evmAddress) return;

    try {
      const result = await sendEvmTransaction({
        evmAccount: evmAddress,
        network: "base-sepolia",
        transaction: {
          to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          value: 100000000000000n, // 0.0001 ETH in wei
          nonce: 0,
          gas: 21000n,
          maxFeePerGas: 30000000000n,
          maxPriorityFeePerGas: 1000000000n,
          chainId: 84532, // Base Sepolia
          type: "eip1559"
        }
      });
      console.log("Transaction Hash:", result.transactionHash);
    } catch (error) {
      console.error("Failed to send transaction:", error);
    }
  };

  return (
    <div>
      {(() => {
        switch (data.status) {
          case "idle":
            return <p>No transaction in progress</p>;
          case "pending":
            return (
              <div>
                <p>Transaction pending...</p>
                <p>Hash: {data.hash}</p>
              </div>
            );
          case "success":
            return (
              <div>
                <p>Transaction successful!</p>
                <p>Block: {data.receipt.blockNumber.toString()}</p>
                <p>Gas used: {data.receipt.gasUsed.toString()}</p>
              </div>
            );
          case "error":
            return (
              <div>
                <p>Transaction failed</p>
                <p>Error: {data.error.message}</p>
              </div>
            );
        }
      })()}
    </div>
    <button onClick={handleSend}>Send Transaction</button>
  );
}
```

***

### useSignEvmMessage()

```ts
function useSignEvmMessage(): object;
```

Hook that provides a wrapped function to sign EVM messages with authentication checks.
This hook uses useEnforceAuthenticated to ensure the user is signed in before attempting to sign.

#### Returns

`object`

##### signEvmMessage()

```ts
signEvmMessage: (options) => Promise<SignEvmMessageResult>;
```

###### Parameters

| Parameter | Type                                                                                            |
| --------- | ----------------------------------------------------------------------------------------------- |
| `options` | [`SignEvmMessageOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#signevmmessageoptions) |

###### Returns

`Promise`\<[`SignEvmMessageResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#signevmmessageresult)>

#### Example

```tsx lines
function SignMessage() {
  const { signEvmMessage } = useSignEvmMessage();
  const { evmAddress } = useEvmAddress();

  const handleSign = async () => {
    if (!evmAddress) return;

    try {
      const result = await signEvmMessage({
        evmAccount: evmAddress,
        message: "Welcome to our dApp! Click to sign in."
      });
      console.log("Signature:", result.signature);
    } catch (error) {
      console.error("Failed to sign message:", error);
    }
  };

  return (
    <button onClick={handleSign}>Sign Message</button>
  );
}
```

***

### useSignSolanaMessage()

```ts
function useSignSolanaMessage(): object;
```

Hook that provides a wrapped function to sign messages with a Solana account with authentication checks.
This hook uses useEnforceAuthenticated to ensure the user is signed in before attempting to sign.

#### Returns

`object`

##### signSolanaMessage()

```ts
signSolanaMessage: (options) => Promise<SignSolanaMessageResult>;
```

###### Parameters

| Parameter | Type                       |
| --------- | -------------------------- |
| `options` | `SignSolanaMessageOptions` |

###### Returns

`Promise`\<`SignSolanaMessageResult`>

#### Example

```tsx lines
function SignSolanaMessage() {
  const { signSolanaMessage } = useSignSolanaMessage();
  const { solanaAddress } = useSolanaAddress();

  const handleSign = async () => {
    if (!solanaAddress) return;

    try {
      const result = await signSolanaMessage({
        solanaAccount: solanaAddress,
        message: "Welcome to our dApp! Click to sign in."
      });
      console.log("Signature:", result.signature);
    } catch (error) {
      console.error("Failed to sign message:", error);
    }
  };

  return <button onClick={handleSign}>Sign Message</button>;
}
```

***

### useSignEvmTypedData()

```ts
function useSignEvmTypedData(): object;
```

Hook that provides a wrapped function to sign EIP-712 typed data with authentication checks.
This hook uses useEnforceAuthenticated to ensure the user is signed in before attempting to sign.

#### Returns

`object`

##### signEvmTypedData()

```ts
signEvmTypedData: (options) => Promise<SignEvmTypedDataResult>;
```

###### Parameters

| Parameter | Type                                                                                                |
| --------- | --------------------------------------------------------------------------------------------------- |
| `options` | [`SignEvmTypedDataOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#signevmtypeddataoptions) |

###### Returns

`Promise`\<[`SignEvmTypedDataResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#signevmtypeddataresult)>

#### Example

```tsx lines
function SignTypedData() {
  const { signEvmTypedData } = useSignEvmTypedData();
  const { evmAddress } = useEvmAddress();

  const handleSign = async () => {
    if (!evmAddress) return;

    try {
      const result = await signEvmTypedData({
        evmAccount: evmAddress,
        typedData: {
          domain: {
            name: "USDC",
            version: "2",
            chainId: 84532,
            verifyingContract: "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
          },
          types: {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" }
            ],
            TransferWithAuthorization: [
              { name: "from", type: "address" },
              { name: "to", type: "address" },
              { name: "value", type: "uint256" },
              { name: "validAfter", type: "uint256" },
              { name: "validBefore", type: "uint256" },
              { name: "nonce", type: "bytes32" }
            ]
          },
          primaryType: "TransferWithAuthorization",
          message: {
            from: evmAddress,
            to: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
            value: "1000000", // 1 USDC
            validAfter: 0,
            validBefore: 2524604400,
            nonce: 0
          }
        }
      });
      console.log("Signature:", result.signature);
    } catch (error) {
      console.error("Failed to sign typed data:", error);
    }
  };

  return (
    <button onClick={handleSign}>Sign Typed Data</button>
  );
}
```

***

### useExportEvmAccount()

```ts
function useExportEvmAccount(): object;
```

Hook that provides a wrapped function to export EVM account private keys with authentication checks.
This hook uses useEnforceAuthenticated to ensure the user is signed in before attempting to export.

#### Returns

`object`

##### exportEvmAccount()

```ts
exportEvmAccount: (options) => Promise<ExportEvmAccountResult>;
```

###### Parameters

| Parameter | Type                                                                                                |
| --------- | --------------------------------------------------------------------------------------------------- |
| `options` | [`ExportEvmAccountOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#exportevmaccountoptions) |

###### Returns

`Promise`\<[`ExportEvmAccountResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#exportevmaccountresult)>

#### Example

```tsx lines
function ExportPrivateKey() {
  const { exportEvmAccount } = useExportEvmAccount();
  const { evmAddress } = useEvmAddress();

  const handleExport = async () => {
    if (!evmAddress) return;

    try {
      const { privateKey } = await exportEvmAccount({
        evmAccount: evmAddress
      });
      console.log("Private Key:", privateKey);
    } catch (error) {
      console.error("Failed to export private key:", error);
    }
  };

  return (
    <button onClick={handleExport}>Export Private Key</button>
  );
}
```

***

### useExportSolanaAccount()

```ts
function useExportSolanaAccount(): object;
```

Hook that provides a wrapped function to export Solana account private keys with authentication checks.
This hook uses useEnforceAuthenticated to ensure the user is signed in before attempting to export.

#### Returns

`object`

##### exportSolanaAccount()

```ts
exportSolanaAccount: (options) => Promise<ExportSolanaAccountResult>;
```

###### Parameters

| Parameter | Type                                                                                                      |
| --------- | --------------------------------------------------------------------------------------------------------- |
| `options` | [`ExportSolanaAccountOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#exportsolanaaccountoptions) |

###### Returns

`Promise`\<[`ExportSolanaAccountResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#exportsolanaaccountresult)>

#### Example

```tsx lines
function ExportSolanaPrivateKey() {
  const { exportSolanaAccount } = useExportSolanaAccount();
  const { solanaAddress } = useSolanaAddress();

  const handleExport = async () => {
    if (!solanaAddress) return;

    try {
      const { privateKey } = await exportSolanaAccount({
        solanaAccount: solanaAddress
      });
      console.log("Private Key:", privateKey);
    } catch (error) {
      console.error("Failed to export private key:", error);
    }
  };

  return (
    <button onClick={handleExport}>Export Private Key</button>
  );
}
```

***

### useSignSolanaTransaction()

```ts
function useSignSolanaTransaction(): object;
```

Hook that provides a wrapped function to sign Solana transactions with authentication checks.
This hook uses useEnforceAuthenticated to ensure the user is signed in before attempting to sign.

#### Returns

`object`

##### signSolanaTransaction()

```ts
signSolanaTransaction: (options) => Promise<SignSolanaTransactionResult>;
```

###### Parameters

| Parameter | Type                           |
| --------- | ------------------------------ |
| `options` | `SignSolanaTransactionOptions` |

###### Returns

`Promise`\<`SignSolanaTransactionResult`>

#### Example

```tsx lines
function SignSolanaTransaction() {
  const { signSolanaTransaction } = useSignSolanaTransaction();
  const { solanaAddress } = useSolanaAddress();

  const handleSign = async () => {
    if (!solanaAddress) return;

    try {
      const result = await signSolanaTransaction({
        solanaAccount: solanaAddress,
        transaction: "base64-encoded-transaction"
      });
      console.log("Signed Transaction:", result.signedTransaction);
    } catch (error) {
      console.error("Failed to sign transaction:", error);
    }
  };

  return (
    <button onClick={handleSign}>Sign Solana Transaction</button>
  );
}
```

***

### useSendSolanaTransaction()

```ts
function useSendSolanaTransaction(): object;
```

Hook that provides a wrapped function to send Solana transactions with authentication checks.
This hook uses useEnforceAuthenticated to ensure the user is signed in before attempting to send.

#### Returns

`object`

##### sendSolanaTransaction()

```ts
sendSolanaTransaction: (options) => Promise<SendSolanaTransactionResult>;
```

###### Parameters

| Parameter | Type                                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------------------- |
| `options` | [`SendSolanaTransactionOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#sendsolanatransactionoptions) |

###### Returns

`Promise`\<[`SendSolanaTransactionResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#sendsolanatransactionresult)>

#### Example

```tsx
import { useSendSolanaTransaction, useSolanaAddress } from "@coinbase/cdp-hooks";

function MyComponent() {
  const { sendSolanaTransaction } = useSendSolanaTransaction();
  const { data: solanaAddress } = useSolanaAddress();

  const handleSend = async () => {
    if (solanaAddress) {
      const result = await sendSolanaTransaction({
        solanaAccount: solanaAddress,
        network: "solana-devnet",
        transaction: "base64EncodedTransaction..."
      });
      console.log("Transaction signature:", result.transactionSignature);
    }
  };

  return <button onClick={handleSend}>Send Transaction</button>;
}
```

***

### useEnforceAuthenticated()

```ts
function useEnforceAuthenticated<TArgs, TReturn>(callback): (...args) => Promise<TReturn>;
```

Higher-order hook that wraps a callback with authentication enforcement.
This ensures that the wrapped function can only be called when the user is signed in.

#### Type Parameters

| Type Parameter                 | Description                                           |
| ------------------------------ | ----------------------------------------------------- |
| `TArgs` *extends* `unknown`\[] | Array type representing the arguments of the callback |
| `TReturn`                      | Type representing the return value of the callback    |

#### Parameters

| Parameter  | Type                                 | Description                                          |
| ---------- | ------------------------------------ | ---------------------------------------------------- |
| `callback` | (...`args`) => `Promise`\<`TReturn`> | The async function to wrap with authentication check |

#### Returns

A wrapped version of the callback that checks authentication

```ts
(...args): Promise<TReturn>;
```

##### Parameters

| Parameter | Type    |
| --------- | ------- |
| ...`args` | `TArgs` |

##### Returns

`Promise`\<`TReturn`>

#### Throws

Throws an error if the user is not authenticated when the callback is invoked

***

### useEnforceUnauthenticated()

```ts
function useEnforceUnauthenticated<TArgs, TReturn>(callback): (...args) => Promise<TReturn>;
```

Higher-order hook that wraps a callback with unauthenticated enforcement.
This ensures that the wrapped function can only be called when the user is not signed in.

#### Type Parameters

| Type Parameter                 | Description                                           |
| ------------------------------ | ----------------------------------------------------- |
| `TArgs` *extends* `unknown`\[] | Array type representing the arguments of the callback |
| `TReturn`                      | Type representing the return value of the callback    |

#### Parameters

| Parameter  | Type                                 | Description                                          |
| ---------- | ------------------------------------ | ---------------------------------------------------- |
| `callback` | (...`args`) => `Promise`\<`TReturn`> | The async function to wrap with authentication check |

#### Returns

A wrapped version of the callback that checks authentication

```ts
(...args): Promise<TReturn>;
```

##### Parameters

| Parameter | Type    |
| --------- | ------- |
| ...`args` | `TArgs` |

##### Returns

`Promise`\<`TReturn`>

#### Throws

Throws an error if the user is authenticated when the callback is invoked

***

### useSendUserOperation()

```ts
function useSendUserOperation(): UseSendUserOperationReturnType;
```

Hook that provides a wrapped function to send user operations from Smart Accounts with authentication checks.
This hook uses useEnforceAuthenticated to ensure the user is signed in before attempting to send user operations.
The hook internally waits for user operations to succeed and returns the related success/error
via the `data` discriminated union object.

Note: The `data` returned from the hook only represents the *last* sent user operation. If you wish to
call one instance of the hook multiple times in quick succession it is recommended to save the
userOperationHash returned from `sendUserOperation` yourself and handle waiting for the result.

#### Returns

[`UseSendUserOperationReturnType`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#usesenduseroperationreturntype)

#### Example

```tsx lines
function SendUserOperation() {
  const { sendUserOperation, data, isError, error } = useSendUserOperation();
  const { currentUser } = useCurrentUser();

  const handleSendUserOperation = async () => {
    const smartAccount = currentUser?.evmSmartAccounts?.[0];
    if (!smartAccount) return;

    try {
      const result = await sendUserOperation({
        evmAccount: smartAccount,
        network: "base-sepolia",
        calls: [{
          to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          value: "0x0",
          data: "0x",
        }],
      });
      console.log("User Operation Hash:", result.userOperationHash);
    } catch (error) {
      console.error("Failed to send user operation:", error);
    }
  };

  return (
    <div>
      {isError && <p>Error: {error?.message}</p>}
      {data && (
        <div>
          <p>User operation successful!</p>
          <p>Transaction Hash: {data.transactionHash}</p>
        </div>
      )}
      <button onClick={handleSendUserOperation}>Send User Operation</button>
    </div>
  );
}
```

***

### useWaitForUserOperation()

```ts
function useWaitForUserOperation(parameters): UseWaitForUserOperationReturnType;
```

Hook that waits for a user operation to be confirmed and provides its current state.
This hook polls the user operation status until it's confirmed or fails.

Note: The `data` returned from the hook only represents the *last* sent user operation. If you wish to
call one instance of the hook multiple times in quick succession it is recommended to save the
userOpHash returned from `waitForUserOperation` yourself and handle waiting for the result.

#### Parameters

| Parameter    | Type                                                                                                                    | Description                                         |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `parameters` | [`UseWaitForUserOperationParameters`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#usewaitforuseroperationparameters) | Configuration object for waiting for user operation |

#### Returns

[`UseWaitForUserOperationReturnType`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#usewaitforuseroperationreturntype)

Query result with data, loading state, and error information

#### Example

```tsx lines
function WaitForUserOperation() {
  const { status, data, error } = useWaitForUserOperation({
    userOperationHash: "0x1234...",
    evmSmartAccount: "0x1234567890123456789012345678901234567890",
    network: "base-sepolia"
  });

  return (
    <div>
      {status === "error" && <p>Error: {error?.message}</p>}
      {status === "success" && (
        <div>
          <p>User operation successful!</p>
          <p>Transaction Hash: {data.transactionHash}</p>
        </div>
      )}
    </div>
  );
}
```

***

### CDPHooksProvider()

```ts
function CDPHooksProvider(props): Element;
```

Provider component that initializes the CDP SDK and manages authentication state.
This must be placed at the root of your application or above any components that need CDP functionality.

#### Parameters

| Parameter | Type                                                                                            | Description         |
| --------- | ----------------------------------------------------------------------------------------------- | ------------------- |
| `props`   | [`CDPHooksProviderProps`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#cdphooksproviderprops) | The component props |

#### Returns

`Element`

A React context provider wrapping the children with CDP functionality

#### Example

```tsx lines
const cdpConfig = {
  projectId: "your-project-id" // Your project ID from the CDP Portal
}

function App() {
  return (
    <CDPHooksProvider config={cdpConfig}>
      <YourApp />
    </CDPHooksProvider>
  );
}
```

## Classes

### APIError

#### Extends

* `Error`

#### Constructors

##### Constructor

```ts
new APIError(
   statusCode, 
   errorType, 
   errorMessage, 
   correlationId?, 
   errorLink?, 
   cause?): APIError;
```

###### Parameters

| Parameter        | Type                                                                          |
| ---------------- | ----------------------------------------------------------------------------- |
| `statusCode`     | `number`                                                                      |
| `errorType`      | [`APIErrorType`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#apierrortype) |
| `errorMessage`   | `string`                                                                      |
| `correlationId?` | `string`                                                                      |
| `errorLink?`     | `string`                                                                      |
| `cause?`         | `Error`                                                                       |

###### Returns

[`APIError`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#apierror)

###### Overrides

```ts
Error.constructor
```

#### Methods

##### toJSON()

```ts
toJSON(): object;
```

###### Returns

`object`

###### errorLink?

```ts
optional errorLink: string;
```

###### correlationId?

```ts
optional correlationId: string;
```

###### name

```ts
name: string;
```

###### statusCode

```ts
statusCode: number;
```

###### errorType

```ts
errorType: APIErrorType;
```

###### errorMessage

```ts
errorMessage: string;
```

#### Properties

| Property                                  | Type                                                                          |
| ----------------------------------------- | ----------------------------------------------------------------------------- |
| <a id="statuscode" /> `statusCode`        | `number`                                                                      |
| <a id="errortype" /> `errorType`          | [`APIErrorType`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#apierrortype) |
| <a id="errormessage" /> `errorMessage`    | `string`                                                                      |
| <a id="correlationid" /> `correlationId?` | `string`                                                                      |
| <a id="errorlink" /> `errorLink?`         | `string`                                                                      |

## Interfaces

### CDPHooksProviderProps

Props for the CDP Provider component

#### Properties

| Property                       | Type                                                                | Description                                       |
| ------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------- |
| <a id="children" /> `children` | `ReactNode`                                                         | React children to be rendered within the provider |
| <a id="config" /> `config`     | [`Config`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#config-2) | Configuration object for initializing the CDP SDK |

***

### CDPContextValue

Core context value interface for the CDP (Coinbase Developer Platform) provider.

#### Properties

| Property                                 | Type                                                                       | Description                                                      |
| ---------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| <a id="isinitialized" /> `isInitialized` | `boolean`                                                                  | Whether the CDP SDK has completed initialization                 |
| <a id="currentuser" /> `currentUser`     | \| `null` \| [`User`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#user) | The currently authenticated user, or null if not signed in       |
| <a id="issignedin" /> `isSignedIn`       | `boolean`                                                                  | Convenience boolean indicating if there is an authenticated user |
| <a id="config-1" /> `config`             | [`Config`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#config-2)        | The CDP config                                                   |

***

### EIP712TypedData

#### Properties

| Property                             | Type            |
| ------------------------------------ | --------------- |
| <a id="domain" /> `domain`           | `EIP712Domain`  |
| <a id="types" /> `types`             | `EIP712Types`   |
| <a id="primarytype" /> `primaryType` | `string`        |
| <a id="message" /> `message`         | `EIP712Message` |

## Type Aliases

### Config

```ts
type Config = CoreConfig & object;
```

The config for the CDP hooks.

#### Type declaration

##### transports?

```ts
optional transports: Record<typeof base.id | typeof baseSepolia.id, Transport>;
```

#### Param

The optional transports to use for the public clients. If not provided, the default `http()` transport is used.

#### Returns

The config for the CDP hooks.

***

### TransactionState

```ts
type TransactionState = 
  | {
  status: "idle";
}
  | {
  status: "pending";
  hash: Hex;
}
  | {
  status: "success";
  receipt: TransactionReceipt;
}
  | {
  status: "error";
  error: Error;
};
```

Represents the state of an EVM transaction.

* "idle": No transaction in progress.
* "pending": Transaction sent, waiting for confirmation.
* "success": Transaction confirmed, includes receipt.
* "error": Transaction failed, includes error details.

***

### Status

```ts
type Status = "idle" | "pending" | "success" | "error";
```

Represents the status of a request.

* "idle": No request in progress.
* "pending": Request sent, waiting for confirmation.
* "success": Request confirmed, includes result.
* "error": Request failed, includes error details.

***

### UseSendUserOperationReturnType

```ts
type UseSendUserOperationReturnType = object;
```

Represents the return type of the `useSendUserOperation` hook.

#### Properties

| Property                                         | Type                                                                                                                |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| <a id="senduseroperation" /> `sendUserOperation` | (`options`) => `Promise`\<`SendUserOperationResult`>                                                                |
| <a id="data" /> `data`                           | \| [`GetUserOperationResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#getuseroperationresult) \| `undefined` |
| <a id="error" /> `error`                         | `Error` \| `undefined`                                                                                              |
| <a id="status-1" /> `status`                     | [`Status`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#status)                                                   |

***

### UseWaitForUserOperationParameters

```ts
type UseWaitForUserOperationParameters = object;
```

Represents the parameters for the `useWaitForUserOperation` hook.

#### Properties

| Property                                          | Type                                                                                                                                               |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="useroperationhash" /> `userOperationHash?` | [`Hex`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#hex)                                                                                        |
| <a id="evmsmartaccount" /> `evmSmartAccount?`     | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#evmaddress)                                                                          |
| <a id="network" /> `network?`                     | [`SendEvmTransactionWithEndUserAccountBodyNetwork`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#sendevmtransactionwithenduseraccountbodynetwork) |
| <a id="enabled" /> `enabled?`                     | `boolean`                                                                                                                                          |

***

### UseWaitForUserOperationReturnType

```ts
type UseWaitForUserOperationReturnType = object;
```

Represents the return type of the `useWaitForUserOperation` hook.

#### Properties

| Property                     | Type                                                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| <a id="status-2" /> `status` | [`Status`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#status)                                                   |
| <a id="data-1" /> `data`     | \| [`GetUserOperationResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#getuseroperationresult) \| `undefined` |
| <a id="error-1" /> `error`   | `Error` \| `undefined`                                                                                              |

***

### AllowedEvmTransactionType

```ts
type AllowedEvmTransactionType = TransactionSerializableEIP1559;
```

***

### APIErrorType

```ts
type APIErrorType = 
  | ErrorType
  | HttpErrorType;
```

***

### EvmAddress

```ts
type EvmAddress = `0x${string}`;
```

***

### ExportEvmAccountOptions

```ts
type ExportEvmAccountOptions = object;
```

#### Properties

| Property                           | Type                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------- |
| <a id="evmaccount" /> `evmAccount` | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#evmaddress) |

***

### ExportEvmAccountResult

```ts
type ExportEvmAccountResult = object;
```

#### Properties

| Property                           | Type     |
| ---------------------------------- | -------- |
| <a id="privatekey" /> `privateKey` | `string` |

***

### ExportSolanaAccountOptions

```ts
type ExportSolanaAccountOptions = object;
```

#### Properties

| Property                                 | Type            |
| ---------------------------------------- | --------------- |
| <a id="solanaaccount" /> `solanaAccount` | `SolanaAddress` |

***

### ExportSolanaAccountResult

```ts
type ExportSolanaAccountResult = object;
```

#### Properties

| Property                             | Type     |
| ------------------------------------ | -------- |
| <a id="privatekey-1" /> `privateKey` | `string` |

***

### GetUserOperationResult

```ts
type GetUserOperationResult = EvmUserOperation;
```

***

### Hex

```ts
type Hex = `0x${string}`;
```

***

### SendEvmTransactionOptions

```ts
type SendEvmTransactionOptions = object;
```

#### Properties

| Property                             | Type                                                                                                                                               |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="evmaccount-1" /> `evmAccount` | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#evmaddress)                                                                          |
| <a id="network-1" /> `network`       | [`SendEvmTransactionWithEndUserAccountBodyNetwork`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#sendevmtransactionwithenduseraccountbodynetwork) |
| <a id="transaction" /> `transaction` | [`AllowedEvmTransactionType`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#allowedevmtransactiontype)                                            |

***

### SendEvmTransactionResult

```ts
type SendEvmTransactionResult = object;
```

#### Properties

| Property                                     | Type                                                        |
| -------------------------------------------- | ----------------------------------------------------------- |
| <a id="transactionhash" /> `transactionHash` | [`Hex`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#hex) |

***

### SendSolanaTransactionOptions

```ts
type SendSolanaTransactionOptions = object;
```

#### Properties

| Property                                   | Type                                                                                                                                                     |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="solanaaccount-1" /> `solanaAccount` | `SolanaAddress`                                                                                                                                          |
| <a id="network-2" /> `network`             | [`SendSolanaTransactionWithEndUserAccountBodyNetwork`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#sendsolanatransactionwithenduseraccountbodynetwork) |
| <a id="transaction-1" /> `transaction`     | `string`                                                                                                                                                 |

***

### SendSolanaTransactionResult

```ts
type SendSolanaTransactionResult = object;
```

#### Properties

| Property                                               | Type     |
| ------------------------------------------------------ | -------- |
| <a id="transactionsignature" /> `transactionSignature` | `string` |

***

### SignEvmHashOptions

```ts
type SignEvmHashOptions = object;
```

#### Properties

| Property                             | Type                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------- |
| <a id="evmaccount-2" /> `evmAccount` | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#evmaddress) |
| <a id="hash" /> `hash`               | [`Hex`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#hex)               |

***

### SignEvmHashResult

```ts
type SignEvmHashResult = object;
```

#### Properties

| Property                         | Type                                                        |
| -------------------------------- | ----------------------------------------------------------- |
| <a id="signature" /> `signature` | [`Hex`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#hex) |

***

### SignEvmMessageOptions

```ts
type SignEvmMessageOptions = object;
```

#### Properties

| Property                             | Type                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------- |
| <a id="evmaccount-3" /> `evmAccount` | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#evmaddress) |
| <a id="message-1" /> `message`       | `string`                                                                  |

***

### SignEvmMessageResult

```ts
type SignEvmMessageResult = object;
```

#### Properties

| Property                           | Type                                                        |
| ---------------------------------- | ----------------------------------------------------------- |
| <a id="signature-1" /> `signature` | [`Hex`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#hex) |

***

### SignEvmTransactionOptions

```ts
type SignEvmTransactionOptions = object;
```

#### Properties

| Property                               | Type                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| <a id="evmaccount-4" /> `evmAccount`   | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#evmaddress)                               |
| <a id="transaction-2" /> `transaction` | [`AllowedEvmTransactionType`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#allowedevmtransactiontype) |

***

### SignEvmTransactionResult

```ts
type SignEvmTransactionResult = object;
```

#### Properties

| Property                                         | Type                                                        |
| ------------------------------------------------ | ----------------------------------------------------------- |
| <a id="signedtransaction" /> `signedTransaction` | [`Hex`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#hex) |

***

### SignEvmTypedDataOptions

```ts
type SignEvmTypedDataOptions = object;
```

#### Properties

| Property                             | Type                                                                                |
| ------------------------------------ | ----------------------------------------------------------------------------------- |
| <a id="evmaccount-5" /> `evmAccount` | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#evmaddress)           |
| <a id="typeddata" /> `typedData`     | [`EIP712TypedData`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#eip712typeddata) |

***

### SignEvmTypedDataResult

```ts
type SignEvmTypedDataResult = object;
```

#### Properties

| Property                           | Type                                                        |
| ---------------------------------- | ----------------------------------------------------------- |
| <a id="signature-2" /> `signature` | [`Hex`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#hex) |

***

### SignInWithEmailOptions

```ts
type SignInWithEmailOptions = object;
```

#### Properties

| Property                 | Type     |
| ------------------------ | -------- |
| <a id="email" /> `email` | `string` |

***

### SignInWithEmailResult

```ts
type SignInWithEmailResult = object;
```

#### Properties

| Property                       | Type     |
| ------------------------------ | -------- |
| <a id="message-2" /> `message` | `string` |
| <a id="flowid" /> `flowId`     | `string` |

***

### User

```ts
type User = object;
```

#### Properties

| Property                                                 | Type                                                                         |
| -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| <a id="userid" /> `userId`                               | `string`                                                                     |
| <a id="authenticationmethods" /> `authenticationMethods` | `AuthenticationMethods`                                                      |
| <a id="evmaccounts" /> `evmAccounts?`                    | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#evmaddress)\[] |
| <a id="evmsmartaccounts" /> `evmSmartAccounts?`          | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#evmaddress)\[] |
| <a id="solanaaccounts" /> `solanaAccounts?`              | `SolanaAddress`\[]                                                           |

***

### VerifyEmailOTPOptions

```ts
type VerifyEmailOTPOptions = object;
```

#### Properties

| Property                     | Type     |
| ---------------------------- | -------- |
| <a id="flowid-1" /> `flowId` | `string` |
| <a id="otp" /> `otp`         | `string` |

***

### VerifyEmailOTPResult

```ts
type VerifyEmailOTPResult = object;
```

#### Properties

| Property                         | Type                                                          |
| -------------------------------- | ------------------------------------------------------------- |
| <a id="user-1" /> `user`         | [`User`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks#user) |
| <a id="message-3" /> `message`   | `string`                                                      |
| <a id="isnewuser" /> `isNewUser` | `boolean`                                                     |

## Variables

### CDPContext

```ts
const CDPContext: Context<
  | null
| CDPContextValue>;
```

Context for the CDP provider.
