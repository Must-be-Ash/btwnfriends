# @coinbase/cdp-core

This package contains core business logic for the CDP Frontend SDK.
It is intended for non-React applications that use pure Typescript.

## Quickstart

This guide will help you get started with `@coinbase/cdp-core`. You'll learn how to install the package,
initialize the SDK, and make your first API call.

### Installation

First, add the package to your project using your preferred package manager.

```bash
# With pnpm
pnpm add @coinbase/cdp-core

# With yarn
yarn add @coinbase/cdp-core

# With npm
npm install @coinbase/cdp-core
```

### Gather your CDP Project information

1. Sign in or create an account on the [CDP Portal](https://portal.cdp.coinbase.com)
2. On your dashboard, select a project from the dropdown at the at the top, and copy the Project ID

### Allowlist your local app

1. Navigate to the [Embedded Wallet Configuration](https://portal.cdp.coinbase.com/products/embedded-wallets/cors)
   in CDP Portal, and click Add origin to include your local app
2. Enter the origin of your locally running app - e.g., `http://localhost:3000`
3. Click Add origin again to save your changes

### Initialize the SDK

Before calling any methods in the SDK, you must first initialize it:

```ts lines
import { Config, initialize } from "@coinbase/cdp-core";

const config: Config = {
  // Copy and paste your project ID here.
  projectId: "your-project-id",
}

await initialize(config);
```

#### Account Configuration

You can configure the SDK to create different types of accounts for new users:

**Smart Account Configuration:**

```ts lines
const config: Config = {
  projectId: "your-project-id",
  ethereum: {
    createOnLogin: "smart", // Creates Smart Accounts instead of EOAs
  },
}

await initialize(config);
```

When `ethereum.createOnLogin` is set to `"smart"`, the SDK will:

1. Create an EOA (Externally Owned Account) first
2. Use that EOA as the owner to create a Smart Account
3. Both accounts will be available on the user object

**Solana Account Configuration:**

```ts lines
const config: Config = {
  projectId: "your-project-id",
  solana: {
    createOnLogin: true, // Creates Solana accounts
  },
}

await initialize(config);
```

When `solana.createOnLogin` is set to `true`, the SDK will:

1. Create a Solana account for new users
2. The Solana account will be available on the `solanaAccounts` property

### Sign In a User

You're now ready to start calling the APIs provided by the package!
The following code signs in an end user:

```ts lines
import { signInWithEmail, verifyEmailOTP } from "@coinbase/cdp-core";

// Send an email to user@example.com with a One Time Password (OTP).
const authResult = await signInWithEmail({
  email: "user@example.com"
});

// Input the OTP sent to user@example.com.
const verifyResult = await verifyEmailOTP({
  flowId: authResult.flowId,
  otp: "123456", // Hardcoded for convenience here.
});

// Get the authenticated end user.
const user = verifyResult.user;
```

### View User Information

Once the end user has signed in, you can display their information in your application:

```typescript lines
import { getCurrentUser, isSignedIn } from "@coinbase/cdp-core";

// Check if user is signed in
const signedIn = await isSignedIn();

if (signedIn) {
  // Get the user's information
  const user = await getCurrentUser();
  console.log("User ID:", user.userId);

  // Display different account types based on configuration
  if (user.evmAccounts?.length > 0) {
    console.log("EVM Accounts (EOAs):", user.evmAccounts);
  }
  if (user.evmSmartAccounts?.length > 0) {
    console.log("EVM Smart Accounts:", user.evmSmartAccounts);
  }
  if (user.solanaAccounts?.length > 0) {
    console.log("Solana Accounts:", user.solanaAccounts);
  }

  // Find the user's email address (if they logged in with email/otp)
  const email = user.authenticationMethods.email?.email;
  console.log("Email Address:", email);
}
```

### Send an EVM Transaction

We support signing and sending an EVM transaction in a single call on the following networks:

* Base
* Base Sepolia
* Ethereum
* Ethereum Sepolia
* Avalanche
* Arbitrum
* Optimism
* Polygon

```typescript lines
import { sendEvmTransaction, getCurrentUser } from "@coinbase/cdp-core";

const user = await getCurrentUser();
const evmAccount = user.evmAccounts[0];

const result = await sendEvmTransaction({
  evmAccount,
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

console.log("Transaction Hash:", result.transactionHash);
```

For EVM networks other than those supported by the CDP APIs, your end user must sign the transaction, and then
you must broadcast the transaction yourself. This example uses the public client from `viem` to broadcast the transaction.

```typescript lines
import { signEvmTransaction, getCurrentUser } from "@coinbase/cdp-core";
import { http, createPublicClient } from "viem";
import { tron } from "viem/chains";

const user = await getCurrentUser();
const evmAccount = user.evmAccounts[0];

// Sign the transaction
const { signedTransaction } = await signEvmTransaction({
  evmAccount,
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

// Broadcast signed transaction to non-Base chain
const client = createPublicClient({
  chain: tron,
  transport: http()
});

const hash = await client.sendRawTransaction({
  serializedTransaction: signedTransaction
});
```

### Smart Account Operations

Smart Accounts provide advanced account abstraction features, including user operations and paymaster support.

### Sign a Solana Transaction

When your application is configured with `solana: { createOnLogin: true }`, you can sign Solana transactions:

```typescript lines
import { signSolanaTransaction, getCurrentUser } from "@coinbase/cdp-core";

const user = await getCurrentUser();
const solanaAccount = user.solanaAccounts[0];

const result = await signSolanaTransaction({
  solanaAccount,
  transaction: "base64-encoded-solana-transaction"  // Your Solana transaction here
});

console.log("Signed Transaction:", result.signedTransaction);
// The signedTransaction can now be broadcast to the Solana network
```

### Sign a Solana Message

You can also sign arbitrary messages with Solana accounts:

```typescript lines
import { signSolanaMessage, getCurrentUser } from "@coinbase/cdp-core";

const user = await getCurrentUser();
const solanaAccount = user.solanaAccounts[0];

const message = Buffer.from("Hello, Solana!", "utf8").toString("base64");
const result = await signSolanaMessage({
  solanaAccount,
  message // Base64 encoded message to sign
});

console.log("Message Signature:", result.signature);
// The signature can be used for authentication or verification purposes
```

### Send a Solana Transaction

You can sign and send a Solana transaction in a single call on the following Solana networks:

* Solana Mainnet
* Solana Devnet

```typescript lines
import { sendSolanaTransaction, getCurrentUser } from "@coinbase/cdp-core";

const user = await getCurrentUser();
const solanaAccount = user.solanaAccounts[0];

const result = await sendSolanaTransaction({
  solanaAccount,
  network: "solana-devnet", // or "solana" for mainnet
  transaction: "base64-encoded-solana-transaction"  // Your Solana transaction here
});

console.log("Transaction Signature:", result.transactionSignature);
// The transaction has been broadcast to the Solana network
```

#### Send User Operations

Send user operations from a Smart Account:

```typescript lines
import { sendUserOperation, getCurrentUser } from "@coinbase/cdp-core";

const user = await getCurrentUser();
const smartAccount = user.evmSmartAccounts[0];

const result = await sendUserOperation({
  evmSmartAccount: smartAccount,
  network: "base-sepolia",
  calls: [
    {
      to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      value: 1000000000000000000n, // 1 ETH in wei
      data: "0x", // Optional contract interaction data
    }
  ],
  // Optional paymaster for gas sponsorship. Get your free Base paymaster URL [from the CDP Portal](https://portal.cdp.coinbase.com/products/node).
  paymasterUrl: "https://paymaster.example.com",
});

console.log("User Operation Hash:", result.userOperationHash);
```

#### Get User Operation Status

After sending a user operation, you can get its status and retrieve the result:

```typescript lines
import { getUserOperation } from "@coinbase/cdp-core";

// Get the status of a user operation
const userOperationResult = await getUserOperation({
  userOperationHash: result.userOperationHash,
  evmSmartAccount: smartAccount,
  network: "base-sepolia"
});

console.log("Status:", userOperationResult.status); // "pending", "complete", or "failed"

if (userOperationResult.status === "complete") {
  console.log("Transaction Hash:", userOperationResult.transactionHash);
  console.log("Block Number:", userOperationResult.receipts?.[0]?.blockNumber);
} else if (userOperationResult.status === "failed") {
  console.log("Failure reason:", userOperationResult.receipts?.[0]?.revert?.message);
}
```

### Sign Messages and Typed Data

End users can sign EVM messages, hashes, and typed data to generate signatures for various onchain applications.

```typescript lines
import { signEvmMessage, signEvmTypedData, getCurrentUser } from "@coinbase/cdp-core";

const user = await getCurrentUser();
const evmAccount = user.evmAccounts[0];

// Sign a message
const messageResult = await signEvmMessage({
  evmAccount,
  message: "Hello World"
});

// Sign typed data (EIP-712)
const typedDataResult = await signEvmTypedData({
  evmAccount,
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
      wallet: evmAccount
    }
  }
});
```

### Export Private Keys

End users can export their private keys from their embedded wallet, allowing them to import them into compatible wallets of their choice.

#### Export EVM Private Key

```typescript lines
import { exportEvmAccount, getCurrentUser } from "@coinbase/cdp-core";

const user = await getCurrentUser();
const evmAccount = user.evmAccounts[0];

const { privateKey } = await exportEvmAccount({
  evmAccount
});

// WARNING: Handle private keys with extreme care!
console.log("EVM Private Key:", privateKey);
```

#### Export Solana Private Key

When your application is configured with `solana: { createOnLogin: true }`, you can export Solana private keys:

```typescript lines
import { exportSolanaAccount, getCurrentUser } from "@coinbase/cdp-core";

const user = await getCurrentUser();
const solanaAccount = user.solanaAccounts[0];

const { privateKey } = await exportSolanaAccount({
  solanaAccount
});

// WARNING: Handle private keys with extreme care!
console.log("Solana Private Key:", privateKey);
```

### EIP-1193 Provider

The core package includes an EIP-1193 compatible provider. This provider can be used to sign and send transactions.

The provider is created by calling `createCDPEmbeddedWallet`, which exposes a `.provider` attribute. `createCDPEmbeddedWallet` must be called with the desired chains to support as well as the transports for these chains.

The provider will initially connect to the first chain in the `chains` array. The transports are typically HTTP RPC endpoints, which are used internally for broadcasting non-Base transactions. For more information on transports, see [Wagmi's `createConfig` setup](https://wagmi.sh/react/api/createConfig).

```typescript lines
import { base, mainnet } from "viem/chains";
import { http } from "viem"

// Basic usage with default configuration
const wallet = createCDPEmbeddedWallet({
  chains:[base, mainnet],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http()
  }
});
const provider = wallet.provider;

// Request account access
const accounts = await provider.request({
  method: "eth_requestAccounts"
});

// Sign a message
const signature = await provider.request({
  method: "personal_sign",
  params: ["Hello, World!", accounts[0]]
});

// Send a transaction
const txHash = await provider.request({
  method: "eth_sendTransaction",
  params: [{
    from: accounts[0],
    to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    value: "0x1000000000000000000"
  }]
});

// Listen for connection events
provider.on("connect", (connectInfo) => {
  console.log("Connected to chain:", connectInfo.chainId);
});

provider.on("disconnect", () => {
  console.log("Disconnected from wallet");
});
```

### Viem Accounts

The core package includes a `toViemAccount` utility function that enables wrapping an embedded wallet into a Viem account compatible interface. This allows the account to act as a drop-in replacement for any library or framework that accepts Viem accounts.

```typescript lines
import { toViemAccount, getCurrentUser } from "@coinbase/cdp-core";
import { createWalletClient } from "viem";
import { mainnet } from "viem/chains";
import { http } from "viem";

const user = await getCurrentUser();
const evmAccount = user.evmAccounts[0];

const viemAccount = toViemAccount(evmAccount);

const client = createWalletClient({
  account: viemAccount,
  transport: http("https://example.com"),
  chain: mainnet,
});
```

## Functions

### initialize()

```ts
function initialize(cfg): Promise<void>;
```

Initializes the core package. Must be called before using any other functions.

#### Parameters

| Parameter | Type                                                             | Description                             |
| --------- | ---------------------------------------------------------------- | --------------------------------------- |
| `cfg`     | [`Config`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#config) | The configuration for the core package. |

#### Returns

`Promise`\<`void`>

#### Example

```typescript lines
await initialize({
  projectId: "your-project-id", // Your project ID from the CDP Portal
});
```

***

### signInWithEmail()

```ts
function signInWithEmail(options): Promise<SignInWithEmailResult>;
```

Initiates the sign in flow with an email.

#### Parameters

| Parameter | Type                                                                                             | Description                  |
| --------- | ------------------------------------------------------------------------------------------------ | ---------------------------- |
| `options` | [`SignInWithEmailOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#signinwithemailoptions) | The options for the sign in. |

#### Returns

`Promise`\<[`SignInWithEmailResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#signinwithemailresult)>

The result of the sign in.

#### Example

```typescript lines
const result = await signInWithEmail({
  email: "user@example.com"
});
```

***

### signInWithSms()

```ts
function signInWithSms(options): Promise<SignInWithSmsResult>;
```

Initiates the sign in flow with a phone number via SMS.

#### Parameters

| Parameter | Type                                                                                         | Description                  |
| --------- | -------------------------------------------------------------------------------------------- | ---------------------------- |
| `options` | [`SignInWithSmsOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#signinwithsmsoptions) | The options for the sign in. |

#### Returns

`Promise`\<[`SignInWithSmsResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#signinwithsmsresult)>

The result of the sign in.

#### Example

```typescript lines
const result = await signInWithSms({
  phoneNumber: "+14155552671"
});
```

***

### verifyEmailOTP()

```ts
function verifyEmailOTP(options): Promise<VerifyEmailOTPResult>;
```

Verifies the one-time password (OTP) for the sign in flow with an email.

#### Parameters

| Parameter | Type                                                                                           | Description                       |
| --------- | ---------------------------------------------------------------------------------------------- | --------------------------------- |
| `options` | [`VerifyEmailOTPOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#verifyemailotpoptions) | The options for the verification. |

#### Returns

`Promise`\<[`VerifyEmailOTPResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#verifyemailotpresult)>

The result of the verification.

#### Example

```typescript lines
const result = await verifyEmailOTP({
  flowId: "flow-id-from-signInWithEmail",
  otp: "123456" // The OTP received in email
});
```

***

### verifySmsOTP()

```ts
function verifySmsOTP(options): Promise<VerifySmsOTPResult>;
```

Verifies the one-time password (OTP) for the sign in flow with a phone number via SMS.

#### Parameters

| Parameter | Type                                                                                       | Description                       |
| --------- | ------------------------------------------------------------------------------------------ | --------------------------------- |
| `options` | [`VerifySmsOTPOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#verifysmsotpoptions) | The options for the verification. |

#### Returns

`Promise`\<[`VerifySmsOTPResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#verifysmsotpresult)>

The result of the verification.

#### Example

```typescript lines
const result = await verifySmsOTP({
  flowId: "flow-id-from-signInWithSms",
  otp: "123456" // The OTP received in SMS
});
```

***

### getCurrentUser()

```ts
function getCurrentUser(): Promise<null | User>;
```

Gets the currently signed-in user, if any.

#### Returns

`Promise`\<`null` | [`User`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#user)>

The currently signed-in user, or null if no user is signed in.

#### Example

```typescript lines
const user = await getCurrentUser();
```

***

### isSignedIn()

```ts
function isSignedIn(): Promise<boolean>;
```

Returns whether the user is currently signed in.

#### Returns

`Promise`\<`boolean`>

Whether the user is currently signed in.

#### Example

```typescript lines
const signedIn = await isSignedIn();
if (signedIn) {
  console.log("User is signed in");
}
```

***

### signOut()

```ts
function signOut(): Promise<void>;
```

Signs out the end user, clearing all authentication state.

#### Returns

`Promise`\<`void`>

#### Example

```typescript lines
await signOut();
```

***

### getAccessToken()

```ts
function getAccessToken(): Promise<null | string>;
```

Gets the access token for the current user.

#### Returns

`Promise`\<`null` | `string`>

The access token for the current user, or null if no user is signed in.

#### Example

```typescript lines
const accessToken = await getAccessToken();
```

***

### onAuthStateChange()

```ts
function onAuthStateChange(callback): void;
```

Sets a callback function to be called when the authentication state changes,
i.e. when a user signs in or out.

#### Parameters

| Parameter  | Type                                                                                       | Description                                                               |
| ---------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `callback` | [`OnAuthStateChangeFn`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#onauthstatechangefn) | The callback function to be called when the authentication state changes. |

#### Returns

`void`

#### Example

```typescript lines
onAuthStateChange(async (user) => {
  if (user) {
    console.log("User signed in:", user.userId);
  } else {
    console.log("User signed out");
  }
});
```

***

### signEvmHash()

```ts
function signEvmHash(options): Promise<SignEvmHashResult>;
```

Signs a hash with an EVM account.

#### Parameters

| Parameter | Type                                                                                     | Description                  |
| --------- | ---------------------------------------------------------------------------------------- | ---------------------------- |
| `options` | [`SignEvmHashOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#signevmhashoptions) | The options for the signing. |

#### Returns

`Promise`\<[`SignEvmHashResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#signevmhashresult)>

The result of the signing.

#### Example

```typescript lines
const result = await signEvmHash({
  evmAccount: "0x1234...",
  hash: "0xabcd..." // 32-byte hex string to sign
});
```

***

### signEvmTransaction()

```ts
function signEvmTransaction(options): Promise<SignEvmTransactionResult>;
```

Signs a hash with an EVM account.

#### Parameters

| Parameter | Type                                                                                                   | Description                  |
| --------- | ------------------------------------------------------------------------------------------------------ | ---------------------------- |
| `options` | [`SignEvmTransactionOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#signevmtransactionoptions) | The options for the signing. |

#### Returns

`Promise`\<[`SignEvmTransactionResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#signevmtransactionresult)>

The result of the signing.

#### Example

```typescript lines
const user = await getCurrentUser();
const evmAccount = user?.evmAccounts[0];

const result = await signEvmTransaction({
  evmAccount,
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
```

***

### signSolanaTransaction()

```ts
function signSolanaTransaction(options): Promise<SignSolanaTransactionResult>;
```

Signs a Solana transaction.

#### Parameters

| Parameter | Type                                                                                                         | Description                  |
| --------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| `options` | [`SignSolanaTransactionOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#signsolanatransactionoptions) | The options for the signing. |

#### Returns

`Promise`\<[`SignSolanaTransactionResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#signsolanatransactionresult)>

The result of the signing.

#### Example

```typescript lines
const user = await getCurrentUser();
const solanaAccount = user?.solanaAccounts[0];

const result = await signSolanaTransaction({
  solanaAccount,
  transaction: "base64-encoded-transaction"
});
```

***

### sendEvmTransaction()

```ts
function sendEvmTransaction(options): Promise<SendEvmTransactionResult>;
```

Sends an EVM transaction.

#### Parameters

| Parameter | Type                                                                                                   | Description                  |
| --------- | ------------------------------------------------------------------------------------------------------ | ---------------------------- |
| `options` | [`SendEvmTransactionOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#sendevmtransactionoptions) | The options for the sending. |

#### Returns

`Promise`\<[`SendEvmTransactionResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#sendevmtransactionresult)>

The transaction hash of the sent transaction.

#### Example

```typescript lines
const user = await getCurrentUser();
const evmAccount = user?.evmAccounts[0];

const result = await sendEvmTransaction({
  evmAccount,
  network: "base-sepolia",
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

```

***

### sendSolanaTransaction()

```ts
function sendSolanaTransaction(options): Promise<SendSolanaTransactionResult>;
```

Send a Solana transaction.

#### Parameters

| Parameter | Type                                                                                                         | Description                                     |
| --------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| `options` | [`SendSolanaTransactionOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#sendsolanatransactionoptions) | The options for sending the Solana transaction. |

#### Returns

`Promise`\<[`SendSolanaTransactionResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#sendsolanatransactionresult)>

The transaction signature.

***

### signEvmMessage()

```ts
function signEvmMessage(options): Promise<SignEvmHashResult>;
```

Signs an EVM message.

#### Parameters

| Parameter | Type                                                                                           | Description                  |
| --------- | ---------------------------------------------------------------------------------------------- | ---------------------------- |
| `options` | [`SignEvmMessageOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#signevmmessageoptions) | The options for the signing. |

#### Returns

`Promise`\<[`SignEvmHashResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#signevmhashresult)>

The result of the signing.

#### Example

```typescript lines
const user = await getCurrentUser();
const evmAccount = user?.evmAccounts[0];

const result = await signEvmMessage({
  evmAccount,
  message: "Hello World" // Message to sign
});

```

***

### signSolanaMessage()

```ts
function signSolanaMessage(options): Promise<SignSolanaMessageResult>;
```

Signs a message with a Solana account.

#### Parameters

| Parameter | Type                                                                                                 | Description                  |
| --------- | ---------------------------------------------------------------------------------------------------- | ---------------------------- |
| `options` | [`SignSolanaMessageOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#signsolanamessageoptions) | The options for the signing. |

#### Returns

`Promise`\<[`SignSolanaMessageResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#signsolanamessageresult)>

The result of the signing.

#### Example

```typescript lines
const user = await getCurrentUser();
const solanaAccount = user?.solanaAccounts[0];

const message = Buffer.from("Hello, Solana!", "utf8").toString("base64");
const result = await signSolanaMessage({
  solanaAccount,
  message // Base64 encoded message to sign
});

```

***

### signEvmTypedData()

```ts
function signEvmTypedData(options): Promise<SignEvmTypedDataResult>;
```

Signs EIP-712 typed data with an EVM account.

#### Parameters

| Parameter | Type                                                                                               | Description                  |
| --------- | -------------------------------------------------------------------------------------------------- | ---------------------------- |
| `options` | [`SignEvmTypedDataOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#signevmtypeddataoptions) | The options for the signing. |

#### Returns

`Promise`\<[`SignEvmTypedDataResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#signevmtypeddataresult)>

The result of the signing.

#### Example

```typescript lines
const user = await getCurrentUser();
const evmAccount = user?.evmAccounts[0];

const result = await signEvmTypedData({
  evmAccount,
  typedData: {
    domain: {
      name: "USDC",
      version: "2",
      chainId: 84532,
      verifyingContract: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia USDC
    },
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      TransferWithAuthorization: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "validAfter", type: "uint256" },
        { name: "validBefore", type: "uint256" },
        { name: "nonce", type: "bytes32" },
      ],
    },
    primaryType: "TransferWithAuthorization",
    message: {
      from: evmAccount,
      to: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
      value: "1000000", // 1 USDC (6 decimals)
      validAfter: 0, // Valid immediately
      validBefore: 2524604400, // Valid until 2050
      nonce: 0
    },
  },
});
```

***

### sendUserOperation()

```ts
function sendUserOperation(options): Promise<SendUserOperationResult>;
```

Sends a user operation from a smart account.

#### Parameters

| Parameter | Type                                                                                                 | Description                                 |
| --------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `options` | [`SendUserOperationOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#senduseroperationoptions) | The options for sending the user operation. |

#### Returns

`Promise`\<[`SendUserOperationResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#senduseroperationresult)>

Promise that resolves to the user operation hash.

#### Example

```typescript lines
const user = await getCurrentUser();
const smartAccount = user?.evmSmartAccounts[0];

const result = await sendUserOperation({
  evmSmartAccount: smartAccount,
  network: "base-sepolia",
  calls: [{
    to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    value: 0n,
    data: "0x",
  }],
});
console.log("User Operation Hash:", result.userOperationHash);
```

***

### getUserOperation()

```ts
function getUserOperation(options): Promise<EvmUserOperation>;
```

Gets a user operation by its hash.

#### Parameters

| Parameter | Type                                                                                               | Description                                 |
| --------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `options` | [`GetUserOperationOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#getuseroperationoptions) | The options for getting the user operation. |

#### Returns

`Promise`\<`EvmUserOperation`>

The user operation details.

#### Example

```typescript lines
const result = await getUserOperation({
  userOperationHash: "0x123...",
  evmSmartAccount: "0xabc...",
  network: "base-sepolia"
});
console.log("User Operation Status:", result.transactionHash);
```

***

### exportEvmAccount()

```ts
function exportEvmAccount(options): Promise<ExportEvmAccountResult>;
```

Exports an EVM account's private key.

#### Parameters

| Parameter | Type                                                                                               | Description                    |
| --------- | -------------------------------------------------------------------------------------------------- | ------------------------------ |
| `options` | [`ExportEvmAccountOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#exportevmaccountoptions) | The options for the exporting. |

#### Returns

`Promise`\<[`ExportEvmAccountResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#exportevmaccountresult)>

The result of the export.

#### Example

```typescript lines
const result = await exportEvmAccount({
  evmAccount: "0x1234..."
});
```

***

### exportSolanaAccount()

```ts
function exportSolanaAccount(options): Promise<ExportSolanaAccountResult>;
```

Exports the private key of a Solana account.

#### Parameters

| Parameter | Type                                                                                                     | Description                            |
| --------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `options` | [`ExportSolanaAccountOptions`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#exportsolanaaccountoptions) | The options for exporting the account. |

#### Returns

`Promise`\<[`ExportSolanaAccountResult`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#exportsolanaaccountresult)>

The result of the export.

#### Example

```typescript lines
const result = await exportSolanaAccount({
  solanaAccount: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
});
```

***

### toViemAccount()

```ts
function toViemAccount(address): Promise<{
}>;
```

Converts a CDP EVM account into a Viem-compatible LocalAccount.
This enables the CDP account to be used with any library or framework that accepts Viem accounts.

#### Parameters

| Parameter | Type                | Description                                  |
| --------- | ------------------- | -------------------------------------------- |
| `address` | `` `0x${string}` `` | The EVM address to create a Viem account for |

#### Returns

`Promise`\<\{
}>

A Viem LocalAccount that can sign messages and transactions using CDP's signing functions

#### Throws

If the user is not authenticated or the address is not in the user's EVM accounts

#### Example

```typescript lines
const user = await getCurrentUser();
const evmAccount = user.evmAccounts[0];
const viemAccount = await toViemAccount(evmAccount);
```

***

### createCDPEmbeddedWallet()

```ts
function createCDPEmbeddedWallet<chains>(_parameters): CDPEmbeddedWallet;
```

Creates the CDP embedded wallet's 1193 provider.

Note: The transports are currently only used for non-Base transactions. For non-Base transactions,
the provider internally signs the transaction via the CDP APIs and broadcasts it via the provided
transports, whereas for Base transactions the CDP API both signs and broadcasts the transaction.
For more information on transports, see [Wagmi's `createConfig` setup](https://wagmi.sh/react/api/createConfig).

#### Type Parameters

| Type Parameter                                  |
| ----------------------------------------------- |
| `chains` *extends* readonly \[`Chain`, `Chain`] |

#### Parameters

| Parameter     | Type                                                                                                          | Description                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_parameters` | [`CDPEmbeddedWalletConfig`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#cdpembeddedwalletconfig)\<`chains`> | Configuration parameters for the connector - see [CDPEmbeddedWalletConfig](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#cdpembeddedwalletconfig) |

#### Returns

[`CDPEmbeddedWallet`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#cdpembeddedwallet)

A CDP embedded wallet instance

#### Examples

```typescript lines
import { createCDPEmbeddedWallet, initialize } from "@coinbase/cdp-core";
import { http } from "viem";
import { baseSepolia, sepolia } from "viem/chains";

// SDK core must be initialized before creating the wallet
await initialize({
  projectId: "your-project-id"
})

// Create a wallet with multiple chains
const wallet = createCDPEmbeddedWallet({
  chains: [baseSepolia, sepolia],
  transports: {
    [baseSepolia.id]: http(),
    [sepolia.id]: http(),
  },
  announceProvider: true, // Announce the provider to window.ethereum
});

// The provider can be accessed via the provider property
const provider = wallet.provider;

// The provider implements the EIP-1193 interface
await provider.request({ method: "eth_requestAccounts" });
```

```typescript lines
// Basic usage with default configuration
const wallet = createCDPEmbeddedWallet();
const provider = wallet.provider;

// Request account access
const accounts = await provider.request({
  method: "eth_requestAccounts"
});

// Sign a message
const signature = await provider.request({
  method: "personal_sign",
  params: ["Hello, World!", accounts[0]]
});

// Send a transaction
const txHash = await provider.request({
  method: "eth_sendTransaction",
  params: [{
    from: accounts[0],
    to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    value: "0x1000000000000000000" // 1 ETH
  }]
});

// Listen for connection events
provider.on("connect", (connectInfo) => {
  console.log("Connected to chain:", connectInfo.chainId);
});

provider.on("disconnect", () => {
  console.log("Disconnected from wallet");
});
```

## Classes

### ModuleResolutionError

Error thrown when required native modules are not available in the React Native environment.

#### Extends

* `Error`

#### Constructors

##### Constructor

```ts
new ModuleResolutionError(
   moduleName, 
   requiredFor, 
   message?): ModuleResolutionError;
```

Creates a new ModuleResolutionError.

###### Parameters

| Parameter     | Type     | Description                                  |
| ------------- | -------- | -------------------------------------------- |
| `moduleName`  | `string` | The name of the missing module.              |
| `requiredFor` | `string` | The API or feature that requires the module. |
| `message?`    | `string` | Optional custom error message.               |

###### Returns

[`ModuleResolutionError`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#moduleresolutionerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

| Property                             | Modifier | Type     | Description                                          |
| ------------------------------------ | -------- | -------- | ---------------------------------------------------- |
| <a id="modulename" /> `moduleName`   | `public` | `string` | The name of the missing module.                      |
| <a id="requiredfor" /> `requiredFor` | `public` | `string` | The API or feature that requires the missing module. |

***

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

| Parameter        | Type                                                                         |
| ---------------- | ---------------------------------------------------------------------------- |
| `statusCode`     | `number`                                                                     |
| `errorType`      | [`APIErrorType`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#apierrortype) |
| `errorMessage`   | `string`                                                                     |
| `correlationId?` | `string`                                                                     |
| `errorLink?`     | `string`                                                                     |
| `cause?`         | `Error`                                                                      |

###### Returns

[`APIError`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#apierror)

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

| Property                                  | Type                                                                         |
| ----------------------------------------- | ---------------------------------------------------------------------------- |
| <a id="statuscode" /> `statusCode`        | `number`                                                                     |
| <a id="errortype" /> `errorType`          | [`APIErrorType`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#apierrortype) |
| <a id="errormessage" /> `errorMessage`    | `string`                                                                     |
| <a id="correlationid" /> `correlationId?` | `string`                                                                     |
| <a id="errorlink" /> `errorLink?`         | `string`                                                                     |

***

### EIP1193ProviderError

EIP-1193 provider error.

#### Extends

* `Error`

#### Constructors

##### Constructor

```ts
new EIP1193ProviderError(code, message): EIP1193ProviderError;
```

Creates a new EIP-1193 Provider error.

###### Parameters

| Parameter | Type                                                                                 | Description                                |
| --------- | ------------------------------------------------------------------------------------ | ------------------------------------------ |
| `code`    | [`EIP1193ErrorCode`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#eip1193errorcode) | The error code from EIP1193ErrorCode enum. |
| `message` | `string`                                                                             | The error message.                         |

###### Returns

[`EIP1193ProviderError`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#eip1193providererror)

###### Overrides

```ts
Error.constructor
```

#### Properties

| Property               | Modifier | Type                                                                                 | Description                                |
| ---------------------- | -------- | ------------------------------------------------------------------------------------ | ------------------------------------------ |
| <a id="code" /> `code` | `public` | [`EIP1193ErrorCode`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#eip1193errorcode) | The error code from EIP1193ErrorCode enum. |

## Interfaces

### EIP712Domain

The domain of the EIP-712 typed data.

#### Properties

| Property                                          | Type                | Description                                                      |
| ------------------------------------------------- | ------------------- | ---------------------------------------------------------------- |
| <a id="name" /> `name?`                           | `string`            | The name of the DApp or protocol.                                |
| <a id="version" /> `version?`                     | `string`            | The version of the DApp or protocol.                             |
| <a id="chainid" /> `chainId?`                     | `number`            | The chain ID of the EVM network.                                 |
| <a id="salt" /> `salt?`                           | `` `0x${string}` `` | The optional 32-byte 0x-prefixed hex salt for domain separation. |
| <a id="verifyingcontract" /> `verifyingContract?` | `` `0x${string}` `` | The verifying contract address.                                  |

***

### EIP712Types

A mapping of struct names to an array of type objects (name + type).
Each key corresponds to a type name (e.g., "`EIP712Domain`", "`PermitTransferFrom`").

#### Indexable

```ts
[key: string]: unknown
```

***

### EIP712TypedData

The message to sign using EIP-712.

#### Properties

| Property                             | Type                                                                           | Description                                                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| <a id="domain" /> `domain`           | [`EIP712Domain`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#eip712domain)   | -                                                                                                                      |
| <a id="types" /> `types`             | [`EIP712Types`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#eip712types)     | -                                                                                                                      |
| <a id="primarytype" /> `primaryType` | `string`                                                                       | The primary type of the message. This is the name of the struct in the `types` object that is the root of the message. |
| <a id="message" /> `message`         | [`EIP712Message`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#eip712message) | The message to sign. The structure of this message must match the `primaryType` struct in the `types` object.          |

## Type Aliases

### BaseConfig

```ts
type BaseConfig = object;
```

Base configuration for the core package.

#### Properties

| Property                          | Type      | Description                             |
| --------------------------------- | --------- | --------------------------------------- |
| <a id="projectid" /> `projectId`  | `string`  | The CDP Project ID.                     |
| <a id="usemock" /> `useMock?`     | `boolean` | Whether to use the mock implementation. |
| <a id="debugging" /> `debugging?` | `boolean` | Whether to enable debugging.            |
| <a id="basepath" /> `basePath?`   | `string`  | The base path for the API.              |

***

### NetworkConfig

```ts
type NetworkConfig = object;
```

Network-specific configuration.

#### Properties

| Property                        | Type                 | Description                                          |
| ------------------------------- | -------------------- | ---------------------------------------------------- |
| <a id="ethereum" /> `ethereum?` | `object`             | Ethereum/EVM account configuration.                  |
| `ethereum.createOnLogin?`       | `"smart"` \| `"eoa"` | The account type to automatically create on login.   |
| <a id="solana" /> `solana?`     | `object`             | Solana account configuration.                        |
| `solana.createOnLogin?`         | `boolean`            | Whether to automatically create an account on login. |

***

### Config

```ts
type Config = BaseConfig & 
  | {
  ethereum: NonNullable<NetworkConfig["ethereum"]>;
  solana?: NetworkConfig["solana"];
}
  | {
  ethereum?: NetworkConfig["ethereum"];
  solana: NonNullable<NetworkConfig["solana"]>;
}
  | {
  ethereum: NonNullable<NetworkConfig["ethereum"]>;
  solana: NonNullable<NetworkConfig["solana"]>;
};
```

Configuration for the core package with at least one network specified.

***

### Hex

```ts
type Hex = `0x${string}`;
```

A hex string.

***

### EvmAddress

```ts
type EvmAddress = `0x${string}`;
```

An EVM address.

***

### SolanaAddress

```ts
type SolanaAddress = string;
```

An Solana address.

***

### AuthenticationMethods

```ts
type AuthenticationMethods = object;
```

The authentication methods used by the user.

#### Properties

| Property                  | Type                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| <a id="email" /> `email?` | [`EmailAuthentication`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#emailauthentication) |
| <a id="sms" /> `sms?`     | [`SmsAuthentication`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#smsauthentication)     |

***

### User

```ts
type User = object;
```

The User object.

#### Properties

| Property                                                   | Type                                                                                           | Description                                      |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| <a id="userid" /> `userId`                                 | `string`                                                                                       | The user ID.                                     |
| <a id="authenticationmethods-1" /> `authenticationMethods` | [`AuthenticationMethods`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#authenticationmethods) | The authentication methods used by the user.     |
| <a id="evmaccounts" /> `evmAccounts?`                      | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#evmaddress)\[]                    | The EVM accounts associated with the user.       |
| <a id="evmsmartaccounts" /> `evmSmartAccounts?`            | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#evmaddress)\[]                    | The EVM smart accounts associated with the user. |
| <a id="solanaaccounts" /> `solanaAccounts?`                | [`SolanaAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#solanaaddress)\[]              | The Solana accounts associated with the user.    |

***

### EmailAuthentication

```ts
type EmailAuthentication = object;
```

The email authentication method.

#### Properties

| Property                   | Type      | Description                        |
| -------------------------- | --------- | ---------------------------------- |
| <a id="type" /> `type`     | `"email"` | The type of authentication method. |
| <a id="email-1" /> `email` | `string`  | The email address of the user.     |

***

### SmsAuthentication

```ts
type SmsAuthentication = object;
```

The SMS authentication method.

#### Properties

| Property                             | Type     | Description                                       |
| ------------------------------------ | -------- | ------------------------------------------------- |
| <a id="type-1" /> `type`             | `"sms"`  | The type of authentication method.                |
| <a id="phonenumber" /> `phoneNumber` | `string` | The phone number of the end user in E.164 format. |

***

### SignInWithEmailOptions

```ts
type SignInWithEmailOptions = object;
```

Request parameters for signInWithEmail.

#### Properties

| Property                   | Type     |
| -------------------------- | -------- |
| <a id="email-2" /> `email` | `string` |

***

### SignInWithEmailResult

```ts
type SignInWithEmailResult = object;
```

Result of signInWithEmail.

#### Properties

| Property                       | Type     | Description                           |
| ------------------------------ | -------- | ------------------------------------- |
| <a id="message-1" /> `message` | `string` | The message to display to the user.   |
| <a id="flowid" /> `flowId`     | `string` | The flow ID to use in verifyEmailOTP. |

***

### SignInWithSmsOptions

```ts
type SignInWithSmsOptions = object;
```

Request parameters for signInWithSms.

#### Properties

| Property                               | Type     | Description                                                               |
| -------------------------------------- | -------- | ------------------------------------------------------------------------- |
| <a id="phonenumber-1" /> `phoneNumber` | `string` | The phone number of the end user in E.164 format. Example: "+14155552671" |

***

### SignInWithSmsResult

```ts
type SignInWithSmsResult = object;
```

Result of signInWithSms.

#### Properties

| Property                       | Type     | Description                         |
| ------------------------------ | -------- | ----------------------------------- |
| <a id="message-2" /> `message` | `string` | The message to display to the user. |
| <a id="flowid-1" /> `flowId`   | `string` | The flow ID to use in verifySmsOTP. |

***

### VerifyEmailOTPOptions

```ts
type VerifyEmailOTPOptions = object;
```

Request parameters for verifyEmailOTP.

#### Properties

| Property                     | Type     | Description                           |
| ---------------------------- | -------- | ------------------------------------- |
| <a id="flowid-2" /> `flowId` | `string` | The flow ID to use in verifyEmailOTP. |
| <a id="otp" /> `otp`         | `string` | The OTP to verify.                    |

***

### VerifyEmailOTPResult

```ts
type VerifyEmailOTPResult = object;
```

Result of verifyEmailOTP.

#### Properties

| Property                         | Type                                                         | Description                          |
| -------------------------------- | ------------------------------------------------------------ | ------------------------------------ |
| <a id="user-1" /> `user`         | [`User`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#user) | The successfully logged-in user.     |
| <a id="message-3" /> `message`   | `string`                                                     | The message to display to the user.  |
| <a id="isnewuser" /> `isNewUser` | `boolean`                                                    | Whether the user is newly signed up. |

***

### VerifySmsOTPOptions

```ts
type VerifySmsOTPOptions = object;
```

Request parameters for verifySmsOTP.

#### Properties

| Property                     | Type     | Description                         |
| ---------------------------- | -------- | ----------------------------------- |
| <a id="flowid-3" /> `flowId` | `string` | The flow ID to use in verifySmsOTP. |
| <a id="otp-1" /> `otp`       | `string` | The OTP to verify.                  |

***

### VerifySmsOTPResult

```ts
type VerifySmsOTPResult = object;
```

Result of verifySmsOTP.

#### Properties

| Property                           | Type                                                         | Description                          |
| ---------------------------------- | ------------------------------------------------------------ | ------------------------------------ |
| <a id="user-2" /> `user`           | [`User`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#user) | The successfully logged-in user.     |
| <a id="message-4" /> `message`     | `string`                                                     | The message to display to the user.  |
| <a id="isnewuser-1" /> `isNewUser` | `boolean`                                                    | Whether the user is newly signed up. |

***

### OnAuthStateChangeFn()

```ts
type OnAuthStateChangeFn = (user) => void;
```

A callback function when authentication state changes.

#### Parameters

| Parameter | Type                                                                   |
| --------- | ---------------------------------------------------------------------- |
| `user`    | [`User`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#user) \| `null` |

#### Returns

`void`

***

### SignEvmHashOptions

```ts
type SignEvmHashOptions = object;
```

Request parameters for signing a hash with an EVM account.

#### Properties

| Property                           | Type                                                                     | Description                            |
| ---------------------------------- | ------------------------------------------------------------------------ | -------------------------------------- |
| <a id="evmaccount" /> `evmAccount` | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#evmaddress) | The EVM account to sign the hash with. |
| <a id="hash" /> `hash`             | [`Hex`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#hex)               | The hash to sign.                      |

***

### SignEvmHashResult

```ts
type SignEvmHashResult = object;
```

Result of signEvmHash.

#### Properties

| Property                         | Type                                                       | Description    |
| -------------------------------- | ---------------------------------------------------------- | -------------- |
| <a id="signature" /> `signature` | [`Hex`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#hex) | The signature. |

***

### AllowedEvmTransactionType

```ts
type AllowedEvmTransactionType = TransactionSerializableEIP1559;
```

Request parameters for signing an EVM message.

***

### SignEvmTransactionOptions

```ts
type SignEvmTransactionOptions = object;
```

Request parameters for signing an EVM transaction.

#### Properties

| Property                             | Type                                                                                                   | Description                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| <a id="evmaccount-1" /> `evmAccount` | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#evmaddress)                               | The EVM account to sign the message with. |
| <a id="transaction" /> `transaction` | [`AllowedEvmTransactionType`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#allowedevmtransactiontype) | The transaction to sign.                  |

***

### SignEvmTransactionResult

```ts
type SignEvmTransactionResult = object;
```

Result of signEvmTransaction.

#### Properties

| Property                                         | Type                                                       | Description             |
| ------------------------------------------------ | ---------------------------------------------------------- | ----------------------- |
| <a id="signedtransaction" /> `signedTransaction` | [`Hex`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#hex) | The signed transaction. |

***

### SignSolanaTransactionOptions

```ts
type SignSolanaTransactionOptions = object;
```

Request parameters for signing a Solana transaction.

#### Properties

| Property                                 | Type                                                                           | Description                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------ |
| <a id="solanaaccount" /> `solanaAccount` | [`SolanaAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#solanaaddress) | The Solana account to sign the transaction with. |
| <a id="transaction-1" /> `transaction`   | `string`                                                                       | The base64 encoded transaction to sign.          |

***

### SignSolanaTransactionResult

```ts
type SignSolanaTransactionResult = object;
```

Result of signSolanaTransaction.

#### Properties

| Property                                           | Type     | Description                            |
| -------------------------------------------------- | -------- | -------------------------------------- |
| <a id="signedtransaction-1" /> `signedTransaction` | `string` | The base64 encoded signed transaction. |

***

### SignSolanaMessageOptions

```ts
type SignSolanaMessageOptions = object;
```

Request parameters for signing a message with a Solana account.

#### Properties

| Property                                   | Type                                                                           | Description                                  |
| ------------------------------------------ | ------------------------------------------------------------------------------ | -------------------------------------------- |
| <a id="solanaaccount-1" /> `solanaAccount` | [`SolanaAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#solanaaddress) | The Solana account to sign the message with. |
| <a id="message-5" /> `message`             | `string`                                                                       | The message to sign (base64 encoded).        |

***

### SignSolanaMessageResult

```ts
type SignSolanaMessageResult = object;
```

Result of signSolanaMessage.

#### Properties

| Property                           | Type     | Description                   |
| ---------------------------------- | -------- | ----------------------------- |
| <a id="signature-1" /> `signature` | `string` | The base58 encoded signature. |

***

### SendEvmTransactionOptions

```ts
type SendEvmTransactionOptions = object;
```

Request parameters for sending an EVM transaction.

#### Properties

| Property                               | Type                                                                                                                                               | Description                                   |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| <a id="evmaccount-2" /> `evmAccount`   | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#evmaddress)                                                                           | The EVM account to send the transaction with. |
| <a id="network" /> `network`           | [`SendEvmTransactionWithEndUserAccountBodyNetwork`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#sendevmtransactionwithenduseraccountbodynetwork) | The network to send the transaction to.       |
| <a id="transaction-2" /> `transaction` | [`AllowedEvmTransactionType`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#allowedevmtransactiontype)                                             | The transaction to send.                      |

***

### SendEvmTransactionResult

```ts
type SendEvmTransactionResult = object;
```

Result of sendEvmTransaction.

#### Properties

| Property                                     | Type                                                       | Description           |
| -------------------------------------------- | ---------------------------------------------------------- | --------------------- |
| <a id="transactionhash" /> `transactionHash` | [`Hex`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#hex) | The transaction hash. |

***

### SendSolanaTransactionOptions

```ts
type SendSolanaTransactionOptions = object;
```

Request parameters for sending a Solana transaction.

#### Properties

| Property                                   | Type                                                                                                                                                     | Description                                      |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| <a id="solanaaccount-2" /> `solanaAccount` | [`SolanaAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#solanaaddress)                                                                           | The Solana account to send the transaction with. |
| <a id="network-1" /> `network`             | [`SendSolanaTransactionWithEndUserAccountBodyNetwork`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#sendsolanatransactionwithenduseraccountbodynetwork) | The network to send the transaction to.          |
| <a id="transaction-3" /> `transaction`     | `string`                                                                                                                                                 | The base64 encoded transaction to send.          |

***

### SendSolanaTransactionResult

```ts
type SendSolanaTransactionResult = object;
```

Result of sendSolanaTransaction.

#### Properties

| Property                                               | Type     | Description                |
| ------------------------------------------------------ | -------- | -------------------------- |
| <a id="transactionsignature" /> `transactionSignature` | `string` | The transaction signature. |

***

### SignEvmMessageOptions

```ts
type SignEvmMessageOptions = object;
```

Request parameters for signing an EVM message.

#### Properties

| Property                             | Type                                                                     | Description                               |
| ------------------------------------ | ------------------------------------------------------------------------ | ----------------------------------------- |
| <a id="evmaccount-3" /> `evmAccount` | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#evmaddress) | The EVM account to sign the message with. |
| <a id="message-6" /> `message`       | `string`                                                                 | The message to sign.                      |

***

### SignEvmMessageResult

```ts
type SignEvmMessageResult = object;
```

Result of signEvmMessage.

#### Properties

| Property                           | Type                                                       | Description    |
| ---------------------------------- | ---------------------------------------------------------- | -------------- |
| <a id="signature-2" /> `signature` | [`Hex`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#hex) | The signature. |

***

### EIP712Message

```ts
type EIP712Message = object;
```

The message to sign. The structure of this message must match the `primaryType` struct in the `types` object.

#### Index Signature

```ts
[key: string]: unknown
```

***

### SignEvmTypedDataOptions

```ts
type SignEvmTypedDataOptions = object;
```

Request parameters for signing EIP-712 typed data with an EVM account.

#### Properties

| Property                             | Type                                                                               | Description                                  |
| ------------------------------------ | ---------------------------------------------------------------------------------- | -------------------------------------------- |
| <a id="evmaccount-4" /> `evmAccount` | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#evmaddress)           | The EVM account to sign the typed data with. |
| <a id="typeddata" /> `typedData`     | [`EIP712TypedData`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#eip712typeddata) | The EIP-712 typed data to sign.              |

***

### EvmCall

```ts
type EvmCall = object;
```

Represents a call in an EVM user operation.

#### Properties

| Property                  | Type                                                                     | Description                               |
| ------------------------- | ------------------------------------------------------------------------ | ----------------------------------------- |
| <a id="to" /> `to`        | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#evmaddress) | The target address for the call.          |
| <a id="value" /> `value?` | `bigint`                                                                 | The value to send with the call (in wei). |
| <a id="data" /> `data?`   | [`Hex`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#hex)               | The data to send with the call.           |

***

### SendUserOperationOptions

```ts
type SendUserOperationOptions = object;
```

Request parameters for sending a user operation.

#### Properties

| Property                                      | Type                                                                                                                                               | Description                                                                                                                                                    |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="evmsmartaccount" /> `evmSmartAccount`  | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#evmaddress)                                                                           | The EVM Smart Account to send the user operation with.                                                                                                         |
| <a id="network-2" /> `network`                | [`SendEvmTransactionWithEndUserAccountBodyNetwork`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#sendevmtransactionwithenduseraccountbodynetwork) | The network to send the user operation on.                                                                                                                     |
| <a id="calls" /> `calls`                      | [`EvmCall`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#evmcall)\[]                                                                              | The calls to make from the user operation.                                                                                                                     |
| <a id="usecdppaymaster" /> `useCdpPaymaster?` | `boolean`                                                                                                                                          | Whether to use the CDP Paymaster for the user operation.                                                                                                       |
| <a id="paymasterurl" /> `paymasterUrl?`       | `string`                                                                                                                                           | The URL of the paymaster to use for the user operation. Get your free Base paymaster URL [from the CDP Portal](https://portal.cdp.coinbase.com/products/node). |

***

### SendUserOperationResult

```ts
type SendUserOperationResult = object;
```

Result of sendUserOperation.

#### Properties

| Property                                         | Type                                                       | Description              |
| ------------------------------------------------ | ---------------------------------------------------------- | ------------------------ |
| <a id="useroperationhash" /> `userOperationHash` | [`Hex`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#hex) | The user operation hash. |

***

### GetUserOperationOptions

```ts
type GetUserOperationOptions = object;
```

Request parameters for getting a user operation.

#### Properties

| Property                                           | Type                                                                                                                                               | Description                                         |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| <a id="useroperationhash-1" /> `userOperationHash` | [`Hex`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#hex)                                                                                         | The user operation hash.                            |
| <a id="evmsmartaccount-1" /> `evmSmartAccount`     | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#evmaddress)                                                                           | The EVM Smart Account that sent the user operation. |
| <a id="network-3" /> `network`                     | [`SendEvmTransactionWithEndUserAccountBodyNetwork`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#sendevmtransactionwithenduseraccountbodynetwork) | The network the user operation was sent on.         |

***

### GetUserOperationResult

```ts
type GetUserOperationResult = EvmUserOperation;
```

Result of getUserOperation.

***

### SignEvmTypedDataResult

```ts
type SignEvmTypedDataResult = object;
```

Result of signEvmTypedData.

#### Properties

| Property                           | Type                                                       | Description    |
| ---------------------------------- | ---------------------------------------------------------- | -------------- |
| <a id="signature-3" /> `signature` | [`Hex`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#hex) | The signature. |

***

### ExportEvmAccountOptions

```ts
type ExportEvmAccountOptions = object;
```

Request parameters for exporting an EVM account's private key.

#### Properties

| Property                             | Type                                                                     | Description                |
| ------------------------------------ | ------------------------------------------------------------------------ | -------------------------- |
| <a id="evmaccount-5" /> `evmAccount` | [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#evmaddress) | The EVM account to export. |

***

### ExportEvmAccountResult

```ts
type ExportEvmAccountResult = object;
```

Result of exportEvmAccount.

#### Properties

| Property                           | Type     | Description                                     |
| ---------------------------------- | -------- | ----------------------------------------------- |
| <a id="privatekey" /> `privateKey` | `string` | The 32 byte raw private key of the EVM account. |

***

### ExportSolanaAccountOptions

```ts
type ExportSolanaAccountOptions = object;
```

Request parameters for exporting a Solana account's private key.

#### Properties

| Property                                   | Type                                                                           | Description                   |
| ------------------------------------------ | ------------------------------------------------------------------------------ | ----------------------------- |
| <a id="solanaaccount-3" /> `solanaAccount` | [`SolanaAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#solanaaddress) | The Solana account to export. |

***

### ExportSolanaAccountResult

```ts
type ExportSolanaAccountResult = object;
```

Result of exportSolanaAccount.

#### Properties

| Property                             | Type     | Description                                        |
| ------------------------------------ | -------- | -------------------------------------------------- |
| <a id="privatekey-1" /> `privateKey` | `string` | The 32 byte raw private key of the Solana account. |

***

### CDPEmbeddedWalletConfig\<chains>

```ts
type CDPEmbeddedWalletConfig<chains> = object;
```

Config parameters for the CDP embedded wallet 1193 provider.

Note: The transports are currently only used for non-Base transactions. For non-Base transactions,
the provider internally signs the transaction via the CDP APIs and broadcasts it via the provided
transports, whereas for Base transactions the CDP API both signs and broadcasts the transaction.

#### Type Parameters

| Type Parameter                                       | Default type                      | Description           |
| ---------------------------------------------------- | --------------------------------- | --------------------- |
| `chains` *extends* readonly \[`Chain`, `...Chain[]`] | readonly \[`Chain`, `...Chain[]`] | The chains to support |

#### Properties

| Property                                        | Type                                                 | Description                                    |
| ----------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------- |
| <a id="chains-1" /> `chains`                    | `chains`                                             | -                                              |
| <a id="transports" /> `transports`              | `Record`\<`chains`\[`number`]\[`"id"`], `Transport`> | The transports to use for each chain           |
| <a id="announceprovider" /> `announceProvider?` | `boolean`                                            | Whether to announce the provider to the wallet |

***

### EIP1193Provider

```ts
type EIP1193Provider = ox_Provider.Provider;
```

EIP-1193 Provider interface - we likely will extend this in the future.

***

### CDPEmbeddedWallet

```ts
type CDPEmbeddedWallet = object;
```

A type representing a CDP embedded wallet, for now is just a provider + cleanup function

#### Properties

| Property                       | Type                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| <a id="provider" /> `provider` | [`EIP1193Provider`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#eip1193provider) |

***

### EIP1193RequestFunctionType

```ts
type EIP1193RequestFunctionType = ox_Provider.Provider;
```

***

### AccountsRequest

```ts
type AccountsRequest = object;
```

A request to the eth\_accounts method.

#### Properties

| Property                   | Type             |
| -------------------------- | ---------------- |
| <a id="method" /> `method` | `"eth_accounts"` |
| <a id="params" /> `params` | \[]              |

***

### RequestAccountsRequest

```ts
type RequestAccountsRequest = object;
```

A request to the eth\_requestAccounts method.

#### Properties

| Property                     | Type                    |
| ---------------------------- | ----------------------- |
| <a id="method-1" /> `method` | `"eth_requestAccounts"` |
| <a id="params-1" /> `params` | \[]                     |

***

### PersonalSignRequest

```ts
type PersonalSignRequest = object;
```

A request to the personal\_sign method.

#### Properties

| Property                     | Type                                        |
| ---------------------------- | ------------------------------------------- |
| <a id="method-2" /> `method` | `"personal_sign"`                           |
| <a id="params-2" /> `params` | \[`` `0x${string}` ``, `` `0x${string}` ``] |

***

### SendTransactionRequestParams

```ts
type SendTransactionRequestParams = [{
  chainId?: `0x${string}`;
  data?: Hex;
  from: EvmAddress;
  to: EvmAddress;
  value: Hex;
  nonce?: Hex;
  gas?: Hex;
  maxFeePerGas?: Hex;
  maxPriorityFeePerGas?: Hex;
  type?: "eip1559";
}];
```

Transaction parameters for the eth\_sendTransaction method.

***

### SendTransactionRequest

```ts
type SendTransactionRequest = object;
```

A request to the eth\_sendTransaction method.

#### Properties

| Property                     | Type                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| <a id="method-3" /> `method` | `"eth_sendTransaction"`                                                                                      |
| <a id="params-3" /> `params` | [`SendTransactionRequestParams`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#sendtransactionrequestparams) |

***

### SignTypedDataRequest

```ts
type SignTypedDataRequest = object;
```

A request to the eth\_signTypedData\_v4 method.

#### Properties

| Property                     | Type                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| <a id="method-4" /> `method` | `"eth_signTypedData_v4"`                                                              |
| <a id="params-4" /> `params` | \[[`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#evmaddress), `string`] |

***

### EthSignRequest

```ts
type EthSignRequest = object;
```

A request to the eth\_sign method.

#### Properties

| Property                     | Type                                                                                                                                    |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="method-5" /> `method` | `"eth_sign"`                                                                                                                            |
| <a id="params-5" /> `params` | \[[`Hex`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#hex), [`EvmAddress`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#evmaddress)] |

***

### ChainIdRequest

```ts
type ChainIdRequest = object;
```

A request to the eth\_chainId method.

#### Properties

| Property                     | Type            |
| ---------------------------- | --------------- |
| <a id="method-6" /> `method` | `"eth_chainId"` |
| <a id="params-6" /> `params` | \[]             |

***

### WalletDisconnectRequest

```ts
type WalletDisconnectRequest = object;
```

A request to the disconnect the wallet

#### Properties

| Property                     | Type                  |
| ---------------------------- | --------------------- |
| <a id="method-7" /> `method` | `"wallet_disconnect"` |
| <a id="params-7" /> `params` | \[]                   |

***

### SwitchEthereumChainRequest

```ts
type SwitchEthereumChainRequest = object;
```

A request to switch to the specified Ethereum chain

#### Properties

| Property                     | Type                           |
| ---------------------------- | ------------------------------ |
| <a id="method-8" /> `method` | `"wallet_switchEthereumChain"` |
| <a id="params-8" /> `params` | \[\{ `chainId`: `string`; }]   |

***

### SendCallsRequest

```ts
type SendCallsRequest = object;
```

A request to send one or more calls to the specified Ethereum chain

#### Properties

| Property                     | Type                        |
| ---------------------------- | --------------------------- |
| <a id="method-9" /> `method` | `"wallet_sendCalls"`        |
| <a id="params-9" /> `params` | \[\{ `calls`: `Call`\[]; }] |

***

### GetCallsStatusRequest

```ts
type GetCallsStatusRequest = object;
```

A request to get the status of one or more calls

#### Properties

| Property                      | Type                      |
| ----------------------------- | ------------------------- |
| <a id="method-10" /> `method` | `"wallet_getCallsStatus"` |
| <a id="params-10" /> `params` | \[`` `0x${string}` ``]    |

***

### GetCapabilitiesRequest

```ts
type GetCapabilitiesRequest = object;
```

A request to get the capabilities of the wallet

#### Properties

| Property                      | Type                       |
| ----------------------------- | -------------------------- |
| <a id="method-11" /> `method` | `"wallet_getCapabilities"` |
| <a id="params-11" /> `params` | \[]                        |

***

### UnknownRequest

```ts
type UnknownRequest = object;
```

A request to the EIP-1193 provider that we can't strongly type

#### Properties

| Property                      | Type         |
| ----------------------------- | ------------ |
| <a id="method-12" /> `method` | `string`     |
| <a id="params-12" /> `params` | `unknown`\[] |

***

### ProviderRequest

```ts
type ProviderRequest = 
  | AccountsRequest
  | RequestAccountsRequest
  | PersonalSignRequest
  | SendTransactionRequest
  | SignTypedDataRequest
  | EthSignRequest
  | ChainIdRequest
  | WalletDisconnectRequest
  | SwitchEthereumChainRequest
  | SendCallsRequest
  | GetCallsStatusRequest
  | GetCapabilitiesRequest;
```

A type representing all supported EIP-1193 requests, strongly typed

***

### ExactPartial\<T>

```ts
type ExactPartial<T> = { [P in keyof T]?: T[P] extends object ? ExactPartial<T[P]> : T[P] };
```

A type that makes all properties of an object optional.

#### Type Parameters

| Type Parameter | Description               |
| -------------- | ------------------------- |
| `T`            | The type to make partial. |

#### Returns

The partial type.

***

### ProviderState

```ts
type ProviderState = object;
```

The attributes/methods representing the state of the provider

#### Properties

| Property                           | Type                                                                   |
| ---------------------------------- | ---------------------------------------------------------------------- |
| <a id="chainid-1" /> `chainId`     | `number`                                                               |
| <a id="setchainid" /> `setChainId` | (`chainId`) => `void`                                                  |
| <a id="chains-2" /> `chains`       | readonly \[`Chain`, `...Chain[]`]                                      |
| <a id="user-3" /> `user`           | [`User`](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-core#user) \| `null` |
| <a id="setuser" /> `setUser`       | (`user`) => `void`                                                     |

***

### ProviderStoreInstance

```ts
type ProviderStoreInstance = Mutate<StoreApi<ProviderState>, [["zustand/subscribeWithSelector", never], ["zustand/persist", ProviderState]]>;
```

The instance of the Zustand provider store

***

### WalletCapabilities

```ts
type WalletCapabilities = object;
```

The capabilities of the wallet by chainId. If the wallet does not support Smart Account operations on a chain, it will not be included in the object.

#### Index Signature

```ts
[chainId: `0x${string}`]: object
```

#### See

[https://eips.ethereum.org/EIPS/eip-5792#wallet\_getcapabilities](https://eips.ethereum.org/EIPS/eip-5792#wallet_getcapabilities)

***

### APIErrorType

```ts
type APIErrorType = 
  | ErrorType
  | HttpErrorType;
```

***

### ErrorType

```ts
type ErrorType = typeof ErrorType[keyof typeof ErrorType];
```

***

### HttpErrorType

```ts
type HttpErrorType = typeof HttpErrorType[keyof typeof HttpErrorType];
```

***

### SendEvmTransactionWithEndUserAccountBodyNetwork

```ts
type SendEvmTransactionWithEndUserAccountBodyNetwork = typeof SendEvmTransactionWithEndUserAccountBodyNetwork[keyof typeof SendEvmTransactionWithEndUserAccountBodyNetwork];
```

***

### SendSolanaTransactionWithEndUserAccountBodyNetwork

```ts
type SendSolanaTransactionWithEndUserAccountBodyNetwork = typeof SendSolanaTransactionWithEndUserAccountBodyNetwork[keyof typeof SendSolanaTransactionWithEndUserAccountBodyNetwork];
```

***

### EIP1193ErrorCode

```ts
type EIP1193ErrorCode = typeof STANDARD_ERROR_CODES["provider"][keyof typeof STANDARD_ERROR_CODES["provider"]];
```

EIP1193-defined error codes

***

### RPCErrorCode

```ts
type RPCErrorCode = typeof STANDARD_ERROR_CODES["rpc"][keyof typeof STANDARD_ERROR_CODES["rpc"]];
```

Standard JSON-RPC error codes

## Variables

### ErrorType

```ts
ErrorType: object;
```

#### Type declaration

##### already\_exists

```ts
readonly already_exists: "already_exists";
```

##### bad\_gateway

```ts
readonly bad_gateway: "bad_gateway";
```

##### faucet\_limit\_exceeded

```ts
readonly faucet_limit_exceeded: "faucet_limit_exceeded";
```

##### forbidden

```ts
readonly forbidden: "forbidden";
```

##### idempotency\_error

```ts
readonly idempotency_error: "idempotency_error";
```

##### internal\_server\_error

```ts
readonly internal_server_error: "internal_server_error";
```

##### invalid\_request

```ts
readonly invalid_request: "invalid_request";
```

##### invalid\_sql\_query

```ts
readonly invalid_sql_query: "invalid_sql_query";
```

##### invalid\_signature

```ts
readonly invalid_signature: "invalid_signature";
```

##### malformed\_transaction

```ts
readonly malformed_transaction: "malformed_transaction";
```

##### not\_found

```ts
readonly not_found: "not_found";
```

##### payment\_method\_required

```ts
readonly payment_method_required: "payment_method_required";
```

##### rate\_limit\_exceeded

```ts
readonly rate_limit_exceeded: "rate_limit_exceeded";
```

##### request\_canceled

```ts
readonly request_canceled: "request_canceled";
```

##### service\_unavailable

```ts
readonly service_unavailable: "service_unavailable";
```

##### timed\_out

```ts
readonly timed_out: "timed_out";
```

##### unauthorized

```ts
readonly unauthorized: "unauthorized";
```

##### policy\_violation

```ts
readonly policy_violation: "policy_violation";
```

##### policy\_in\_use

```ts
readonly policy_in_use: "policy_in_use";
```

##### account\_limit\_exceeded

```ts
readonly account_limit_exceeded: "account_limit_exceeded";
```

##### network\_not\_tradable

```ts
readonly network_not_tradable: "network_not_tradable";
```

##### guest\_permission\_denied

```ts
readonly guest_permission_denied: "guest_permission_denied";
```

##### guest\_region\_forbidden

```ts
readonly guest_region_forbidden: "guest_region_forbidden";
```

##### guest\_transaction\_limit

```ts
readonly guest_transaction_limit: "guest_transaction_limit";
```

##### guest\_transaction\_count

```ts
readonly guest_transaction_count: "guest_transaction_count";
```

##### phone\_number\_verification\_expired

```ts
readonly phone_number_verification_expired: "phone_number_verification_expired";
```

##### document\_verification\_failed

```ts
readonly document_verification_failed: "document_verification_failed";
```

##### recipient\_allowlist\_violation

```ts
readonly recipient_allowlist_violation: "recipient_allowlist_violation";
```

##### recipient\_allowlist\_pending

```ts
readonly recipient_allowlist_pending: "recipient_allowlist_pending";
```

##### travel\_rules\_recipient\_violation

```ts
readonly travel_rules_recipient_violation: "travel_rules_recipient_violation";
```

***

### HttpErrorType

```ts
const HttpErrorType: object;
```

#### Type declaration

##### unexpected\_error

```ts
readonly unexpected_error: "unexpected_error";
```

##### unauthorized

```ts
readonly unauthorized: "unauthorized";
```

##### not\_found

```ts
readonly not_found: "not_found";
```

##### bad\_gateway

```ts
readonly bad_gateway: "bad_gateway";
```

##### service\_unavailable

```ts
readonly service_unavailable: "service_unavailable";
```

##### unknown

```ts
readonly unknown: "unknown";
```

***

### SendEvmTransactionWithEndUserAccountBodyNetwork

```ts
SendEvmTransactionWithEndUserAccountBodyNetwork: object;
```

#### Type declaration

##### base

```ts
readonly base: "base";
```

##### base-sepolia

```ts
readonly base-sepolia: "base-sepolia";
```

##### ethereum

```ts
readonly ethereum: "ethereum";
```

##### ethereum-sepolia

```ts
readonly ethereum-sepolia: "ethereum-sepolia";
```

##### avalanche

```ts
readonly avalanche: "avalanche";
```

##### polygon

```ts
readonly polygon: "polygon";
```

##### optimism

```ts
readonly optimism: "optimism";
```

##### arbitrum

```ts
readonly arbitrum: "arbitrum";
```

***

### SendSolanaTransactionWithEndUserAccountBodyNetwork

```ts
SendSolanaTransactionWithEndUserAccountBodyNetwork: object;
```

#### Type declaration

##### solana

```ts
readonly solana: "solana";
```

##### solana-devnet

```ts
readonly solana-devnet: "solana-devnet";
```

***

### STANDARD\_ERROR\_CODES

```ts
const STANDARD_ERROR_CODES: object;
```

Standard error codes for EIP1193 providers and JSON-RPC methods

#### Type declaration

##### rpc

```ts
rpc: object;
```

###### Type declaration

###### rpc.invalidInput

```ts
invalidInput: -32000;
```

###### rpc.resourceNotFound

```ts
resourceNotFound: -32001;
```

###### rpc.resourceUnavailable

```ts
resourceUnavailable: -32002;
```

###### rpc.transactionRejected

```ts
transactionRejected: -32003;
```

###### rpc.methodNotSupported

```ts
methodNotSupported: -32004;
```

###### rpc.limitExceeded

```ts
limitExceeded: -32005;
```

###### rpc.parse

```ts
parse: -32700;
```

###### rpc.invalidRequest

```ts
invalidRequest: -32600;
```

###### rpc.methodNotFound

```ts
methodNotFound: -32601;
```

###### rpc.invalidParams

```ts
invalidParams: -32602;
```

###### rpc.internal

```ts
internal: -32603;
```

##### provider

```ts
provider: object;
```

###### Type declaration

###### provider.userRejectedRequest

```ts
userRejectedRequest: 4001;
```

###### provider.unauthorized

```ts
unauthorized: 4100;
```

###### provider.unsupportedMethod

```ts
unsupportedMethod: 4200;
```

###### provider.disconnected

```ts
disconnected: 4900;
```

###### provider.chainDisconnected

```ts
chainDisconnected: 4901;
```

###### provider.unsupportedChain

```ts
unsupportedChain: 4902;
```
