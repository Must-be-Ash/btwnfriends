# Actions

## Type Aliases

### AccountActions

```ts
type AccountActions = Actions & {
  quoteSwap: (options: AccountQuoteSwapOptions) => Promise<AccountQuoteSwapResult>;
  sendTransaction: (options: Omit<SendTransactionOptions, "address">) => Promise<TransactionResult>;
  swap: (options: AccountSwapOptions) => Promise<AccountSwapResult>;
  transfer: (options: TransferOptions) => Promise<{
     transactionHash: Hex;
  }>;
  useSpendPermission: (options: UseSpendPermissionOptions) => Promise<TransactionResult>;
};
```

Defined in: [src/actions/evm/types.ts:148](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/actions/evm/types.ts#L148)

#### Type declaration

##### quoteSwap()

```ts
quoteSwap: (options: AccountQuoteSwapOptions) => Promise<AccountQuoteSwapResult>;
```

Creates a swap quote without executing the transaction.
This is useful when you need to get swap details before executing the swap.
The taker is automatically set to the account's address.

###### Parameters

###### options

`AccountQuoteSwapOptions`

Configuration options for creating the swap quote.

###### Returns

`Promise`\<`AccountQuoteSwapResult`>

A promise that resolves to the swap quote or a response indicating that liquidity is unavailable.

###### Example

```ts
const swapQuote = await account.quoteSwap({
  network: "base",
  fromToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  toToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  fromAmount: BigInt("1000000000000000000"), // 1 WETH in wei
});

if (swapQuote.liquidityAvailable) {
  console.log(`Can swap for ${swapQuote.toAmount} USDC`);
}
```

##### sendTransaction()

```ts
sendTransaction: (options: Omit<SendTransactionOptions, "address">) => Promise<TransactionResult>;
```

Signs an EVM transaction and sends it to the specified network using the Coinbase API.
This method handles nonce management and gas estimation automatically.

###### Parameters

###### options

`Omit`\<`SendTransactionOptions`, `"address"`>

Configuration options for sending the transaction.

###### Returns

`Promise`\<`TransactionResult`>

A promise that resolves to the transaction hash.

###### Examples

**Sending an RLP-encoded transaction**

```ts
import { parseEther, serializeTransaction } from "viem";
import { baseSepolia } from "viem/chains";

const { transactionHash } = await account.sendTransaction({
  transaction: serializeTransaction({
    to: "0x4252e0c9A3da5A2700e7d91cb50aEf522D0C6Fe8",
    value: parseEther("0.000001"),
    chainId: baseSepolia.id,
    // Fields below are optional, CDP API will populate them if omitted.
    // nonce
    // maxPriorityFeePerGas
    // maxFeePerGas
    // gas
  }),
  network: "base-sepolia",
});
```

**Sending an EIP-1559 transaction request object**

```ts
const { transactionHash } = await account.sendTransaction({
  transaction: {
    to: "0x4252e0c9A3da5A2700e7d91cb50aEf522D0C6Fe8",
    value: parseEther("0.000001"),
    // Fields below are optional, CDP API will populate them if omitted.
    // nonce
    // maxPriorityFeePerGas
    // maxFeePerGas
    // gas
  },
  network: "base-sepolia",
});
```

##### swap()

```ts
swap: (options: AccountSwapOptions) => Promise<AccountSwapResult>;
```

Executes a token swap on the specified network.
This method handles all the steps required for a swap, including Permit2 signatures if needed.
The taker is automatically set to the account's address.

###### Parameters

###### options

`AccountSwapOptions`

Configuration options for the swap.

###### Returns

`Promise`\<`AccountSwapResult`>

A promise that resolves to the transaction hash.

###### Throws

If liquidity is not available when using inline options.

###### Examples

```ts
// First create a swap quote
const swapQuote = await cdp.evm.createSwapQuote({
  network: "base",
  toToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  fromToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  fromAmount: BigInt("1000000000000000000"), // 1 WETH in wei
  taker: account.address
});

// Check if liquidity is available
if (!swapQuote.liquidityAvailable) {
  console.error("Insufficient liquidity for swap");
  return;
}

// Execute the swap
const { transactionHash } = await account.swap({
  swapQuote: swapQuote
});

console.log(`Swap executed with transaction hash: ${transactionHash}`);
```

```ts
// Create and execute swap in one call
const { transactionHash } = await account.swap({
  network: "base",
  toToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  fromToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  fromAmount: BigInt("1000000000000000000"), // 1 WETH in wei
});

console.log(`Swap executed with transaction hash: ${transactionHash}`);
```

##### transfer()

```ts
transfer: (options: TransferOptions) => Promise<{
  transactionHash: Hex;
}>;
```

Transfer an amount of a token from an account to another account.

###### Parameters

###### options

`TransferOptions`

The options for the transfer.

###### Returns

`Promise`\<\{
`transactionHash`: `Hex`;
}>

An object containing the transaction hash.

###### Examples

```typescript
const { transactionHash } = await sender.transfer({
  to: "0x9F663335Cd6Ad02a37B633602E98866CF944124d",
  amount: 10000n, // equivalent to 0.01 USDC
  token: "usdc",
  network: "base-sepolia",
});
```

**Using parseUnits to specify USDC amount**

```typescript
import { parseUnits } from "viem";

const { transactionHash } = await sender.transfer({
  to: "0x9F663335Cd6Ad02a37B633602E98866CF944124d",
  amount: parseUnits("0.01", 6), // USDC uses 6 decimal places
  token: "usdc",
  network: "base-sepolia",
});
```

**Transfer ETH**

```typescript
import { parseEther } from "viem";

const { transactionHash } = await sender.transfer({
  to: "0x9F663335Cd6Ad02a37B633602E98866CF944124d",
  amount: parseEther("0.000001"),
  token: "eth",
  network: "base-sepolia",
});
```

**Using a contract address**

```typescript
import { parseEther } from "viem";

const { transactionHash } = await sender.transfer({
  to: "0x9F663335Cd6Ad02a37B633602E98866CF944124d",
  amount: parseEther("0.000001"),
  token: "0x4200000000000000000000000000000000000006", // WETH on Base Sepolia
  network: "base-sepolia",
});
```

**Transfer to another account**

```typescript
const sender = await cdp.evm.createAccount({ name: "Sender" });
const receiver = await cdp.evm.createAccount({ name: "Receiver" });

const { transactionHash } = await sender.transfer({
  to: receiver,
  amount: 10000n, // equivalent to 0.01 USDC
  token: "usdc",
  network: "base-sepolia",
});
```

##### useSpendPermission()

```ts
useSpendPermission: (options: UseSpendPermissionOptions) => Promise<TransactionResult>;
```

Uses a spend permission to execute a transaction.
This allows the account to spend tokens that have been approved via a spend permission.

###### Parameters

###### options

`UseSpendPermissionOptions`

Configuration options for using the spend permission.

###### Returns

`Promise`\<`TransactionResult`>

A promise that resolves to the transaction result.

###### Throws

If the network doesn't support spend permissions via CDP API.

###### Example

```typescript
const spendPermission = {
  account: "0x1234...", // Smart account that owns the tokens
  spender: account.address, // This account that can spend
  token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // ETH
  allowance: parseEther("0.01"),
  period: 86400, // 1 day
  start: 0,
  end: 281474976710655,
  salt: 0n,
  extraData: "0x",
};

const result = await account.useSpendPermission({
  spendPermission,
  value: parseEther("0.001"), // Spend 0.001 ETH
  network: "base-sepolia",
});
```

***

### Actions

```ts
type Actions = {
  fund: (options: Omit<EvmFundOptions, "address">) => Promise<FundOperationResult>;
  listTokenBalances: (options: Omit<ListTokenBalancesOptions, "address">) => Promise<ListTokenBalancesResult>;
  quoteFund: (options: Omit<EvmQuoteFundOptions, "address">) => Promise<EvmQuote>;
  requestFaucet: (options: Omit<RequestFaucetOptions, "address">) => Promise<RequestFaucetResult>;
  waitForFundOperationReceipt: Promise<WaitForFundOperationResult>;
};
```

Defined in: [src/actions/evm/types.ts:42](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/actions/evm/types.ts#L42)

#### Properties

##### fund()

```ts
fund: (options: Omit<EvmFundOptions, "address">) => Promise<FundOperationResult>;
```

Defined in: [src/actions/evm/types.ts:126](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/actions/evm/types.ts#L126)

Funds an EVM account with the specified token amount.

###### Parameters

###### options

`Omit`\<`EvmFundOptions`, `"address"`>

The options for the fund operation.

###### Returns

`Promise`\<`FundOperationResult`>

A promise that resolves to the fund operation result containing the transfer details.

###### Example

```ts
const fundOperation = await account.fund({
  network: "base",
  token: "usdc",
  amount: 1000000n,
});
```

##### listTokenBalances()

```ts
listTokenBalances: (options: Omit<ListTokenBalancesOptions, "address">) => Promise<ListTokenBalancesResult>;
```

Defined in: [src/actions/evm/types.ts:58](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/actions/evm/types.ts#L58)

List the token balances of an account.

###### Parameters

###### options

`Omit`\<`ListTokenBalancesOptions`, `"address"`>

The options for the list token balances.

###### Returns

`Promise`\<`ListTokenBalancesResult`>

The result of the list token balances.

###### Example

```typescript
const balances = await account.listTokenBalances({
  network: "base-sepolia",
});
```

##### quoteFund()

```ts
quoteFund: (options: Omit<EvmQuoteFundOptions, "address">) => Promise<EvmQuote>;
```

Defined in: [src/actions/evm/types.ts:103](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/actions/evm/types.ts#L103)

Gets a quote to fund an EVM account.

###### Parameters

###### options

`Omit`\<`EvmQuoteFundOptions`, `"address"`>

The options for the quote fund.

###### Returns

`Promise`\<`EvmQuote`>

A promise that resolves to a Quote object containing details about the funding operation.

###### Example

```ts
const quote = await account.quoteFund({
  network: "base",
  token: "usdc",
  amount: 1000000n,
});
```

##### requestFaucet()

```ts
requestFaucet: (options: Omit<RequestFaucetOptions, "address">) => Promise<RequestFaucetResult>;
```

Defined in: [src/actions/evm/types.ts:80](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/actions/evm/types.ts#L80)

Requests funds from an EVM faucet.

###### Parameters

###### options

`Omit`\<`RequestFaucetOptions`, `"address"`>

Parameters for requesting funds from the EVM faucet.

###### Returns

`Promise`\<`RequestFaucetResult`>

A promise that resolves to the transaction hash.

###### Example

```ts
const result = await account.requestFaucet({
  network: "base-sepolia",
  token: "eth",
});
```

#### Methods

##### waitForFundOperationReceipt()

```ts
waitForFundOperationReceipt(options: WaitForFundOperationOptions): Promise<WaitForFundOperationResult>;
```

Defined in: [src/actions/evm/types.ts:143](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/actions/evm/types.ts#L143)

Waits for a fund operation to complete and returns the transfer receipt.

###### Parameters

###### options

`WaitForFundOperationOptions`

The options for the wait for fund operation.

###### Returns

`Promise`\<`WaitForFundOperationResult`>

A promise that resolves to the completed transfer receipt containing details about the funding operation.

###### Example

```ts
const completedTransfer = await account.waitForFundOperationReceipt({
  transferId: "transfer_123",
});
```

***

### SmartAccountActions

```ts
type SmartAccountActions = Actions & {
  getUserOperation: (options: Omit<GetUserOperationOptions, "smartAccount">) => Promise<UserOperation>;
  quoteSwap: (options: SmartAccountQuoteSwapOptions) => Promise<SmartAccountQuoteSwapResult>;
  sendUserOperation: (options: Omit<SendUserOperationOptions<unknown[]>, "smartAccount">) => Promise<SendUserOperationReturnType>;
  signTypedData: (options: Omit<SignTypedDataOptions, "address"> & {
     network: KnownEvmNetworks;
  }) => Promise<Hex>;
  swap: (options: SmartAccountSwapOptions) => Promise<SmartAccountSwapResult>;
  transfer: (options: SmartAccountTransferOptions) => Promise<SendUserOperationReturnType>;
  useSpendPermission: (options: UseSpendPermissionOptions) => Promise<SendUserOperationReturnType>;
  waitForUserOperation: (options: Omit<WaitForUserOperationOptions, "smartAccountAddress">) => Promise<WaitForUserOperationReturnType>;
};
```

Defined in: [src/actions/evm/types.ts:399](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/actions/evm/types.ts#L399)

#### Type declaration

##### getUserOperation()

```ts
getUserOperation: (options: Omit<GetUserOperationOptions, "smartAccount">) => Promise<UserOperation>;
```

Gets a user operation by its hash.

###### Parameters

###### options

`Omit`\<[`GetUserOperationOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#getuseroperationoptions), `"smartAccount"`>

Parameters for getting the user operation.

###### Returns

`Promise`\<[`UserOperation`](/sdks/cdp-sdks-v2/typescript/evm/Types#useroperation)>

A promise that resolves to the user operation.

###### Example

```ts
const userOp = await smartAccount.getUserOperation({
  userOpHash: "0x1234567890123456789012345678901234567890",
});
```

##### quoteSwap()

```ts
quoteSwap: (options: SmartAccountQuoteSwapOptions) => Promise<SmartAccountQuoteSwapResult>;
```

Creates a swap quote without executing the transaction.
This is useful when you need to get swap details before executing the swap.
The taker is automatically set to the smart account's address.

###### Parameters

###### options

`SmartAccountQuoteSwapOptions`

Configuration options for creating the swap quote.

###### Returns

`Promise`\<`SmartAccountQuoteSwapResult`>

A promise that resolves to the swap quote or a response indicating that liquidity is unavailable.

###### Example

```ts
const swapQuote = await smartAccount.quoteSwap({
  network: "base",
  fromToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  toToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  fromAmount: BigInt("1000000000000000000"), // 1 WETH in wei
});

if (swapQuote.liquidityAvailable) {
  console.log(`Can swap for ${swapQuote.toAmount} USDC`);
}
```

##### sendUserOperation()

```ts
sendUserOperation: (options: Omit<SendUserOperationOptions<unknown[]>, "smartAccount">) => Promise<SendUserOperationReturnType>;
```

Sends a user operation.

###### Parameters

###### options

`Omit`\<`SendUserOperationOptions`\<`unknown`\[]>, `"smartAccount"`>

Parameters for sending the user operation.

###### Returns

`Promise`\<`SendUserOperationReturnType`>

A promise that resolves to an object containing the smart account address,
the user operation hash, and the status of the user operation.

###### Example

```ts
const userOp = await smartAccount.sendUserOperation({
  network: "base-sepolia",
  calls: [
    {
      to: "0x1234567890123456789012345678901234567890",
      value: parseEther("0.000001"),
      data: "0x",
    },
  ],
});
```

##### signTypedData()

```ts
signTypedData: (options: Omit<SignTypedDataOptions, "address"> & {
  network: KnownEvmNetworks;
}) => Promise<Hex>;
```

Signs a typed data message.

###### Parameters

###### options

`Omit`\<[`SignTypedDataOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#signtypeddataoptions), `"address"`> & \{
`network`: `KnownEvmNetworks`;
}

Configuration options for signing the typed data.

###### Returns

`Promise`\<`Hex`>

A promise that resolves to the signature.

###### Example

```ts
const signature = await smartAccount.signTypedData({
  network: "base-sepolia",
  typedData: {
    domain: {
      name: "Test",
      chainId: 84532,
      verifyingContract: "0x0000000000000000000000000000000000000000",
    },
    types: {
      Test: [{ name: "name", type: "string" }],
    },
    primaryType: "Test",
    message: {
      name: "John Doe",
    },
  },
});
```

##### swap()

```ts
swap: (options: SmartAccountSwapOptions) => Promise<SmartAccountSwapResult>;
```

Executes a token swap on the specified network via a user operation.
This method handles all the steps required for a swap, including Permit2 signatures if needed.
The taker is automatically set to the smart account's address.

###### Parameters

###### options

`SmartAccountSwapOptions`

Configuration options for the swap.

###### Returns

`Promise`\<`SmartAccountSwapResult`>

A promise that resolves to the user operation result.

###### Throws

If liquidity is not available when using inline options.

###### Examples

```ts
// First create a swap quote
const swapQuote = await cdp.evm.createSwapQuote({
  network: "base",
  toToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  fromToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  fromAmount: BigInt("1000000000000000000"), // 1 WETH in wei
  taker: smartAccount.address,
  signerAddress: smartAccount.owners[0].address
});

// Check if liquidity is available
if (!swapQuote.liquidityAvailable) {
  console.error("Insufficient liquidity for swap");
  return;
}

// Execute the swap
const { userOpHash } = await smartAccount.swap({
  swapQuote: swapQuote
});

console.log(`Swap executed with user op hash: ${userOpHash}`);
```

```ts
// Create and execute swap in one call
const { userOpHash } = await smartAccount.swap({
  network: "base",
  toToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  fromToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  fromAmount: BigInt("1000000000000000000"), // 1 WETH in wei
});

console.log(`Swap executed with user op hash: ${userOpHash}`);
```

##### transfer()

```ts
transfer: (options: SmartAccountTransferOptions) => Promise<SendUserOperationReturnType>;
```

Transfer an amount of a token from an account to another account.

###### Parameters

###### options

`SmartAccountTransferOptions`

The options for the transfer.

###### Returns

`Promise`\<`SendUserOperationReturnType`>

The user operation result.

###### Examples

```typescript
const { userOpHash } = await sender.transfer({
  to: "0x9F663335Cd6Ad02a37B633602E98866CF944124d",
  amount: 10000n, // equivalent to 0.01 USDC
  token: "usdc",
  network: "base-sepolia",
});
```

**Using parseUnits to specify USDC amount**

```typescript
import { parseUnits } from "viem";

const { userOpHash } = await sender.transfer({
  to: "0x9F663335Cd6Ad02a37B633602E98866CF944124d",
  amount: parseUnits("0.01", 6), // USDC uses 6 decimal places
  token: "usdc",
  network: "base-sepolia",
});
```

**Transfer ETH**

```typescript
import { parseEther } from "viem";

const { userOpHash } = await sender.transfer({
  to: "0x9F663335Cd6Ad02a37B633602E98866CF944124d",
  amount: parseEther("0.000001"),
  token: "eth",
  network: "base-sepolia",
});
```

**Using a contract address**

```typescript
import { parseEther } from "viem";

const { userOpHash } = await sender.transfer({
  to: "0x9F663335Cd6Ad02a37B633602E98866CF944124d",
  amount: parseEther("0.000001"),
  token: "0x4200000000000000000000000000000000000006", // WETH on Base Sepolia
  network: "base-sepolia",
});
```

**Transfer to another account**

```typescript
const sender = await cdp.evm.createAccount({ name: "Sender" });
const receiver = await cdp.evm.createAccount({ name: "Receiver" });

const { userOpHash } = await sender.transfer({
  to: receiver,
  amount: 10000n, // equivalent to 0.01 USDC
  token: "usdc",
  network: "base-sepolia",
});
```

##### useSpendPermission()

```ts
useSpendPermission: (options: UseSpendPermissionOptions) => Promise<SendUserOperationReturnType>;
```

Uses a spend permission to execute a transaction via user operation.
This allows the smart account to spend tokens that have been approved via a spend permission.

###### Parameters

###### options

`UseSpendPermissionOptions`

Configuration options for using the spend permission.

###### Returns

`Promise`\<`SendUserOperationReturnType`>

A promise that resolves to the user operation result.

###### Throws

If the network doesn't support spend permissions via CDP API.

###### Example

```typescript
const spendPermission = {
  account: "0x1234...", // Smart account that owns the tokens
  spender: smartAccount.address, // This smart account that can spend
  token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // ETH
  allowance: parseEther("0.01"),
  period: 86400, // 1 day
  start: 0,
  end: 281474976710655,
  salt: 0n,
  extraData: "0x",
};

const result = await smartAccount.useSpendPermission({
  spendPermission,
  value: parseEther("0.001"), // Spend 0.001 ETH
  network: "base-sepolia",
});
```

##### waitForUserOperation()

```ts
waitForUserOperation: (options: Omit<WaitForUserOperationOptions, "smartAccountAddress">) => Promise<WaitForUserOperationReturnType>;
```

Waits for a user operation to complete or fail.

###### Parameters

###### options

`Omit`\<`WaitForUserOperationOptions`, `"smartAccountAddress"`>

Parameters for waiting for the user operation.

###### Returns

`Promise`\<`WaitForUserOperationReturnType`>

A promise that resolves to the transaction receipt.

###### Example

```ts
// Send a user operation and get the user operation hash
const { userOpHash } = await smartAccount.sendUserOperation({
  network: "base-sepolia",
  calls: [
    {
      to: "0x0000000000000000000000000000000000000000",
      value: parseEther("0.000001"),
      data: "0x",
    },
  ],
});

// Wait for the user operation to complete or fail
const result = await smartAccount.waitForUserOperation({
  userOpHash: userOp.userOpHash,
});
```
