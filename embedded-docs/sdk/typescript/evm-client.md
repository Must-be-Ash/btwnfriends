# Client

## Classes

### EvmClient

Defined in: [src/client/evm/evm.ts:97](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L97)

The namespace containing all EVM methods.

#### Implements

* [`EvmClientInterface`](/sdks/cdp-sdks-v2/typescript/evm/Types#evmclientinterface)

#### Constructors

##### Constructor

```ts
new EvmClient(): EvmClient;
```

###### Returns

[`EvmClient`](/sdks/cdp-sdks-v2/typescript/evm/Client#evmclient)

#### Methods

##### createAccount()

```ts
createAccount(options?: CreateServerAccountOptions): Promise<{
  address: `0x${string}`;
  fund: (options: Omit<EvmFundOptions, "address">) => Promise<FundOperationResult>;
  listTokenBalances: (options: Omit<ListTokenBalancesOptions, "address">) => Promise<ListTokenBalancesResult>;
  name?: string;
  policies?: string[];
  quoteFund: (options: Omit<EvmQuoteFundOptions, "address">) => Promise<EvmQuote>;
  quoteSwap: (options: AccountQuoteSwapOptions) => Promise<AccountQuoteSwapResult>;
  requestFaucet: (options: Omit<RequestFaucetOptions, "address">) => Promise<RequestFaucetResult>;
  sendTransaction: (options: Omit<SendTransactionOptions, "address">) => Promise<TransactionResult>;
  sign: (parameters: {
     hash: `0x${string}`;
  }) => Promise<`0x${string}`>;
  signMessage: (parameters: {
     message: SignableMessage;
  }) => Promise<`0x${string}`>;
  signTransaction: (transaction: TransactionSerializable) => Promise<`0x${string}`>;
  signTypedData: <typedData, primaryType>(parameters: TypedDataDefinition<typedData, primaryType>) => Promise<`0x${string}`>;
  swap: (options: AccountSwapOptions) => Promise<SendSwapTransactionResult>;
  transfer: (options: TransferOptions) => Promise<{
     transactionHash: `0x${string}`;
  }>;
  type: "evm-server";
  useNetwork: <Network>(network: Network) => Promise<{ [K in string | number | symbol]: (Omit<{ address: `0x${string}`; fund: (options: Omit<(...), (...)>) => Promise<(...)>; listTokenBalances: (options: Omit<(...), (...)>) => Promise<(...)>; name?: string; policies?: (...)[]; quoteFund: (options: Omit<(...), (...)>) => Promise<(...)>; quoteSwap: (options: AccountQuoteSwapOptions) => Promise<(...)>; requestFaucet: (options: Omit<(...), (...)>) => Promise<(...)>; sendTransaction: (options: Omit<(...), (...)>) => Promise<(...)>; sign: (parameters: { hash: ... }) => Promise<(...)>; signMessage: (parameters: { message: ... }) => Promise<(...)>; signTransaction: (transaction: TransactionSerializable) => Promise<(...)>; signTypedData: (parameters: TypedDataDefinition<(...), (...)>) => Promise<(...)>; swap: (options: AccountSwapOptions) => Promise<(...)>; transfer: (options: TransferOptions) => Promise<(...)>; type: "evm-server"; useNetwork: <Network extends NetworkOrRpcUrl>(network: Network) => Promise<{ [K in keyof (Omit<{ address: `0x${string}`; sign: (parameters: { hash: `0x${string}`; }) => Promise<`0x${string}`>; signMessage: (parameters: { message: SignableMessage; }) => Promise<...>; ... 15 more ...; useNetwork: ...; }, "transfer" | ... 5 more ....; useSpendPermission: (options: UseSpendPermissionOptions) => Promise<(...)>; waitForFundOperationReceipt: any }, "transfer" | "sendTransaction" | "quoteSwap" | "swap" | "useSpendPermission" | "useNetwork" | (keyof Actions)> & { [K in string | number | symbol]: ({ sendTransaction: ...; transfer: ...; waitForTransactionReceipt: ... } & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)))[K] } & { network: Network })[K] }>;
  useSpendPermission: (options: UseSpendPermissionOptions) => Promise<TransactionResult>;
  waitForFundOperationReceipt: Promise<WaitForFundOperationResult>;
}>;
```

Defined in: [src/client/evm/evm.ts:132](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L132)

Creates a new CDP EVM account.

###### Parameters

###### options?

[`CreateServerAccountOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#createserveraccountoptions) = `{}`

Optional parameters for creating the account.

###### Returns

`Promise`\<\{
`address`: `` `0x${string}` ``;
`fund`: (`options`: `Omit`\<`EvmFundOptions`, `"address"`>) => `Promise`\<`FundOperationResult`>;
`listTokenBalances`: (`options`: `Omit`\<`ListTokenBalancesOptions`, `"address"`>) => `Promise`\<`ListTokenBalancesResult`>;
`name?`: `string`;
`policies?`: `string`\[];
`quoteFund`: (`options`: `Omit`\<`EvmQuoteFundOptions`, `"address"`>) => `Promise`\<`EvmQuote`>;
`quoteSwap`: (`options`: `AccountQuoteSwapOptions`) => `Promise`\<`AccountQuoteSwapResult`>;
`requestFaucet`: (`options`: `Omit`\<`RequestFaucetOptions`, `"address"`>) => `Promise`\<`RequestFaucetResult`>;
`sendTransaction`: (`options`: `Omit`\<`SendTransactionOptions`, `"address"`>) => `Promise`\<`TransactionResult`>;
`sign`: (`parameters`: \{
`hash`: `` `0x${string}` ``;
}) => `Promise`\<`` `0x${string}` ``>;
`signMessage`: (`parameters`: \{
`message`: `SignableMessage`;
}) => `Promise`\<`` `0x${string}` ``>;
`signTransaction`: (`transaction`: `TransactionSerializable`) => `Promise`\<`` `0x${string}` ``>;
`signTypedData`: \<`typedData`, `primaryType`>(`parameters`: `TypedDataDefinition`\<`typedData`, `primaryType`>) => `Promise`\<`` `0x${string}` ``>;
`swap`: (`options`: `AccountSwapOptions`) => `Promise`\<`SendSwapTransactionResult`>;
`transfer`: (`options`: `TransferOptions`) => `Promise`\<\{
`transactionHash`: `` `0x${string}` ``;
}>;
`type`: `"evm-server"`;
`useNetwork`: \<`Network`>(`network`: `Network`) => `Promise`\<\{ \[K in string | number | symbol]: (Omit\<\{ address: \`0x$\{string\}\`; fund: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; listTokenBalances: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; name?: string; policies?: (...)\[\]; quoteFund: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; quoteSwap: (options: AccountQuoteSwapOptions) =\> Promise\<(...)\>; requestFaucet: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; sendTransaction: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; sign: (parameters: \{ hash: ... \}) =\> Promise\<(...)\>; signMessage: (parameters: \{ message: ... \}) =\> Promise\<(...)\>; signTransaction: (transaction: TransactionSerializable) =\> Promise\<(...)\>; signTypedData: (parameters: TypedDataDefinition\<(...), (...)\>) =\> Promise\<(...)\>; swap: (options: AccountSwapOptions) =\> Promise\<(...)\>; transfer: (options: TransferOptions) =\> Promise\<(...)\>; type: "evm-server"; useNetwork: \<Network extends NetworkOrRpcUrl\>(network: Network) =\> Promise\<\{ \[K in keyof (Omit\<\{ address: \`0x$\{string}\`; sign: (parameters: \{ hash: \`0x$\{string\}\`; \}) =\> Promise\<\`0x$\{string}\`>; signMessage: (parameters: \{ message: SignableMessage; }) => Promise\<...>; ... 15 more ...; useNetwork: ...; }, "transfer" | ... 5 more ....; useSpendPermission: (options: UseSpendPermissionOptions) => Promise\<(...)>; waitForFundOperationReceipt: any }, "transfer" | "sendTransaction" | "quoteSwap" | "swap" | "useSpendPermission" | "useNetwork" | (keyof Actions)> & \{ \[K in string | number | symbol]: (\{ sendTransaction: ...; transfer: ...; waitForTransactionReceipt: ... } & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)))\[K] } & \{ network: Network })\[K] }>;
`useSpendPermission`: (`options`: `UseSpendPermissionOptions`) => `Promise`\<`TransactionResult`>;
`waitForFundOperationReceipt`: `Promise`\<`WaitForFundOperationResult`>;
}>

A promise that resolves to the newly created account.

###### Examples

```ts
         const account = await cdp.evm.createAccount();
```

```ts
         const account = await cdp.evm.createAccount({ name: "MyAccount" });
```

```ts
         const idempotencyKey = uuidv4();

         // First call
         await cdp.evm.createAccount({
           idempotencyKey,
         });

         // Second call with the same idempotency key will return the same account
         await cdp.evm.createAccount({
           idempotencyKey,
         });
```

###### Implementation of

```ts
EvmClientInterface.createAccount
```

##### createSmartAccount()

```ts
createSmartAccount(options: CreateSmartAccountOptions): Promise<{
  address: `0x${string}`;
  fund: (options: Omit<EvmFundOptions, "address">) => Promise<FundOperationResult>;
  getUserOperation: (options: Omit<GetUserOperationOptions, "smartAccount">) => Promise<UserOperation>;
  listTokenBalances: (options: Omit<ListTokenBalancesOptions, "address">) => Promise<ListTokenBalancesResult>;
  name?: string;
  owners: EvmAccount[];
  policies: undefined | string[];
  quoteFund: (options: Omit<EvmQuoteFundOptions, "address">) => Promise<EvmQuote>;
  quoteSwap: (options: SmartAccountQuoteSwapOptions) => Promise<SmartAccountQuoteSwapResult>;
  requestFaucet: (options: Omit<RequestFaucetOptions, "address">) => Promise<RequestFaucetResult>;
  sendUserOperation: (options: Omit<SendUserOperationOptions<unknown[]>, "smartAccount">) => Promise<SendUserOperationReturnType>;
  signTypedData: (options: Omit<SignTypedDataOptions, "address"> & {
     network: KnownEvmNetworks;
  }) => Promise<`0x${string}`>;
  swap: (options: SmartAccountSwapOptions) => Promise<SmartAccountSwapResult>;
  transfer: (options: SmartAccountTransferOptions) => Promise<SendUserOperationReturnType>;
  type: "evm-smart";
  useNetwork: <Network>(network: Network) => Promise<{ [K in string | number | symbol]: (Omit<EvmSmartAccountProperties, "useNetwork"> & { [K in string | number | symbol]: ({ getUserOperation: ...; sendUserOperation: ...; waitForUserOperation: ... } & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)))[K] } & { network: Network })[K] }>;
  useSpendPermission: (options: UseSpendPermissionOptions) => Promise<SendUserOperationReturnType>;
  waitForUserOperation: (options: Omit<WaitForUserOperationOptions, "smartAccountAddress">) => Promise<WaitForUserOperationReturnType>;
  waitForFundOperationReceipt: Promise<WaitForFundOperationResult>;
}>;
```

Defined in: [src/client/evm/evm.ts:339](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L339)

Creates a new CDP EVM smart account.

###### Parameters

###### options

[`CreateSmartAccountOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#createsmartaccountoptions)

Parameters for creating the smart account.

###### Returns

`Promise`\<\{
`address`: `` `0x${string}` ``;
`fund`: (`options`: `Omit`\<`EvmFundOptions`, `"address"`>) => `Promise`\<`FundOperationResult`>;
`getUserOperation`: (`options`: `Omit`\<[`GetUserOperationOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#getuseroperationoptions), `"smartAccount"`>) => `Promise`\<[`UserOperation`](/sdks/cdp-sdks-v2/typescript/evm/Types#useroperation)>;
`listTokenBalances`: (`options`: `Omit`\<`ListTokenBalancesOptions`, `"address"`>) => `Promise`\<`ListTokenBalancesResult`>;
`name?`: `string`;
`owners`: [`EvmAccount`](/sdks/cdp-sdks-v2/typescript/evm/Accounts#evmaccount)\[];
`policies`: `undefined` | `string`\[];
`quoteFund`: (`options`: `Omit`\<`EvmQuoteFundOptions`, `"address"`>) => `Promise`\<`EvmQuote`>;
`quoteSwap`: (`options`: `SmartAccountQuoteSwapOptions`) => `Promise`\<`SmartAccountQuoteSwapResult`>;
`requestFaucet`: (`options`: `Omit`\<`RequestFaucetOptions`, `"address"`>) => `Promise`\<`RequestFaucetResult`>;
`sendUserOperation`: (`options`: `Omit`\<`SendUserOperationOptions`\<`unknown`\[]>, `"smartAccount"`>) => `Promise`\<`SendUserOperationReturnType`>;
`signTypedData`: (`options`: `Omit`\<[`SignTypedDataOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#signtypeddataoptions), `"address"`> & \{
`network`: `KnownEvmNetworks`;
}) => `Promise`\<`` `0x${string}` ``>;
`swap`: (`options`: `SmartAccountSwapOptions`) => `Promise`\<`SmartAccountSwapResult`>;
`transfer`: (`options`: `SmartAccountTransferOptions`) => `Promise`\<`SendUserOperationReturnType`>;
`type`: `"evm-smart"`;
`useNetwork`: \<`Network`>(`network`: `Network`) => `Promise`\<\{ \[K in string | number | symbol]: (Omit\<EvmSmartAccountProperties, "useNetwork"> & \{ \[K in string | number | symbol]: (\{ getUserOperation: ...; sendUserOperation: ...; waitForUserOperation: ... } & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)))\[K] } & \{ network: Network })\[K] }>;
`useSpendPermission`: (`options`: `UseSpendPermissionOptions`) => `Promise`\<`SendUserOperationReturnType`>;
`waitForUserOperation`: (`options`: `Omit`\<`WaitForUserOperationOptions`, `"smartAccountAddress"`>) => `Promise`\<`WaitForUserOperationReturnType`>;
`waitForFundOperationReceipt`: `Promise`\<`WaitForFundOperationResult`>;
}>

A promise that resolves to the newly created smart account.

###### Examples

```ts
         const account = await cdp.evm.createAccount();
         const smartAccount = await cdp.evm.createSmartAccount({
           owner: account,
         });
```

```ts
         // See https://viem.sh/docs/accounts/local/privateKeyToAccount
         const privateKey = generatePrivateKey();
         const account = privateKeyToAccount(privateKey);
         const smartAccount = await client.evm.createSmartAccount({
           owner: account,
         });
```

```ts
         const idempotencyKey = uuidv4();

         // First call
         await cdp.evm.createSmartAccount({
           owner: account,
           idempotencyKey,
         });

         // Second call with the same idempotency key will return the same smart account
         await cdp.evm.createSmartAccount({
           owner: account,
           idempotencyKey,
```

###### Implementation of

```ts
EvmClientInterface.createSmartAccount
```

##### createSpendPermission()

```ts
createSpendPermission(options: CreateSpendPermissionOptions): Promise<UserOperation>;
```

Defined in: [src/client/evm/evm.ts:365](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L365)

Creates a spend permission for a smart account.

###### Parameters

###### options

`CreateSpendPermissionOptions`

Parameters for creating the spend permission.

###### Returns

`Promise`\<[`UserOperation`](/sdks/cdp-sdks-v2/typescript/evm/Types#useroperation)>

A promise that resolves to the spend permission.

###### Example

```ts
const userOperation = await cdp.evm.createSpendPermission({
  spendPermission,
  network: "base-sepolia",
});
```

##### createSwapQuote()

```ts
createSwapQuote(options: CreateSwapQuoteOptions): Promise<
  | CreateSwapQuoteResult
| SwapUnavailableResult>;
```

Defined in: [src/client/evm/evm.ts:658](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L658)

Creates a quote for a swap between two tokens on an EVM network.

###### Parameters

###### options

[`CreateSwapQuoteOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#createswapquoteoptions)

The options for creating a swap quote.

###### Returns

`Promise`\<
\| [`CreateSwapQuoteResult`](/sdks/cdp-sdks-v2/typescript/evm/Types#createswapquoteresult)
\| [`SwapUnavailableResult`](/sdks/cdp-sdks-v2/typescript/evm/Types#swapunavailableresult)>

A promise that resolves to the swap quote result or a response indicating that liquidity is unavailable.

###### Example

```typescript
const swapQuote = await cdp.evm.createSwapQuote({
  network: "ethereum",
  toToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  fromToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  fromAmount: BigInt("1000000000000000000"), // 1 WETH
  taker: "0x1234567890123456789012345678901234567890"
});
```

###### Implementation of

```ts
EvmClientInterface.createSwapQuote
```

##### exportAccount()

```ts
exportAccount(options: ExportServerAccountOptions): Promise<string>;
```

Defined in: [src/client/evm/evm.ts:259](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L259)

Exports a CDP EVM account's private key.
It is important to store the private key in a secure place after it's exported.

###### Parameters

###### options

[`ExportServerAccountOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#exportserveraccountoptions)

Parameters for exporting the account.

###### Returns

`Promise`\<`string`>

A promise that resolves to the exported account’s 32-byte private key as a hex string, without the "0x" prefix.

###### Examples

```ts
const privateKey = await cdp.evm.exportAccount({
  address: "0x1234567890123456789012345678901234567890",
});
```

```ts
const privateKey = await cdp.evm.exportAccount({
  name: "MyAccount",
});
```

###### Implementation of

```ts
EvmClientInterface.exportAccount
```

##### getAccount()

```ts
getAccount(options: GetServerAccountOptions): Promise<{
  address: `0x${string}`;
  fund: (options: Omit<EvmFundOptions, "address">) => Promise<FundOperationResult>;
  listTokenBalances: (options: Omit<ListTokenBalancesOptions, "address">) => Promise<ListTokenBalancesResult>;
  name?: string;
  policies?: string[];
  quoteFund: (options: Omit<EvmQuoteFundOptions, "address">) => Promise<EvmQuote>;
  quoteSwap: (options: AccountQuoteSwapOptions) => Promise<AccountQuoteSwapResult>;
  requestFaucet: (options: Omit<RequestFaucetOptions, "address">) => Promise<RequestFaucetResult>;
  sendTransaction: (options: Omit<SendTransactionOptions, "address">) => Promise<TransactionResult>;
  sign: (parameters: {
     hash: `0x${string}`;
  }) => Promise<`0x${string}`>;
  signMessage: (parameters: {
     message: SignableMessage;
  }) => Promise<`0x${string}`>;
  signTransaction: (transaction: TransactionSerializable) => Promise<`0x${string}`>;
  signTypedData: <typedData, primaryType>(parameters: TypedDataDefinition<typedData, primaryType>) => Promise<`0x${string}`>;
  swap: (options: AccountSwapOptions) => Promise<SendSwapTransactionResult>;
  transfer: (options: TransferOptions) => Promise<{
     transactionHash: `0x${string}`;
  }>;
  type: "evm-server";
  useNetwork: <Network>(network: Network) => Promise<{ [K in string | number | symbol]: (Omit<{ address: `0x${string}`; fund: (options: Omit<(...), (...)>) => Promise<(...)>; listTokenBalances: (options: Omit<(...), (...)>) => Promise<(...)>; name?: string; policies?: (...)[]; quoteFund: (options: Omit<(...), (...)>) => Promise<(...)>; quoteSwap: (options: AccountQuoteSwapOptions) => Promise<(...)>; requestFaucet: (options: Omit<(...), (...)>) => Promise<(...)>; sendTransaction: (options: Omit<(...), (...)>) => Promise<(...)>; sign: (parameters: { hash: ... }) => Promise<(...)>; signMessage: (parameters: { message: ... }) => Promise<(...)>; signTransaction: (transaction: TransactionSerializable) => Promise<(...)>; signTypedData: (parameters: TypedDataDefinition<(...), (...)>) => Promise<(...)>; swap: (options: AccountSwapOptions) => Promise<(...)>; transfer: (options: TransferOptions) => Promise<(...)>; type: "evm-server"; useNetwork: <Network extends NetworkOrRpcUrl>(network: Network) => Promise<{ [K in keyof (Omit<{ address: `0x${string}`; sign: (parameters: { hash: `0x${string}`; }) => Promise<`0x${string}`>; signMessage: (parameters: { message: SignableMessage; }) => Promise<...>; ... 15 more ...; useNetwork: ...; }, "transfer" | ... 5 more ....; useSpendPermission: (options: UseSpendPermissionOptions) => Promise<(...)>; waitForFundOperationReceipt: any }, "transfer" | "sendTransaction" | "quoteSwap" | "swap" | "useSpendPermission" | "useNetwork" | (keyof Actions)> & { [K in string | number | symbol]: ({ sendTransaction: ...; transfer: ...; waitForTransactionReceipt: ... } & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)))[K] } & { network: Network })[K] }>;
  useSpendPermission: (options: UseSpendPermissionOptions) => Promise<TransactionResult>;
  waitForFundOperationReceipt: Promise<WaitForFundOperationResult>;
}>;
```

Defined in: [src/client/evm/evm.ts:476](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L476)

Gets a CDP EVM account.

###### Parameters

###### options

[`GetServerAccountOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#getserveraccountoptions)

Parameters for getting the account.
Either `address` or `name` must be provided.
If both are provided, lookup will be done by `address` and `name` will be ignored.

###### Returns

`Promise`\<\{
`address`: `` `0x${string}` ``;
`fund`: (`options`: `Omit`\<`EvmFundOptions`, `"address"`>) => `Promise`\<`FundOperationResult`>;
`listTokenBalances`: (`options`: `Omit`\<`ListTokenBalancesOptions`, `"address"`>) => `Promise`\<`ListTokenBalancesResult`>;
`name?`: `string`;
`policies?`: `string`\[];
`quoteFund`: (`options`: `Omit`\<`EvmQuoteFundOptions`, `"address"`>) => `Promise`\<`EvmQuote`>;
`quoteSwap`: (`options`: `AccountQuoteSwapOptions`) => `Promise`\<`AccountQuoteSwapResult`>;
`requestFaucet`: (`options`: `Omit`\<`RequestFaucetOptions`, `"address"`>) => `Promise`\<`RequestFaucetResult`>;
`sendTransaction`: (`options`: `Omit`\<`SendTransactionOptions`, `"address"`>) => `Promise`\<`TransactionResult`>;
`sign`: (`parameters`: \{
`hash`: `` `0x${string}` ``;
}) => `Promise`\<`` `0x${string}` ``>;
`signMessage`: (`parameters`: \{
`message`: `SignableMessage`;
}) => `Promise`\<`` `0x${string}` ``>;
`signTransaction`: (`transaction`: `TransactionSerializable`) => `Promise`\<`` `0x${string}` ``>;
`signTypedData`: \<`typedData`, `primaryType`>(`parameters`: `TypedDataDefinition`\<`typedData`, `primaryType`>) => `Promise`\<`` `0x${string}` ``>;
`swap`: (`options`: `AccountSwapOptions`) => `Promise`\<`SendSwapTransactionResult`>;
`transfer`: (`options`: `TransferOptions`) => `Promise`\<\{
`transactionHash`: `` `0x${string}` ``;
}>;
`type`: `"evm-server"`;
`useNetwork`: \<`Network`>(`network`: `Network`) => `Promise`\<\{ \[K in string | number | symbol]: (Omit\<\{ address: \`0x$\{string\}\`; fund: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; listTokenBalances: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; name?: string; policies?: (...)\[\]; quoteFund: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; quoteSwap: (options: AccountQuoteSwapOptions) =\> Promise\<(...)\>; requestFaucet: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; sendTransaction: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; sign: (parameters: \{ hash: ... \}) =\> Promise\<(...)\>; signMessage: (parameters: \{ message: ... \}) =\> Promise\<(...)\>; signTransaction: (transaction: TransactionSerializable) =\> Promise\<(...)\>; signTypedData: (parameters: TypedDataDefinition\<(...), (...)\>) =\> Promise\<(...)\>; swap: (options: AccountSwapOptions) =\> Promise\<(...)\>; transfer: (options: TransferOptions) =\> Promise\<(...)\>; type: "evm-server"; useNetwork: \<Network extends NetworkOrRpcUrl\>(network: Network) =\> Promise\<\{ \[K in keyof (Omit\<\{ address: \`0x$\{string}\`; sign: (parameters: \{ hash: \`0x$\{string\}\`; \}) =\> Promise\<\`0x$\{string}\`>; signMessage: (parameters: \{ message: SignableMessage; }) => Promise\<...>; ... 15 more ...; useNetwork: ...; }, "transfer" | ... 5 more ....; useSpendPermission: (options: UseSpendPermissionOptions) => Promise\<(...)>; waitForFundOperationReceipt: any }, "transfer" | "sendTransaction" | "quoteSwap" | "swap" | "useSpendPermission" | "useNetwork" | (keyof Actions)> & \{ \[K in string | number | symbol]: (\{ sendTransaction: ...; transfer: ...; waitForTransactionReceipt: ... } & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)))\[K] } & \{ network: Network })\[K] }>;
`useSpendPermission`: (`options`: `UseSpendPermissionOptions`) => `Promise`\<`TransactionResult`>;
`waitForFundOperationReceipt`: `Promise`\<`WaitForFundOperationResult`>;
}>

A promise that resolves to the account.

###### Examples

```ts
         const account = await cdp.evm.getAccount({
           address: "0x1234567890123456789012345678901234567890",
         });
```

```ts
         const account = await cdp.evm.getAccount({
           name: "MyAccount",
         });
```

###### Implementation of

```ts
EvmClientInterface.getAccount
```

##### getOrCreateAccount()

```ts
getOrCreateAccount(options: GetOrCreateServerAccountOptions): Promise<{
  address: `0x${string}`;
  fund: (options: Omit<EvmFundOptions, "address">) => Promise<FundOperationResult>;
  listTokenBalances: (options: Omit<ListTokenBalancesOptions, "address">) => Promise<ListTokenBalancesResult>;
  name?: string;
  policies?: string[];
  quoteFund: (options: Omit<EvmQuoteFundOptions, "address">) => Promise<EvmQuote>;
  quoteSwap: (options: AccountQuoteSwapOptions) => Promise<AccountQuoteSwapResult>;
  requestFaucet: (options: Omit<RequestFaucetOptions, "address">) => Promise<RequestFaucetResult>;
  sendTransaction: (options: Omit<SendTransactionOptions, "address">) => Promise<TransactionResult>;
  sign: (parameters: {
     hash: `0x${string}`;
  }) => Promise<`0x${string}`>;
  signMessage: (parameters: {
     message: SignableMessage;
  }) => Promise<`0x${string}`>;
  signTransaction: (transaction: TransactionSerializable) => Promise<`0x${string}`>;
  signTypedData: <typedData, primaryType>(parameters: TypedDataDefinition<typedData, primaryType>) => Promise<`0x${string}`>;
  swap: (options: AccountSwapOptions) => Promise<SendSwapTransactionResult>;
  transfer: (options: TransferOptions) => Promise<{
     transactionHash: `0x${string}`;
  }>;
  type: "evm-server";
  useNetwork: <Network>(network: Network) => Promise<{ [K in string | number | symbol]: (Omit<{ address: `0x${string}`; fund: (options: Omit<(...), (...)>) => Promise<(...)>; listTokenBalances: (options: Omit<(...), (...)>) => Promise<(...)>; name?: string; policies?: (...)[]; quoteFund: (options: Omit<(...), (...)>) => Promise<(...)>; quoteSwap: (options: AccountQuoteSwapOptions) => Promise<(...)>; requestFaucet: (options: Omit<(...), (...)>) => Promise<(...)>; sendTransaction: (options: Omit<(...), (...)>) => Promise<(...)>; sign: (parameters: { hash: ... }) => Promise<(...)>; signMessage: (parameters: { message: ... }) => Promise<(...)>; signTransaction: (transaction: TransactionSerializable) => Promise<(...)>; signTypedData: (parameters: TypedDataDefinition<(...), (...)>) => Promise<(...)>; swap: (options: AccountSwapOptions) => Promise<(...)>; transfer: (options: TransferOptions) => Promise<(...)>; type: "evm-server"; useNetwork: <Network extends NetworkOrRpcUrl>(network: Network) => Promise<{ [K in keyof (Omit<{ address: `0x${string}`; sign: (parameters: { hash: `0x${string}`; }) => Promise<`0x${string}`>; signMessage: (parameters: { message: SignableMessage; }) => Promise<...>; ... 15 more ...; useNetwork: ...; }, "transfer" | ... 5 more ....; useSpendPermission: (options: UseSpendPermissionOptions) => Promise<(...)>; waitForFundOperationReceipt: any }, "transfer" | "sendTransaction" | "quoteSwap" | "swap" | "useSpendPermission" | "useNetwork" | (keyof Actions)> & { [K in string | number | symbol]: ({ sendTransaction: ...; transfer: ...; waitForTransactionReceipt: ... } & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)))[K] } & { network: Network })[K] }>;
  useSpendPermission: (options: UseSpendPermissionOptions) => Promise<TransactionResult>;
  waitForFundOperationReceipt: Promise<WaitForFundOperationResult>;
}>;
```

Defined in: [src/client/evm/evm.ts:530](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L530)

Gets a CDP EVM account, or creates one if it doesn't exist.

###### Parameters

###### options

[`GetOrCreateServerAccountOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#getorcreateserveraccountoptions)

Parameters for getting or creating the account.

###### Returns

`Promise`\<\{
`address`: `` `0x${string}` ``;
`fund`: (`options`: `Omit`\<`EvmFundOptions`, `"address"`>) => `Promise`\<`FundOperationResult`>;
`listTokenBalances`: (`options`: `Omit`\<`ListTokenBalancesOptions`, `"address"`>) => `Promise`\<`ListTokenBalancesResult`>;
`name?`: `string`;
`policies?`: `string`\[];
`quoteFund`: (`options`: `Omit`\<`EvmQuoteFundOptions`, `"address"`>) => `Promise`\<`EvmQuote`>;
`quoteSwap`: (`options`: `AccountQuoteSwapOptions`) => `Promise`\<`AccountQuoteSwapResult`>;
`requestFaucet`: (`options`: `Omit`\<`RequestFaucetOptions`, `"address"`>) => `Promise`\<`RequestFaucetResult`>;
`sendTransaction`: (`options`: `Omit`\<`SendTransactionOptions`, `"address"`>) => `Promise`\<`TransactionResult`>;
`sign`: (`parameters`: \{
`hash`: `` `0x${string}` ``;
}) => `Promise`\<`` `0x${string}` ``>;
`signMessage`: (`parameters`: \{
`message`: `SignableMessage`;
}) => `Promise`\<`` `0x${string}` ``>;
`signTransaction`: (`transaction`: `TransactionSerializable`) => `Promise`\<`` `0x${string}` ``>;
`signTypedData`: \<`typedData`, `primaryType`>(`parameters`: `TypedDataDefinition`\<`typedData`, `primaryType`>) => `Promise`\<`` `0x${string}` ``>;
`swap`: (`options`: `AccountSwapOptions`) => `Promise`\<`SendSwapTransactionResult`>;
`transfer`: (`options`: `TransferOptions`) => `Promise`\<\{
`transactionHash`: `` `0x${string}` ``;
}>;
`type`: `"evm-server"`;
`useNetwork`: \<`Network`>(`network`: `Network`) => `Promise`\<\{ \[K in string | number | symbol]: (Omit\<\{ address: \`0x$\{string\}\`; fund: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; listTokenBalances: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; name?: string; policies?: (...)\[\]; quoteFund: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; quoteSwap: (options: AccountQuoteSwapOptions) =\> Promise\<(...)\>; requestFaucet: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; sendTransaction: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; sign: (parameters: \{ hash: ... \}) =\> Promise\<(...)\>; signMessage: (parameters: \{ message: ... \}) =\> Promise\<(...)\>; signTransaction: (transaction: TransactionSerializable) =\> Promise\<(...)\>; signTypedData: (parameters: TypedDataDefinition\<(...), (...)\>) =\> Promise\<(...)\>; swap: (options: AccountSwapOptions) =\> Promise\<(...)\>; transfer: (options: TransferOptions) =\> Promise\<(...)\>; type: "evm-server"; useNetwork: \<Network extends NetworkOrRpcUrl\>(network: Network) =\> Promise\<\{ \[K in keyof (Omit\<\{ address: \`0x$\{string}\`; sign: (parameters: \{ hash: \`0x$\{string\}\`; \}) =\> Promise\<\`0x$\{string}\`>; signMessage: (parameters: \{ message: SignableMessage; }) => Promise\<...>; ... 15 more ...; useNetwork: ...; }, "transfer" | ... 5 more ....; useSpendPermission: (options: UseSpendPermissionOptions) => Promise\<(...)>; waitForFundOperationReceipt: any }, "transfer" | "sendTransaction" | "quoteSwap" | "swap" | "useSpendPermission" | "useNetwork" | (keyof Actions)> & \{ \[K in string | number | symbol]: (\{ sendTransaction: ...; transfer: ...; waitForTransactionReceipt: ... } & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)))\[K] } & \{ network: Network })\[K] }>;
`useSpendPermission`: (`options`: `UseSpendPermissionOptions`) => `Promise`\<`TransactionResult`>;
`waitForFundOperationReceipt`: `Promise`\<`WaitForFundOperationResult`>;
}>

A promise that resolves to the account.

###### Example

```ts
const account = await cdp.evm.getOrCreateAccount({
  name: "MyAccount",
});
```

###### Implementation of

```ts
EvmClientInterface.getOrCreateAccount
```

##### getOrCreateSmartAccount()

```ts
getOrCreateSmartAccount(options: GetOrCreateSmartAccountOptions): Promise<{
  address: `0x${string}`;
  fund: (options: Omit<EvmFundOptions, "address">) => Promise<FundOperationResult>;
  getUserOperation: (options: Omit<GetUserOperationOptions, "smartAccount">) => Promise<UserOperation>;
  listTokenBalances: (options: Omit<ListTokenBalancesOptions, "address">) => Promise<ListTokenBalancesResult>;
  name?: string;
  owners: EvmAccount[];
  policies: undefined | string[];
  quoteFund: (options: Omit<EvmQuoteFundOptions, "address">) => Promise<EvmQuote>;
  quoteSwap: (options: SmartAccountQuoteSwapOptions) => Promise<SmartAccountQuoteSwapResult>;
  requestFaucet: (options: Omit<RequestFaucetOptions, "address">) => Promise<RequestFaucetResult>;
  sendUserOperation: (options: Omit<SendUserOperationOptions<unknown[]>, "smartAccount">) => Promise<SendUserOperationReturnType>;
  signTypedData: (options: Omit<SignTypedDataOptions, "address"> & {
     network: KnownEvmNetworks;
  }) => Promise<`0x${string}`>;
  swap: (options: SmartAccountSwapOptions) => Promise<SmartAccountSwapResult>;
  transfer: (options: SmartAccountTransferOptions) => Promise<SendUserOperationReturnType>;
  type: "evm-smart";
  useNetwork: <Network>(network: Network) => Promise<{ [K in string | number | symbol]: (Omit<EvmSmartAccountProperties, "useNetwork"> & { [K in string | number | symbol]: ({ getUserOperation: ...; sendUserOperation: ...; waitForUserOperation: ... } & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)))[K] } & { network: Network })[K] }>;
  useSpendPermission: (options: UseSpendPermissionOptions) => Promise<SendUserOperationReturnType>;
  waitForUserOperation: (options: Omit<WaitForUserOperationOptions, "smartAccountAddress">) => Promise<WaitForUserOperationReturnType>;
  waitForFundOperationReceipt: Promise<WaitForFundOperationResult>;
}>;
```

Defined in: [src/client/evm/evm.ts:579](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L579)

Gets a CDP EVM smart account, or creates one if it doesn't exist.
This method first attempts to retrieve an existing smart account with the given parameters.
If no account exists, it creates a new one with the specified owner.

###### Parameters

###### options

[`GetOrCreateSmartAccountOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#getorcreatesmartaccountoptions)

Configuration options for getting or creating the smart account.

###### Returns

`Promise`\<\{
`address`: `` `0x${string}` ``;
`fund`: (`options`: `Omit`\<`EvmFundOptions`, `"address"`>) => `Promise`\<`FundOperationResult`>;
`getUserOperation`: (`options`: `Omit`\<[`GetUserOperationOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#getuseroperationoptions), `"smartAccount"`>) => `Promise`\<[`UserOperation`](/sdks/cdp-sdks-v2/typescript/evm/Types#useroperation)>;
`listTokenBalances`: (`options`: `Omit`\<`ListTokenBalancesOptions`, `"address"`>) => `Promise`\<`ListTokenBalancesResult`>;
`name?`: `string`;
`owners`: [`EvmAccount`](/sdks/cdp-sdks-v2/typescript/evm/Accounts#evmaccount)\[];
`policies`: `undefined` | `string`\[];
`quoteFund`: (`options`: `Omit`\<`EvmQuoteFundOptions`, `"address"`>) => `Promise`\<`EvmQuote`>;
`quoteSwap`: (`options`: `SmartAccountQuoteSwapOptions`) => `Promise`\<`SmartAccountQuoteSwapResult`>;
`requestFaucet`: (`options`: `Omit`\<`RequestFaucetOptions`, `"address"`>) => `Promise`\<`RequestFaucetResult`>;
`sendUserOperation`: (`options`: `Omit`\<`SendUserOperationOptions`\<`unknown`\[]>, `"smartAccount"`>) => `Promise`\<`SendUserOperationReturnType`>;
`signTypedData`: (`options`: `Omit`\<[`SignTypedDataOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#signtypeddataoptions), `"address"`> & \{
`network`: `KnownEvmNetworks`;
}) => `Promise`\<`` `0x${string}` ``>;
`swap`: (`options`: `SmartAccountSwapOptions`) => `Promise`\<`SmartAccountSwapResult`>;
`transfer`: (`options`: `SmartAccountTransferOptions`) => `Promise`\<`SendUserOperationReturnType`>;
`type`: `"evm-smart"`;
`useNetwork`: \<`Network`>(`network`: `Network`) => `Promise`\<\{ \[K in string | number | symbol]: (Omit\<EvmSmartAccountProperties, "useNetwork"> & \{ \[K in string | number | symbol]: (\{ getUserOperation: ...; sendUserOperation: ...; waitForUserOperation: ... } & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)))\[K] } & \{ network: Network })\[K] }>;
`useSpendPermission`: (`options`: `UseSpendPermissionOptions`) => `Promise`\<`SendUserOperationReturnType`>;
`waitForUserOperation`: (`options`: `Omit`\<`WaitForUserOperationOptions`, `"smartAccountAddress"`>) => `Promise`\<`WaitForUserOperationReturnType`>;
`waitForFundOperationReceipt`: `Promise`\<`WaitForFundOperationResult`>;
}>

A promise that resolves to the retrieved or newly created smart account.

###### Example

```ts
const smartAccount = await cdp.evm.getOrCreateSmartAccount({
  name: "MySmartAccount",
  owner: account,
});
```

##### getSmartAccount()

```ts
getSmartAccount(options: GetSmartAccountOptions): Promise<{
  address: `0x${string}`;
  fund: (options: Omit<EvmFundOptions, "address">) => Promise<FundOperationResult>;
  getUserOperation: (options: Omit<GetUserOperationOptions, "smartAccount">) => Promise<UserOperation>;
  listTokenBalances: (options: Omit<ListTokenBalancesOptions, "address">) => Promise<ListTokenBalancesResult>;
  name?: string;
  owners: EvmAccount[];
  policies: undefined | string[];
  quoteFund: (options: Omit<EvmQuoteFundOptions, "address">) => Promise<EvmQuote>;
  quoteSwap: (options: SmartAccountQuoteSwapOptions) => Promise<SmartAccountQuoteSwapResult>;
  requestFaucet: (options: Omit<RequestFaucetOptions, "address">) => Promise<RequestFaucetResult>;
  sendUserOperation: (options: Omit<SendUserOperationOptions<unknown[]>, "smartAccount">) => Promise<SendUserOperationReturnType>;
  signTypedData: (options: Omit<SignTypedDataOptions, "address"> & {
     network: KnownEvmNetworks;
  }) => Promise<`0x${string}`>;
  swap: (options: SmartAccountSwapOptions) => Promise<SmartAccountSwapResult>;
  transfer: (options: SmartAccountTransferOptions) => Promise<SendUserOperationReturnType>;
  type: "evm-smart";
  useNetwork: <Network>(network: Network) => Promise<{ [K in string | number | symbol]: (Omit<EvmSmartAccountProperties, "useNetwork"> & { [K in string | number | symbol]: ({ getUserOperation: ...; sendUserOperation: ...; waitForUserOperation: ... } & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)))[K] } & { network: Network })[K] }>;
  useSpendPermission: (options: UseSpendPermissionOptions) => Promise<SendUserOperationReturnType>;
  waitForUserOperation: (options: Omit<WaitForUserOperationOptions, "smartAccountAddress">) => Promise<WaitForUserOperationReturnType>;
  waitForFundOperationReceipt: Promise<WaitForFundOperationResult>;
}>;
```

Defined in: [src/client/evm/evm.ts:507](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L507)

Gets a CDP EVM smart account.

###### Parameters

###### options

[`GetSmartAccountOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#getsmartaccountoptions)

Parameters for getting the smart account.
Either `address` or `name` must be provided.
If both are provided, lookup will be done by `address` and `name` will be ignored.

###### Returns

`Promise`\<\{
`address`: `` `0x${string}` ``;
`fund`: (`options`: `Omit`\<`EvmFundOptions`, `"address"`>) => `Promise`\<`FundOperationResult`>;
`getUserOperation`: (`options`: `Omit`\<[`GetUserOperationOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#getuseroperationoptions), `"smartAccount"`>) => `Promise`\<[`UserOperation`](/sdks/cdp-sdks-v2/typescript/evm/Types#useroperation)>;
`listTokenBalances`: (`options`: `Omit`\<`ListTokenBalancesOptions`, `"address"`>) => `Promise`\<`ListTokenBalancesResult`>;
`name?`: `string`;
`owners`: [`EvmAccount`](/sdks/cdp-sdks-v2/typescript/evm/Accounts#evmaccount)\[];
`policies`: `undefined` | `string`\[];
`quoteFund`: (`options`: `Omit`\<`EvmQuoteFundOptions`, `"address"`>) => `Promise`\<`EvmQuote`>;
`quoteSwap`: (`options`: `SmartAccountQuoteSwapOptions`) => `Promise`\<`SmartAccountQuoteSwapResult`>;
`requestFaucet`: (`options`: `Omit`\<`RequestFaucetOptions`, `"address"`>) => `Promise`\<`RequestFaucetResult`>;
`sendUserOperation`: (`options`: `Omit`\<`SendUserOperationOptions`\<`unknown`\[]>, `"smartAccount"`>) => `Promise`\<`SendUserOperationReturnType`>;
`signTypedData`: (`options`: `Omit`\<[`SignTypedDataOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#signtypeddataoptions), `"address"`> & \{
`network`: `KnownEvmNetworks`;
}) => `Promise`\<`` `0x${string}` ``>;
`swap`: (`options`: `SmartAccountSwapOptions`) => `Promise`\<`SmartAccountSwapResult`>;
`transfer`: (`options`: `SmartAccountTransferOptions`) => `Promise`\<`SendUserOperationReturnType`>;
`type`: `"evm-smart"`;
`useNetwork`: \<`Network`>(`network`: `Network`) => `Promise`\<\{ \[K in string | number | symbol]: (Omit\<EvmSmartAccountProperties, "useNetwork"> & \{ \[K in string | number | symbol]: (\{ getUserOperation: ...; sendUserOperation: ...; waitForUserOperation: ... } & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)))\[K] } & \{ network: Network })\[K] }>;
`useSpendPermission`: (`options`: `UseSpendPermissionOptions`) => `Promise`\<`SendUserOperationReturnType`>;
`waitForUserOperation`: (`options`: `Omit`\<`WaitForUserOperationOptions`, `"smartAccountAddress"`>) => `Promise`\<`WaitForUserOperationReturnType`>;
`waitForFundOperationReceipt`: `Promise`\<`WaitForFundOperationResult`>;
}>

A promise that resolves to the smart account.

###### Example

```ts
const smartAccount = await cdp.evm.getSmartAccount({
  address: "0x1234567890123456789012345678901234567890",
  owner: account,
});
```

###### Implementation of

```ts
EvmClientInterface.getSmartAccount
```

##### getSwapPrice()

```ts
getSwapPrice(options: GetSwapPriceOptions): Promise<
  | SwapUnavailableResult
| GetSwapPriceResult>;
```

Defined in: [src/client/evm/evm.ts:627](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L627)

Gets the price for a swap between two tokens on an EVM network.

###### Parameters

###### options

[`GetSwapPriceOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#getswappriceoptions)

The options for getting a swap price.

###### Returns

`Promise`\<
\| [`SwapUnavailableResult`](/sdks/cdp-sdks-v2/typescript/evm/Types#swapunavailableresult)
\| [`GetSwapPriceResult`](/sdks/cdp-sdks-v2/typescript/evm/Types#getswappriceresult)>

A promise that resolves to the swap price result or a response indicating that liquidity is unavailable.

###### Example

```typescript
const price = await cdp.evm.getSwapPrice({
  network: "ethereum-mainnet",
  toToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  fromToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  fromAmount: BigInt("1000000000000000000"), // 1 WETH
  taker: "0x1234567890123456789012345678901234567890"
});
```

###### Implementation of

```ts
EvmClientInterface.getSwapPrice
```

##### getUserOperation()

```ts
getUserOperation(options: GetUserOperationOptions): Promise<UserOperation>;
```

Defined in: [src/client/evm/evm.ts:688](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L688)

Gets a user operation for a smart account by user operation hash.

###### Parameters

###### options

[`GetUserOperationOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#getuseroperationoptions)

Parameters for getting the user operation.

###### Returns

`Promise`\<[`UserOperation`](/sdks/cdp-sdks-v2/typescript/evm/Types#useroperation)>

A promise that resolves to the user operation.

###### Example

```ts
const userOp = await cdp.evm.getUserOperation({
  smartAccount,
  userOpHash: "0x1234567890123456789012345678901234567890123456789012345678901234",
});
```

###### Implementation of

```ts
EvmClientInterface.getUserOperation
```

##### importAccount()

```ts
importAccount(options: ImportServerAccountOptions): Promise<{
  address: `0x${string}`;
  fund: (options: Omit<EvmFundOptions, "address">) => Promise<FundOperationResult>;
  listTokenBalances: (options: Omit<ListTokenBalancesOptions, "address">) => Promise<ListTokenBalancesResult>;
  name?: string;
  policies?: string[];
  quoteFund: (options: Omit<EvmQuoteFundOptions, "address">) => Promise<EvmQuote>;
  quoteSwap: (options: AccountQuoteSwapOptions) => Promise<AccountQuoteSwapResult>;
  requestFaucet: (options: Omit<RequestFaucetOptions, "address">) => Promise<RequestFaucetResult>;
  sendTransaction: (options: Omit<SendTransactionOptions, "address">) => Promise<TransactionResult>;
  sign: (parameters: {
     hash: `0x${string}`;
  }) => Promise<`0x${string}`>;
  signMessage: (parameters: {
     message: SignableMessage;
  }) => Promise<`0x${string}`>;
  signTransaction: (transaction: TransactionSerializable) => Promise<`0x${string}`>;
  signTypedData: <typedData, primaryType>(parameters: TypedDataDefinition<typedData, primaryType>) => Promise<`0x${string}`>;
  swap: (options: AccountSwapOptions) => Promise<SendSwapTransactionResult>;
  transfer: (options: TransferOptions) => Promise<{
     transactionHash: `0x${string}`;
  }>;
  type: "evm-server";
  useNetwork: <Network>(network: Network) => Promise<{ [K in string | number | symbol]: (Omit<{ address: `0x${string}`; fund: (options: Omit<(...), (...)>) => Promise<(...)>; listTokenBalances: (options: Omit<(...), (...)>) => Promise<(...)>; name?: string; policies?: (...)[]; quoteFund: (options: Omit<(...), (...)>) => Promise<(...)>; quoteSwap: (options: AccountQuoteSwapOptions) => Promise<(...)>; requestFaucet: (options: Omit<(...), (...)>) => Promise<(...)>; sendTransaction: (options: Omit<(...), (...)>) => Promise<(...)>; sign: (parameters: { hash: ... }) => Promise<(...)>; signMessage: (parameters: { message: ... }) => Promise<(...)>; signTransaction: (transaction: TransactionSerializable) => Promise<(...)>; signTypedData: (parameters: TypedDataDefinition<(...), (...)>) => Promise<(...)>; swap: (options: AccountSwapOptions) => Promise<(...)>; transfer: (options: TransferOptions) => Promise<(...)>; type: "evm-server"; useNetwork: <Network extends NetworkOrRpcUrl>(network: Network) => Promise<{ [K in keyof (Omit<{ address: `0x${string}`; sign: (parameters: { hash: `0x${string}`; }) => Promise<`0x${string}`>; signMessage: (parameters: { message: SignableMessage; }) => Promise<...>; ... 15 more ...; useNetwork: ...; }, "transfer" | ... 5 more ....; useSpendPermission: (options: UseSpendPermissionOptions) => Promise<(...)>; waitForFundOperationReceipt: any }, "transfer" | "sendTransaction" | "quoteSwap" | "swap" | "useSpendPermission" | "useNetwork" | (keyof Actions)> & { [K in string | number | symbol]: ({ sendTransaction: ...; transfer: ...; waitForTransactionReceipt: ... } & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)))[K] } & { network: Network })[K] }>;
  useSpendPermission: (options: UseSpendPermissionOptions) => Promise<TransactionResult>;
  waitForFundOperationReceipt: Promise<WaitForFundOperationResult>;
}>;
```

Defined in: [src/client/evm/evm.ts:183](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L183)

Imports a CDP EVM account from an external source.

###### Parameters

###### options

[`ImportServerAccountOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#importserveraccountoptions)

Parameters for importing the account.

###### Returns

`Promise`\<\{
`address`: `` `0x${string}` ``;
`fund`: (`options`: `Omit`\<`EvmFundOptions`, `"address"`>) => `Promise`\<`FundOperationResult`>;
`listTokenBalances`: (`options`: `Omit`\<`ListTokenBalancesOptions`, `"address"`>) => `Promise`\<`ListTokenBalancesResult`>;
`name?`: `string`;
`policies?`: `string`\[];
`quoteFund`: (`options`: `Omit`\<`EvmQuoteFundOptions`, `"address"`>) => `Promise`\<`EvmQuote`>;
`quoteSwap`: (`options`: `AccountQuoteSwapOptions`) => `Promise`\<`AccountQuoteSwapResult`>;
`requestFaucet`: (`options`: `Omit`\<`RequestFaucetOptions`, `"address"`>) => `Promise`\<`RequestFaucetResult`>;
`sendTransaction`: (`options`: `Omit`\<`SendTransactionOptions`, `"address"`>) => `Promise`\<`TransactionResult`>;
`sign`: (`parameters`: \{
`hash`: `` `0x${string}` ``;
}) => `Promise`\<`` `0x${string}` ``>;
`signMessage`: (`parameters`: \{
`message`: `SignableMessage`;
}) => `Promise`\<`` `0x${string}` ``>;
`signTransaction`: (`transaction`: `TransactionSerializable`) => `Promise`\<`` `0x${string}` ``>;
`signTypedData`: \<`typedData`, `primaryType`>(`parameters`: `TypedDataDefinition`\<`typedData`, `primaryType`>) => `Promise`\<`` `0x${string}` ``>;
`swap`: (`options`: `AccountSwapOptions`) => `Promise`\<`SendSwapTransactionResult`>;
`transfer`: (`options`: `TransferOptions`) => `Promise`\<\{
`transactionHash`: `` `0x${string}` ``;
}>;
`type`: `"evm-server"`;
`useNetwork`: \<`Network`>(`network`: `Network`) => `Promise`\<\{ \[K in string | number | symbol]: (Omit\<\{ address: \`0x$\{string\}\`; fund: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; listTokenBalances: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; name?: string; policies?: (...)\[\]; quoteFund: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; quoteSwap: (options: AccountQuoteSwapOptions) =\> Promise\<(...)\>; requestFaucet: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; sendTransaction: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; sign: (parameters: \{ hash: ... \}) =\> Promise\<(...)\>; signMessage: (parameters: \{ message: ... \}) =\> Promise\<(...)\>; signTransaction: (transaction: TransactionSerializable) =\> Promise\<(...)\>; signTypedData: (parameters: TypedDataDefinition\<(...), (...)\>) =\> Promise\<(...)\>; swap: (options: AccountSwapOptions) =\> Promise\<(...)\>; transfer: (options: TransferOptions) =\> Promise\<(...)\>; type: "evm-server"; useNetwork: \<Network extends NetworkOrRpcUrl\>(network: Network) =\> Promise\<\{ \[K in keyof (Omit\<\{ address: \`0x$\{string}\`; sign: (parameters: \{ hash: \`0x$\{string\}\`; \}) =\> Promise\<\`0x$\{string}\`>; signMessage: (parameters: \{ message: SignableMessage; }) => Promise\<...>; ... 15 more ...; useNetwork: ...; }, "transfer" | ... 5 more ....; useSpendPermission: (options: UseSpendPermissionOptions) => Promise\<(...)>; waitForFundOperationReceipt: any }, "transfer" | "sendTransaction" | "quoteSwap" | "swap" | "useSpendPermission" | "useNetwork" | (keyof Actions)> & \{ \[K in string | number | symbol]: (\{ sendTransaction: ...; transfer: ...; waitForTransactionReceipt: ... } & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)))\[K] } & \{ network: Network })\[K] }>;
`useSpendPermission`: (`options`: `UseSpendPermissionOptions`) => `Promise`\<`TransactionResult`>;
`waitForFundOperationReceipt`: `Promise`\<`WaitForFundOperationResult`>;
}>

A promise that resolves to the imported account.

###### Examples

```ts
         const account = await cdp.evm.importAccount({
           privateKey: "0x123456"
         });
```

```ts
         const account = await cdp.evm.importAccount({
           privateKey: "0x123456",
           name: "MyAccount"
         });
```

```ts
         const idempotencyKey = uuidv4();

         // First call
         await cdp.evm.importAccount({
           privateKey: "0x123456",
           idempotencyKey,
         });

         // Second call with the same idempotency key will return the same account
         await cdp.evm.importAccount({
           privateKey: "0x123456"
           idempotencyKey,
         });
```

###### Implementation of

```ts
EvmClientInterface.importAccount
```

##### listAccounts()

```ts
listAccounts(options?: ListServerAccountsOptions): Promise<ListServerAccountResult>;
```

Defined in: [src/client/evm/evm.ts:720](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L720)

Lists CDP EVM accounts.

###### Parameters

###### options?

[`ListServerAccountsOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#listserveraccountsoptions) = `{}`

Optional parameters for listing the accounts.

###### Returns

`Promise`\<[`ListServerAccountResult`](/sdks/cdp-sdks-v2/typescript/evm/Types#listserveraccountresult)>

A promise that resolves to an array of accounts, and a token to paginate through the accounts.

###### Examples

```ts
const accounts = await cdp.evm.listAccounts();
```

```ts
         let page = await cdp.evm.listAccounts();

         while (page.nextPageToken) {
           page = await cdp.evm.listAccounts({ pageToken: page.nextPageToken });
         }
```

###### Implementation of

```ts
EvmClientInterface.listAccounts
```

##### listSmartAccounts()

```ts
listSmartAccounts(options: ListSmartAccountsOptions): Promise<ListSmartAccountResult>;
```

Defined in: [src/client/evm/evm.ts:814](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L814)

Lists CDP EVM smart accounts.

###### Parameters

###### options

[`ListSmartAccountsOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#listsmartaccountsoptions) = `{}`

Parameters for listing the smart accounts.

###### Returns

`Promise`\<[`ListSmartAccountResult`](/sdks/cdp-sdks-v2/typescript/evm/Types#listsmartaccountresult)>

A promise that resolves to an array of smart accounts, and a token to paginate through the smart accounts.

###### Examples

```ts
const smartAccounts = await cdp.evm.listSmartAccounts();
```

```ts
         let page = await cdp.evm.listSmartAccounts();

         while (page.nextPageToken) {
           page = await cdp.evm.listSmartAccounts({ pageToken: page.nextPageToken });
         }
```

###### Implementation of

```ts
EvmClientInterface.listSmartAccounts
```

##### listSpendPermissions()

```ts
listSpendPermissions(options: ListSpendPermissionsOptions): Promise<ListSpendPermissionsResult>;
```

Defined in: [src/client/evm/evm.ts:845](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L845)

Lists the spend permissions for a smart account.

###### Parameters

###### options

`ListSpendPermissionsOptions`

Parameters for listing the spend permissions.

###### Returns

`Promise`\<`ListSpendPermissionsResult`>

A promise that resolves to the spend permissions.

###### Implementation of

```ts
EvmClientInterface.listSpendPermissions
```

##### listTokenBalances()

```ts
listTokenBalances(options: ListTokenBalancesOptions): Promise<ListTokenBalancesResult>;
```

Defined in: [src/client/evm/evm.ts:779](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L779)

Lists CDP EVM token balances.

###### Parameters

###### options

`ListTokenBalancesOptions`

Parameters for listing the token balances.

###### Returns

`Promise`\<`ListTokenBalancesResult`>

A promise that resolves to an array of token balances, and a token to paginate through the token balances.

###### Examples

```ts
const tokenBalances = await cdp.evm.listTokenBalances({
  address: "0x1234567890123456789012345678901234567890",
  network: "base-sepolia",
});
```

**With pagination**

````ts
let page = await cdp.evm.listTokenBalances({
  address: "0x1234567890123456789012345678901234567890",
  network: "base-sepolia",
});

while (page.nextPageToken) {
  page = await cdp.evm.listTokenBalances({
    address: "0x1234567890123456789012345678901234567890",
    network: "base-sepolia",
    pageToken: page.nextPageToken,
  });
}

###### Implementation of

```ts
EvmClientInterface.listTokenBalances
````

##### prepareUserOperation()

```ts
prepareUserOperation(options: PrepareUserOperationOptions): Promise<UserOperation>;
```

Defined in: [src/client/evm/evm.ts:881](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L881)

Prepares a user operation for a smart account.

###### Parameters

###### options

[`PrepareUserOperationOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#prepareuseroperationoptions)

Parameters for preparing the user operation.

###### Returns

`Promise`\<[`UserOperation`](/sdks/cdp-sdks-v2/typescript/evm/Types#useroperation)>

A promise that resolves to the user operation hash.

###### Example

```ts
const userOp = await cdp.evm.prepareUserOperation({
  smartAccount,
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

###### Implementation of

```ts
EvmClientInterface.prepareUserOperation
```

##### requestFaucet()

```ts
requestFaucet(options: RequestFaucetOptions): Promise<RequestFaucetResult>;
```

Defined in: [src/client/evm/evm.ts:931](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L931)

Requests funds from an EVM faucet.

###### Parameters

###### options

`RequestFaucetOptions`

Parameters for requesting funds from the EVM faucet.

###### Returns

`Promise`\<`RequestFaucetResult`>

A promise that resolves to the transaction hash.

###### Example

```ts
const result = await cdp.evm.requestFaucet({
  address: "0x1234567890123456789012345678901234567890",
  network: "base-sepolia",
  token: "eth",
});
```

###### Implementation of

```ts
EvmClientInterface.requestFaucet
```

##### revokeSpendPermission()

```ts
revokeSpendPermission(options: RevokeSpendPermissionOptions): Promise<UserOperation>;
```

Defined in: [src/client/evm/evm.ts:424](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L424)

Revokes a spend permission for a smart account.

###### Parameters

###### options

`RevokeSpendPermissionOptions`

Parameters for revoking the spend permission.

###### Returns

`Promise`\<[`UserOperation`](/sdks/cdp-sdks-v2/typescript/evm/Types#useroperation)>

A promise that resolves to the user operation.

###### Example

```ts
const userOperation = await cdp.evm.revokeSpendPermission({
  address: "0x1234567890123456789012345678901234567890",
  permissionHash: "0x1234567890123456789012345678901234567890123456789012345678901234",
  network: "base-sepolia",
});
```

##### sendTransaction()

```ts
sendTransaction(options: SendTransactionOptions): Promise<TransactionResult>;
```

Defined in: [src/client/evm/evm.ts:988](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L988)

Signs an EVM transaction and sends it to the specified network using the Coinbase API.
This method handles nonce management and gas estimation automatically.

###### Parameters

###### options

`SendTransactionOptions`

Configuration options for sending the transaction.

###### Returns

`Promise`\<`TransactionResult`>

A promise that resolves to the transaction hash.

###### Examples

**Sending an RLP-encoded transaction**

```ts
import { parseEther, serializeTransaction } from "viem";
import { baseSepolia } from "viem/chains";

const { transactionHash } = await cdp.evm.sendTransaction({
  address: account.address,
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
const { transactionHash } = await cdp.evm.sendTransaction({
  address: account.address,
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

###### Implementation of

```ts
EvmClientInterface.sendTransaction
```

##### sendUserOperation()

```ts
sendUserOperation(options: SendUserOperationOptions<unknown[]>): Promise<SendUserOperationReturnType>;
```

Defined in: [src/client/evm/evm.ts:1027](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L1027)

Sends a user operation.

###### Parameters

###### options

`SendUserOperationOptions`\<`unknown`\[]>

Parameters for sending the user operation.

###### Returns

`Promise`\<`SendUserOperationReturnType`>

A promise that resolves to an object containing the smart account address,
the user operation hash, and the status of the user operation.

###### Example

```ts
const userOp = await cdp.evm.sendUserOperation({
  smartAccount,
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

###### Implementation of

```ts
EvmClientInterface.sendUserOperation
```

##### signHash()

```ts
signHash(options: SignHashOptions): Promise<SignatureResult>;
```

Defined in: [src/client/evm/evm.ts:1067](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L1067)

Signs an EVM hash.

###### Parameters

###### options

[`SignHashOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#signhashoptions)

Parameters for signing the hash.

###### Returns

`Promise`\<[`SignatureResult`](/sdks/cdp-sdks-v2/typescript/evm/Types#signatureresult)>

A promise that resolves to the signature.

###### Example

```ts
// Create a new EVM server account to sign with
const ethAccount = await cdp.createEvmServerAccount({});

const signature = await cdp.evm.signHash({
  address: ethAccount.address,
  hash: "0x1234567890123456789012345678901234567890123456789012345678901234",
});
```

###### Implementation of

```ts
EvmClientInterface.signHash
```

##### signMessage()

```ts
signMessage(options: SignMessageOptions): Promise<SignatureResult>;
```

Defined in: [src/client/evm/evm.ts:1106](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L1106)

Signs an EIP-191 message.

###### Parameters

###### options

[`SignMessageOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#signmessageoptions)

Parameters for signing the message.

###### Returns

`Promise`\<[`SignatureResult`](/sdks/cdp-sdks-v2/typescript/evm/Types#signatureresult)>

A promise that resolves to the signature.

###### Example

```ts
// Create a new EVM server account to sign with
const ethAccount = await cdp.createEvmServerAccount({});

const signature = await cdp.evm.signMessage({
  address: ethAccount.address,
  message: "Hello, world!",
});
```

###### Implementation of

```ts
EvmClientInterface.signMessage
```

##### signTransaction()

```ts
signTransaction(options: SignTransactionOptions): Promise<SignatureResult>;
```

Defined in: [src/client/evm/evm.ts:1228](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L1228)

Signs an EVM transaction.

###### Parameters

###### options

[`SignTransactionOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#signtransactionoptions)

Configuration options for signing the transaction.

###### Returns

`Promise`\<[`SignatureResult`](/sdks/cdp-sdks-v2/typescript/evm/Types#signatureresult)>

A promise that resolves to the signature.

###### Example

```ts
import { parseEther, serializeTransaction } from "viem";
import { baseSepolia } from "viem/chains";

// Create a new EVM server account to sign with
const ethAccount = await cdp.createEvmServerAccount({});

const serializedTx = serializeTransaction(
  {
    chainId: baseSepolia.id,
    data: "0x",
    to: "0x4252e0c9A3da5A2700e7d91cb50aEf522D0C6Fe8",
    type: "eip1559",
    value: parseEther("0.000001"),
  },
);

const signature = await cdp.evm.signTransaction({
  address: ethAccount.address,
  transaction: serializedTx,
});
```

###### Implementation of

```ts
EvmClientInterface.signTransaction
```

##### signTypedData()

```ts
signTypedData(options: SignTypedDataOptions): Promise<SignatureResult>;
```

Defined in: [src/client/evm/evm.ts:1169](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L1169)

Signs an EIP-712 message.

###### Parameters

###### options

[`SignTypedDataOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#signtypeddataoptions)

Parameters for signing the EIP-712 message.

###### Returns

`Promise`\<[`SignatureResult`](/sdks/cdp-sdks-v2/typescript/evm/Types#signatureresult)>

A promise that resolves to the signature.

###### Example

```ts
const signature = await cdp.evm.signTypedData({
  address: account.address,
  domain: {
    name: "Permit2",
    chainId: 1,
    verifyingContract: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
  },
  types: {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ],
    PermitTransferFrom: [
      { name: "permitted", type: "TokenPermissions" },
      { name: "spender", type: "address" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
    TokenPermissions: [
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
    ],
  },
  primaryType: "PermitTransferFrom",
  message: {
    permitted: {
      token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      amount: "1000000",
    },
    spender: "0xFfFfFfFFfFFfFFfFFfFFFFFffFFFffffFfFFFfFf",
    nonce: "0",
    deadline: "1717123200",
  },
});
```

###### Implementation of

```ts
EvmClientInterface.signTypedData
```

##### updateAccount()

```ts
updateAccount(options?: UpdateEvmAccountOptions): Promise<{
  address: `0x${string}`;
  fund: (options: Omit<EvmFundOptions, "address">) => Promise<FundOperationResult>;
  listTokenBalances: (options: Omit<ListTokenBalancesOptions, "address">) => Promise<ListTokenBalancesResult>;
  name?: string;
  policies?: string[];
  quoteFund: (options: Omit<EvmQuoteFundOptions, "address">) => Promise<EvmQuote>;
  quoteSwap: (options: AccountQuoteSwapOptions) => Promise<AccountQuoteSwapResult>;
  requestFaucet: (options: Omit<RequestFaucetOptions, "address">) => Promise<RequestFaucetResult>;
  sendTransaction: (options: Omit<SendTransactionOptions, "address">) => Promise<TransactionResult>;
  sign: (parameters: {
     hash: `0x${string}`;
  }) => Promise<`0x${string}`>;
  signMessage: (parameters: {
     message: SignableMessage;
  }) => Promise<`0x${string}`>;
  signTransaction: (transaction: TransactionSerializable) => Promise<`0x${string}`>;
  signTypedData: <typedData, primaryType>(parameters: TypedDataDefinition<typedData, primaryType>) => Promise<`0x${string}`>;
  swap: (options: AccountSwapOptions) => Promise<SendSwapTransactionResult>;
  transfer: (options: TransferOptions) => Promise<{
     transactionHash: `0x${string}`;
  }>;
  type: "evm-server";
  useNetwork: <Network>(network: Network) => Promise<{ [K in string | number | symbol]: (Omit<{ address: `0x${string}`; fund: (options: Omit<(...), (...)>) => Promise<(...)>; listTokenBalances: (options: Omit<(...), (...)>) => Promise<(...)>; name?: string; policies?: (...)[]; quoteFund: (options: Omit<(...), (...)>) => Promise<(...)>; quoteSwap: (options: AccountQuoteSwapOptions) => Promise<(...)>; requestFaucet: (options: Omit<(...), (...)>) => Promise<(...)>; sendTransaction: (options: Omit<(...), (...)>) => Promise<(...)>; sign: (parameters: { hash: ... }) => Promise<(...)>; signMessage: (parameters: { message: ... }) => Promise<(...)>; signTransaction: (transaction: TransactionSerializable) => Promise<(...)>; signTypedData: (parameters: TypedDataDefinition<(...), (...)>) => Promise<(...)>; swap: (options: AccountSwapOptions) => Promise<(...)>; transfer: (options: TransferOptions) => Promise<(...)>; type: "evm-server"; useNetwork: <Network extends NetworkOrRpcUrl>(network: Network) => Promise<{ [K in keyof (Omit<{ address: `0x${string}`; sign: (parameters: { hash: `0x${string}`; }) => Promise<`0x${string}`>; signMessage: (parameters: { message: SignableMessage; }) => Promise<...>; ... 15 more ...; useNetwork: ...; }, "transfer" | ... 5 more ....; useSpendPermission: (options: UseSpendPermissionOptions) => Promise<(...)>; waitForFundOperationReceipt: any }, "transfer" | "sendTransaction" | "quoteSwap" | "swap" | "useSpendPermission" | "useNetwork" | (keyof Actions)> & { [K in string | number | symbol]: ({ sendTransaction: ...; transfer: ...; waitForTransactionReceipt: ... } & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)))[K] } & { network: Network })[K] }>;
  useSpendPermission: (options: UseSpendPermissionOptions) => Promise<TransactionResult>;
  waitForFundOperationReceipt: Promise<WaitForFundOperationResult>;
}>;
```

Defined in: [src/client/evm/evm.ts:1287](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L1287)

Updates a CDP EVM account.

###### Parameters

###### options?

[`UpdateEvmAccountOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#updateevmaccountoptions)

Optional parameters for creating the account.

###### Returns

`Promise`\<\{
`address`: `` `0x${string}` ``;
`fund`: (`options`: `Omit`\<`EvmFundOptions`, `"address"`>) => `Promise`\<`FundOperationResult`>;
`listTokenBalances`: (`options`: `Omit`\<`ListTokenBalancesOptions`, `"address"`>) => `Promise`\<`ListTokenBalancesResult`>;
`name?`: `string`;
`policies?`: `string`\[];
`quoteFund`: (`options`: `Omit`\<`EvmQuoteFundOptions`, `"address"`>) => `Promise`\<`EvmQuote`>;
`quoteSwap`: (`options`: `AccountQuoteSwapOptions`) => `Promise`\<`AccountQuoteSwapResult`>;
`requestFaucet`: (`options`: `Omit`\<`RequestFaucetOptions`, `"address"`>) => `Promise`\<`RequestFaucetResult`>;
`sendTransaction`: (`options`: `Omit`\<`SendTransactionOptions`, `"address"`>) => `Promise`\<`TransactionResult`>;
`sign`: (`parameters`: \{
`hash`: `` `0x${string}` ``;
}) => `Promise`\<`` `0x${string}` ``>;
`signMessage`: (`parameters`: \{
`message`: `SignableMessage`;
}) => `Promise`\<`` `0x${string}` ``>;
`signTransaction`: (`transaction`: `TransactionSerializable`) => `Promise`\<`` `0x${string}` ``>;
`signTypedData`: \<`typedData`, `primaryType`>(`parameters`: `TypedDataDefinition`\<`typedData`, `primaryType`>) => `Promise`\<`` `0x${string}` ``>;
`swap`: (`options`: `AccountSwapOptions`) => `Promise`\<`SendSwapTransactionResult`>;
`transfer`: (`options`: `TransferOptions`) => `Promise`\<\{
`transactionHash`: `` `0x${string}` ``;
}>;
`type`: `"evm-server"`;
`useNetwork`: \<`Network`>(`network`: `Network`) => `Promise`\<\{ \[K in string | number | symbol]: (Omit\<\{ address: \`0x$\{string\}\`; fund: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; listTokenBalances: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; name?: string; policies?: (...)\[\]; quoteFund: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; quoteSwap: (options: AccountQuoteSwapOptions) =\> Promise\<(...)\>; requestFaucet: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; sendTransaction: (options: Omit\<(...), (...)\>) =\> Promise\<(...)\>; sign: (parameters: \{ hash: ... \}) =\> Promise\<(...)\>; signMessage: (parameters: \{ message: ... \}) =\> Promise\<(...)\>; signTransaction: (transaction: TransactionSerializable) =\> Promise\<(...)\>; signTypedData: (parameters: TypedDataDefinition\<(...), (...)\>) =\> Promise\<(...)\>; swap: (options: AccountSwapOptions) =\> Promise\<(...)\>; transfer: (options: TransferOptions) =\> Promise\<(...)\>; type: "evm-server"; useNetwork: \<Network extends NetworkOrRpcUrl\>(network: Network) =\> Promise\<\{ \[K in keyof (Omit\<\{ address: \`0x$\{string}\`; sign: (parameters: \{ hash: \`0x$\{string\}\`; \}) =\> Promise\<\`0x$\{string}\`>; signMessage: (parameters: \{ message: SignableMessage; }) => Promise\<...>; ... 15 more ...; useNetwork: ...; }, "transfer" | ... 5 more ....; useSpendPermission: (options: UseSpendPermissionOptions) => Promise\<(...)>; waitForFundOperationReceipt: any }, "transfer" | "sendTransaction" | "quoteSwap" | "swap" | "useSpendPermission" | "useNetwork" | (keyof Actions)> & \{ \[K in string | number | symbol]: (\{ sendTransaction: ...; transfer: ...; waitForTransactionReceipt: ... } & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)))\[K] } & \{ network: Network })\[K] }>;
`useSpendPermission`: (`options`: `UseSpendPermissionOptions`) => `Promise`\<`TransactionResult`>;
`waitForFundOperationReceipt`: `Promise`\<`WaitForFundOperationResult`>;
}>

A promise that resolves to the updated account.

###### Examples

```ts
         const account = await cdp.evm.updateAccount({ address: "0x...", update: { name: "New Name" } });
```

```ts
         const account = await cdp.evm.updateAccount({ address: "0x...", update: { accountPolicy: "73bcaeeb-d7af-4615-b064-42b5fe83a31e" } });
```

```ts
         const idempotencyKey = uuidv4();

         // First call
         await cdp.evm.updateAccount({
           address: "0x...",
           update: { accountPolicy: "73bcaeeb-d7af-4615-b064-42b5fe83a31e" },
           idempotencyKey,
         });

         // Second call with the same idempotency key will not update
         await cdp.evm.updateAccount({
           address: '0x...',
           update: { name: "" },
           idempotencyKey,
         });
```

###### Implementation of

```ts
EvmClientInterface.updateAccount
```

##### updateSmartAccount()

```ts
updateSmartAccount(options?: UpdateEvmSmartAccountOptions): Promise<{
  address: `0x${string}`;
  fund: (options: Omit<EvmFundOptions, "address">) => Promise<FundOperationResult>;
  getUserOperation: (options: Omit<GetUserOperationOptions, "smartAccount">) => Promise<UserOperation>;
  listTokenBalances: (options: Omit<ListTokenBalancesOptions, "address">) => Promise<ListTokenBalancesResult>;
  name?: string;
  owners: EvmAccount[];
  policies: undefined | string[];
  quoteFund: (options: Omit<EvmQuoteFundOptions, "address">) => Promise<EvmQuote>;
  quoteSwap: (options: SmartAccountQuoteSwapOptions) => Promise<SmartAccountQuoteSwapResult>;
  requestFaucet: (options: Omit<RequestFaucetOptions, "address">) => Promise<RequestFaucetResult>;
  sendUserOperation: (options: Omit<SendUserOperationOptions<unknown[]>, "smartAccount">) => Promise<SendUserOperationReturnType>;
  signTypedData: (options: Omit<SignTypedDataOptions, "address"> & {
     network: KnownEvmNetworks;
  }) => Promise<`0x${string}`>;
  swap: (options: SmartAccountSwapOptions) => Promise<SmartAccountSwapResult>;
  transfer: (options: SmartAccountTransferOptions) => Promise<SendUserOperationReturnType>;
  type: "evm-smart";
  useNetwork: <Network>(network: Network) => Promise<{ [K in string | number | symbol]: (Omit<EvmSmartAccountProperties, "useNetwork"> & { [K in string | number | symbol]: ({ getUserOperation: ...; sendUserOperation: ...; waitForUserOperation: ... } & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)))[K] } & { network: Network })[K] }>;
  useSpendPermission: (options: UseSpendPermissionOptions) => Promise<SendUserOperationReturnType>;
  waitForUserOperation: (options: Omit<WaitForUserOperationOptions, "smartAccountAddress">) => Promise<WaitForUserOperationReturnType>;
  waitForFundOperationReceipt: Promise<WaitForFundOperationResult>;
}>;
```

Defined in: [src/client/evm/evm.ts:1319](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L1319)

Updates a CDP EVM smart account.

###### Parameters

###### options?

[`UpdateEvmSmartAccountOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#updateevmsmartaccountoptions)

Optional parameters for updating the account.

###### Returns

`Promise`\<\{
`address`: `` `0x${string}` ``;
`fund`: (`options`: `Omit`\<`EvmFundOptions`, `"address"`>) => `Promise`\<`FundOperationResult`>;
`getUserOperation`: (`options`: `Omit`\<[`GetUserOperationOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#getuseroperationoptions), `"smartAccount"`>) => `Promise`\<[`UserOperation`](/sdks/cdp-sdks-v2/typescript/evm/Types#useroperation)>;
`listTokenBalances`: (`options`: `Omit`\<`ListTokenBalancesOptions`, `"address"`>) => `Promise`\<`ListTokenBalancesResult`>;
`name?`: `string`;
`owners`: [`EvmAccount`](/sdks/cdp-sdks-v2/typescript/evm/Accounts#evmaccount)\[];
`policies`: `undefined` | `string`\[];
`quoteFund`: (`options`: `Omit`\<`EvmQuoteFundOptions`, `"address"`>) => `Promise`\<`EvmQuote`>;
`quoteSwap`: (`options`: `SmartAccountQuoteSwapOptions`) => `Promise`\<`SmartAccountQuoteSwapResult`>;
`requestFaucet`: (`options`: `Omit`\<`RequestFaucetOptions`, `"address"`>) => `Promise`\<`RequestFaucetResult`>;
`sendUserOperation`: (`options`: `Omit`\<`SendUserOperationOptions`\<`unknown`\[]>, `"smartAccount"`>) => `Promise`\<`SendUserOperationReturnType`>;
`signTypedData`: (`options`: `Omit`\<[`SignTypedDataOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#signtypeddataoptions), `"address"`> & \{
`network`: `KnownEvmNetworks`;
}) => `Promise`\<`` `0x${string}` ``>;
`swap`: (`options`: `SmartAccountSwapOptions`) => `Promise`\<`SmartAccountSwapResult`>;
`transfer`: (`options`: `SmartAccountTransferOptions`) => `Promise`\<`SendUserOperationReturnType`>;
`type`: `"evm-smart"`;
`useNetwork`: \<`Network`>(`network`: `Network`) => `Promise`\<\{ \[K in string | number | symbol]: (Omit\<EvmSmartAccountProperties, "useNetwork"> & \{ \[K in string | number | symbol]: (\{ getUserOperation: ...; sendUserOperation: ...; waitForUserOperation: ... } & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)))\[K] } & \{ network: Network })\[K] }>;
`useSpendPermission`: (`options`: `UseSpendPermissionOptions`) => `Promise`\<`SendUserOperationReturnType`>;
`waitForUserOperation`: (`options`: `Omit`\<`WaitForUserOperationOptions`, `"smartAccountAddress"`>) => `Promise`\<`WaitForUserOperationReturnType`>;
`waitForFundOperationReceipt`: `Promise`\<`WaitForFundOperationResult`>;
}>

A promise that resolves to the updated account.

###### Implementation of

```ts
EvmClientInterface.updateSmartAccount
```

##### waitForUserOperation()

```ts
waitForUserOperation(options: WaitForUserOperationOptions): Promise<WaitForUserOperationReturnType>;
```

Defined in: [src/client/evm/evm.ts:1372](https://github.com/coinbase/cdp-sdk/blob/8794662b60e721852bfb60801a1d0bb1bb6e4c59/typescript/src/client/evm/evm.ts#L1372)

Waits for a user operation to complete or fail.

###### Parameters

###### options

[`WaitForUserOperationOptions`](/sdks/cdp-sdks-v2/typescript/evm/Types#waitforuseroperationoptions)

Parameters for waiting for the user operation.

###### Returns

`Promise`\<`WaitForUserOperationReturnType`>

A promise that resolves to the transaction receipt.

###### Example

```ts
// Send a user operation and get the user operation hash
const { userOpHash } = await cdp.evm.sendUserOperation({
  smartAccount,
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
const result = await cdp.evm.waitForUserOperation({
  smartAccountAddress: smartAccount.address,
  userOpHash: userOp.userOpHash,
});
```
